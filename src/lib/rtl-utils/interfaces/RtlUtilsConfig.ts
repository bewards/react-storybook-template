import { ComponentType } from 'react'
import type { Mock } from 'vitest'
import { ApiContract } from '$/lib/api-mocking/interfaces/ApiContract'
import { TestConfig, AppStateStoreType, TestConfigDefaults } from './TestConfig'
import { RenderedTest } from './Test'

export interface RtlUtilsConfig<AppStateStore> {
  /**
   * Provide an array of API contracts that you want automatically loaded for every test. All API contracts that are
   * scoped for tests will be used, and the success contracts will be loaded. Error contracts are not loaded be default
   * for every test. Error contracts must be loaded on a test by test basis.
   */
  apiContracts: ApiContract[]

  /**
   * This is optional.
   * Provide an object that contains the default starting application state that will be used for every test.
   */
  defaultApplicationState?: Partial<AppStateStoreType<AppStateStore>>

  /**
   * This is optional.
   * Use this function to create the application store that will be used for each test.
   * For redux projects, this would be a redux store that has been initialized with all of the same middleware
   * the your application uses.
   * @param initialState - this is the initial application state to use when creating your state component (which
   * would be the redux store if you are using redux)
   */
  createAppStateStore?: (initialState: AppStateStoreType<AppStateStore>) => AppStateStore

  /**
   * Before each ComponentTest is rendered, it is wrapped in a router. If you need to wrap it with any additional
   * providers such as a redux provider, you can do it here.
   * @param TestWrapper - This is the component that is being rendered in the current test.
   * @param testConfig - this is the configuration used for the current test that is being rendered.
   * @param appStateStore - this is the store that manages your state. For redux, it would be the redux store. If you
   * have not implemented createAppStateStore above, then this will be an empty object.
   */
  wrapComponentTest?: <ComponentProps>(
    TestWrapper: ComponentType<ComponentProps>,
    testConfig: TestConfig<ComponentProps, AppStateStore>,
    appStateStore?: AppStateStore
  ) => ComponentType<ComponentProps>

  /**
   * cleanup code that is run for each ComponentTest. This function will run for at the end of each ComponentTest.
   * @param TestWrapper
   * @param testConfig
   */
  cleanupComponentTest?: <ComponentProps>(test: RenderedTest<ComponentProps, AppStateStore> | null) => void

  /**
   * This is an internal implementation detail that can be ignored by users of RTL Utils. During initialization,
   * RTL Utils replaces useNavigate with a spy so that navigations performed by tested components can be monitored
   * and asserted by your tests. This simply holds a reference to that spy that is provided to the test object
   * provided by renderForTestSuite and renderForSingleTest.
   */
  mockNavigate?: Mock

  /**
   * If you'd like to configure specific defaults for your tests, you can specify them here.
   */
  testConfigDefaults?: TestConfigDefaults
}
