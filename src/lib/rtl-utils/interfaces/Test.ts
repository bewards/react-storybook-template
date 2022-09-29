import { RenderResult } from '@testing-library/react'
import { FetchMockSandbox } from 'fetch-mock'
import type { Mock } from 'vitest'

/**
 * When you render a component using testUtils.renderForTestSuite() or testUtils.renderForSingleTest(), you will get this
 * object in return. It is the same result that you get from RTL ('@testing-library/react') render, but with some additional
 * values documented below.
 */
export type RenderedTest<ComponentProps, AppStateStore> = RenderResult & BaseRenderedTest<ComponentProps, AppStateStore>

interface BaseRenderedTest<ComponentProps, AppStateStore> {
  /**
   * These are the props that were passed to your component when it rendered
   */
  props: ComponentProps

  /**
   * This is the instance of fetchMock that was instantiated for this test
   */
  fetchMock: FetchMockSandbox

  /**
   * This is the instance of the application state container that was instantiated for this test. For redux projects,
   * this would be the redux store.
   */
  appStateStore: AppStateStore

  /**
   * This is the spy on the history (window.location.history) object that was used for the test
   */
  navigateSpy: Mock

  /**
   * This is a convenience function that can be used to rerender the component with new props
   */
  updateProps: (newProps: ComponentProps) => void
}
