import { vi, beforeAll, afterAll, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { ComponentType, FC } from 'react'
import { flushAsyncQueue } from './index'
import { RenderedTest } from './interfaces/Test'
import { AppStateStoreType, TestConfig, TestConfigDefaults } from './interfaces/TestConfig'
import { RtlUtilsConfig } from './interfaces/RtlUtilsConfig'
import { cleanup, render } from '@testing-library/react'
import { getRtlUtilsConfig } from './init'
import { initFetchMockForTests } from '$/lib/api-mocking/initFetchMock'
import { popFetchImpl, pushFetchImpl } from '$/util/fetch'
import { FetchMockSandbox } from 'fetch-mock'
import { MemoryHistoryOptions } from 'history'

import { Route, Routes, MemoryRouter } from 'react-router-dom'

// Read more about why it's preferable to have individual lodash functions here:
// https://github.com/Rightpoint/rp-react-best-practices/issues/77
import cloneDeep from 'lodash/cloneDeep'

/**
 * AppStateStore refers to the object that holds your application state. If you are using Redux, it would be the redux store.
 */
export class ComponentTest<ComponentProps, AppStateStore> {
  private readonly ComponentUnderTest: ComponentType<ComponentProps>

  constructor(ComponentUnderTest: ComponentType<ComponentProps>) {
    this.ComponentUnderTest = ComponentUnderTest
  }

  private testConfigDefaults: TestConfigDefaults = {
    memoryHistoryOptions: {
      initialEntries: ['/'],
      initialIndex: 0,
    },
    location: '/',
    dontWrapWithRoute: false,
    resetInitialStateAfterEach: false,
    useFakeTimers: false,
    dispatchApiResponsesImmediately: false,
  }

  /**
   * For more a more comprehensive understanding of what this can do, study the configuration options in
   * src/testUtils/interfaces/TestConfig.ts
   *
   * Call this inside your describe block to render your component. This will mount the component once before
   * all of the tests and then clean itself up at the end of the describe block. This pattern renders the component
   * in the beforeAll, before calling executing any test cases. This is more a efficient way than rendering your
   * component over an over for each test case, but it is not a recommended approach because it has it has some
   * downsides that can trip developers up. Namely, if the component fails to mount properly because of an error, the
   * test runner will not report the failure in a way that most developers are familiar with and might create confusion.
   * If rendering for each test case is more your style and you aren't time constrained, then you can do the exact same
   * thing as this function, but on a test case by test case basis by using `renderForTestSuite` below.
   *
   * Simple Success Path Example:
   *

   import MyComponent from '$/pages/MyComponent'
   import { expectRequestMade, renderForTestSuite} from '$/testUtils/testUtils'

   describe('My Component Test Suite', () => {
    const test = new ComponentTest<RootState>(MyComponent).renderForTestSuite()

    it('should load data from /api/myApi when the component mounts', () => {
      expectRequestMade('/api/myApi')
    })
   })

   *
   * Simple Error Path Example:
   *

   import MyComponent from '$/pages/MyComponent'
   import { renderForTestSuite} from '$/testUtils/testUtils'
   import { respondWithError } from '$/mockApi/loadContracts'
   import contract from '$/mockApi/contracts/api-project'

   describe('My Component Test Suite', () => {
    const test = new ComponentTest<RootState>(MyComponent).renderForTestSuite({
      configureFetchMock: fetchMock => {
        respondWithError(fetchMock, contract)
      },
    })

    it('should display pretty error message when the api call fails', () => {
      test.getByText('Uh Oh!')
    })
   })

   *
   * @param options - see src/testUtils/interfaces/TestConfig.ts
   * @returns {Promise<any>}
   */
  public renderForTestSuite(
    options: TestConfig<ComponentProps, AppStateStore> = {}
  ): RenderedTest<ComponentProps, AppStateStore> {
    const testShell: RenderedTest<ComponentProps, AppStateStore> = {} as RenderedTest<ComponentProps, AppStateStore>
    let test: RenderedTest<ComponentProps, AppStateStore>

    beforeAll(async () => {
      const fetchMock = initFetchMockForTests(getRtlUtilsConfig().apiContracts)
      pushFetchImpl(fetchMock)
      test = await this.renderComponent(this.ComponentUnderTest, options, fetchMock)
      Object.assign(testShell, test)
    })

    afterEach(() => {
      this.doAfterEach(test)
    })

    afterAll(() => {
      this.doAfterAll(test)
    })

    return testShell
  }

  /**
   * For more a more comprehensive understanding of what this can do, study the configuration options in
   * src/testUtils/interfaces/TestConfig.ts

   * If you don't use renderForTestSuite, then use this in each `it` block to mount and clean up a component
   * for a single test case.
   *
   * Simple Success Path Example:
   *

   import { expectRequestMade, renderForSingleTest} from '$/testUtils/testUtils'
   import MyComponent from '$/pages/MyComponent'

   describe('My Component Test Suite', () => {
    it('should load data from /api/myApi when the component mounts', async () => {
      await new ComponentTest<RootState>(MyComponent).renderForSingleTest({
      renderForSingleTest(MyComponent, {})
      })

      expectRequestMade('/api/myApi')
   })

   *
   * Simple Error Path Example:
   *

   import MyComponent from '$/pages/MyComponent'
   import { renderForTestSuite} from '$/testUtils/testUtils'
   import { respondWithError } from '$/mockApi/loadContracts'
   import contract from '$/mockApi/contracts/api-project'

   describe('My Component Test Suite', async () => {
    it('should display pretty error message when the api call fails', () => {
      await new ComponentTest<RootState>(MyComponent).renderForSingleTest({
        configureFetchMock: fetchMock => {
          respondWithError(fetchMock, contract)
        }
      });

      screen.getByText('Uh Oh!')
   })
  })

   *
   * @param options - see src/testUtils/interfaces/TestConfig.ts
   * @param callback - in order to ensure that test assertions happen before cleanup is done, assertions must be done in this callback
   * @returns {Promise<any>}
   */
  public async renderForSingleTest(
    options: TestConfig<ComponentProps, AppStateStore> = {},
    callback?: (test: RenderedTest<ComponentProps, AppStateStore>) => void
  ): Promise<RenderedTest<ComponentProps, AppStateStore>> {
    let test: RenderedTest<ComponentProps, AppStateStore> | null = null
    try {
      const fetchMock = initFetchMockForTests(getRtlUtilsConfig().apiContracts)
      pushFetchImpl(fetchMock)
      test = await this.renderComponent(this.ComponentUnderTest, options, fetchMock)
      if (callback) {
        callback(test)
      }
      return test
    } finally {
      this.doAfterEach(test)
      this.doAfterAll(test)
    }
  }

  private doAfterEach(test: RenderedTest<ComponentProps, AppStateStore> | null): void {
    if (test) {
      test.navigateSpy.mockReset()
      test.fetchMock.resetHistory()
    }
  }

  private doAfterAll(test: RenderedTest<ComponentProps, AppStateStore> | null): void {
    if (test) {
      test.fetchMock.reset()
    }

    vi.restoreAllMocks()

    // do any cleanup that was configured during initialization
    popFetchImpl()
    const rtlUtilsConfig = getRtlUtilsConfig<AppStateStore>()
    if (rtlUtilsConfig.cleanupComponentTest) {
      rtlUtilsConfig.cleanupComponentTest(test)
    }

    // during initialization we disabled the default RTL cleanup behavior that happens in afterEach. We do this because
    // we want to defer this clean up until after our ComponentTest is complete. This change allows us to render once
    // for multiple tests and gives improved performance.
    cleanup()
  }

  private async renderComponent(
    ComponentUnderTest: ComponentType<ComponentProps>,
    testConfig: TestConfig<ComponentProps, AppStateStore>,
    fetchMock: FetchMockSandbox
  ): Promise<RenderedTest<ComponentProps, AppStateStore>> {
    const rtlUtilsConfig: RtlUtilsConfig<AppStateStore> = getRtlUtilsConfig()

    const testConfigWithDefaults: TestConfig<ComponentProps, AppStateStore> = {
      ...this.testConfigDefaults, // built-in defaults
      ...rtlUtilsConfig.testConfigDefaults, // default overrides configured in RtlUtilsConfig
      ...testConfig, // config for this specific test
    }

    let { memoryHistoryOptions } = testConfigWithDefaults
    if (!memoryHistoryOptions) {
      memoryHistoryOptions = {
        initialEntries: ['/'],
        initialIndex: 0,
      }
    }
    if (testConfigWithDefaults.location) {
      memoryHistoryOptions.initialEntries?.push(testConfigWithDefaults.location)
      memoryHistoryOptions.initialIndex = (memoryHistoryOptions.initialIndex || 0) + 1
    }

    if (testConfigWithDefaults.configureFetchMock) {
      testConfigWithDefaults.configureFetchMock(fetchMock)
    }

    const initialState = this.initMockApplicationState(testConfigWithDefaults)
    const appStateStore: AppStateStore = rtlUtilsConfig.createAppStateStore
      ? rtlUtilsConfig.createAppStateStore(initialState)
      : ({} as AppStateStore)

    let props: ComponentProps = {} as ComponentProps
    if (testConfigWithDefaults.propsProvider) {
      props = testConfigWithDefaults.propsProvider()
    }

    if (testConfigWithDefaults.useFakeTimers) {
      vi.useFakeTimers()
    }

    let ComponentWrappedInProviders: ComponentType<ComponentProps> = this.wrapComponentWithProviders(
      ComponentUnderTest,
      memoryHistoryOptions,
      testConfigWithDefaults.routePath || testConfigWithDefaults.location || '/',
      testConfigWithDefaults.dontWrapWithRoute
    )

    const myTestConfig: TestConfig<ComponentProps, unknown> = {}

    if (rtlUtilsConfig.wrapComponentTest) {
      ComponentWrappedInProviders = rtlUtilsConfig.wrapComponentTest(
        ComponentWrappedInProviders,
        myTestConfig,
        appStateStore
      )
    }

    const renderResult = render(<ComponentWrappedInProviders {...props} />)
    const rerender = renderResult.rerender

    const test: RenderedTest<ComponentProps, AppStateStore> = {
      ...testConfigWithDefaults,
      ...renderResult,
      props: props as ComponentProps,
      fetchMock,
      appStateStore: appStateStore as AppStateStore,
      navigateSpy: getRtlUtilsConfig().mockNavigate as Mock,
      updateProps: newProps => {
        rerender(<ComponentWrappedInProviders {...props} {...newProps} />)
      },
    }

    if (testConfigWithDefaults.dispatchApiResponsesImmediately) {
      await flushAsyncQueue()
    }

    if (testConfigWithDefaults.doAdditionalSetup) {
      await testConfigWithDefaults.doAdditionalSetup(test)
    }

    return test
  }

  private wrapComponentWithProviders = (
    ComponentUnderTest: ComponentType<ComponentProps>,
    memoryHistoryOptions: MemoryHistoryOptions,
    routePath: string,
    dontWrapWithRoute = false
  ): ComponentType<ComponentProps> => {
    const TestWrapper: FC<ComponentProps> = injectedProps => (
      <MemoryRouter {...memoryHistoryOptions}>
        {dontWrapWithRoute ? (
          <ComponentUnderTest {...injectedProps} />
        ) : (
          <Routes>
            <Route path={routePath} element={<ComponentUnderTest {...injectedProps} />} />
          </Routes>
        )}
      </MemoryRouter>
    )

    return TestWrapper
  }

  private initMockApplicationState(
    config: TestConfig<ComponentProps, AppStateStore>
  ): AppStateStoreType<AppStateStore> {
    const rtlUtilsConfig = getRtlUtilsConfig()

    let providedState: Partial<AppStateStoreType<AppStateStore>> = {}
    if (config.stateProvider) {
      providedState = config.stateProvider()
    }

    const mockState = cloneDeep({
      ...rtlUtilsConfig.defaultApplicationState,
      ...providedState,
    }) as AppStateStoreType<AppStateStore>

    if (config.stateModifier) {
      config.stateModifier(mockState)
    }

    return mockState
  }
}
