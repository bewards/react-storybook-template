import { FetchMockSandbox } from 'fetch-mock'
import { MemoryHistoryOptions } from 'history'
import { RenderedTest } from '$/lib/rtl-utils/interfaces/Test'

/**
 * This conditional type allows us to infer the type of the object that the application state container holds.
 * This is written currently only to unbox the redux store, but will need to be updated updated to unbox a
 * different state containers if something other than redux is used.
 */
import { Store } from 'redux'
export type AppStateStoreType<T> = T extends Store<infer R> ? R : T

export interface TestConfig<ComponentProps, AppStateStore> extends TestConfigDefaults {
  /**
   * A callback function that returns an object to be merged with defaultApplicationState (see rtl-utils/interfaces/RtlUtilsConfig.ts).
   * Anything return from here will be copied to the initial application state used to render your component.
   */
  stateProvider?: () => Partial<AppStateStoreType<AppStateStore>>

  /**
   * A callback that is passed the default redux state right after being initialize with defaultApplicationState
   * (see rtl-utils/interfaces/RtlUtilsConfig.ts) prior to rendering the component.
   * The state can be mutated any way that you wish in this callback.
   */
  stateModifier?: (mockState: Partial<AppStateStoreType<AppStateStore>>) => void

  /**
   * A callback function that returns the props you want injected into the the component you are rendering/testing.
   */
  propsProvider?: () => ComponentProps

  /**
   * A callback that is invoked before ComponentUnderTest is rendered. The callback provides access to the instance of
   * fetchMock that was instantiated for this test. Use this callback to override the default behavior of the fetchMock.
   * This is useful when testing how your code handles for scenarios when API given an error response.
   * @param fetchMock
   */
  configureFetchMock?: (fetchMock: FetchMockSandbox) => void

  /**
   * A callback that is invoked after ComponentUnderTest is rendered, but before the process completes. The callback
   * provides access to the instance of the test. This callback is useful for simulating user events that should
   * complete before your test(s) do any assertions.
   * @param test
   */
  doAdditionalSetup?: (test: RenderedTest<ComponentProps, AppStateStore>) => Promise<void>
}

export interface TestConfigDefaults {
  /**
   * Use this optionally to provide props to the router that will wrap ComponentUnderTest. It is useful for setting
   * initialEntries, and initialIndex as documented here https://reactrouter.com/web/api/MemoryRouter
   */
  memoryHistoryOptions?: MemoryHistoryOptions

  /**
   * Use this to provide props to the router that will wrap ComponentUnderTest. If provided is will supply two props
   * router - initialEntries, and initialIndex. initialEntries will be assigned an array of size one with the location
   * as the value, and initialIndex will be set to 0.
   *
   * initialEntries = [location]
   * initialIndex = 0
   *
   * The meaning of these two properties is documented here https://reactrouter.com/web/api/MemoryRouter
   */
  location?: string

  /**
   * Use this option to set the path on the router that wraps ComponentUnderTest - https://reactrouter.com/web/api/Route/path-string-string
   * This is useful when you have code in your component that needs to know the match path - https://reactrouter.com/web/api/matchPath
   */
  routePath?: string

  /**
   * Use this option to disable the wrapping of ComponentUnderTest with a router
   */
  dontWrapWithRoute?: boolean

  /**
   * This option only applies to renderForTestSuite(). If enabled, the initial application state will be restored after each test.
   */
  resetInitialStateAfterEach?: boolean

  /**
   * Enabling this option will call vi.useFakeTimers() before your component renders.
   */
  useFakeTimers?: boolean

  /**
   * If this enabled, the code will let one tick of the event loop pass immediately after first render so that any
   * useEffect hooks in the rendered components that issued API calls will process the responses before your test cases
   * run and start making assertions for things that aren't in the DOM yet. If you want to test that a loading spinner
   * is showing before the API responses are received, then you to need to disable this option, but for most test cases,
   * this will make life easier.
   */
  dispatchApiResponsesImmediately?: boolean
}
