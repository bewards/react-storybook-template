/**
 * jest-dom adds custom jest matchers for asserting on DOM nodes.
 * This allows you to do things like:
 * expect(element).toHaveTextContent(/react/i)
 * learn more: https://github.com/testing-library/jest-dom
 */
import 'whatwg-fetch'
import matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'
import { LocaleWrapper } from '$/components'
import { createStore } from '$/redux/createStore'
import { initRtlUtils } from '$/lib/rtl-utils/init'
import { RtlUtilsConfig } from '$/lib/rtl-utils/interfaces/RtlUtilsConfig'
import { apiContracts } from '$/mockApi/contracts'
import { defaultReduxState } from '$/redux/defaultReduxTestState'
import { RootState } from '$/models/ui/RootState'
import { Provider } from 'react-redux'
import { Store } from 'redux'

// https://github.com/testing-library/jest-dom/issues/439
// same as: import '@testing-library/jest-dom/extend-expect'
expect.extend(matchers)

/**
 * rtl-utils must be initialized with several things as shown below. For more info about what is required to initialize
 * it, explore the JS Docs in src/lib/rtl-utils/interfaces/RtlUtilsConfig.ts
 */

const rtlUtilsConfig: RtlUtilsConfig<Store<RootState>> = {
  apiContracts,
  defaultApplicationState: defaultReduxState,
  testConfigDefaults: {
    dispatchApiResponsesImmediately: true,
  },
  createAppStateStore: initialState => {
    return createStore(initialState)
  },
  wrapComponentTest: (TestWrapper, testConfig, appStateStore) => {
    return function TestWrapperWithLocaleAndReduxProviders(injectedProps): React.ReactElement {
      return (
        <Provider store={appStateStore as Store<RootState>}>
          <LocaleWrapper>
            <TestWrapper {...injectedProps} />
          </LocaleWrapper>
        </Provider>
      )
    }
  },
}
initRtlUtils(rtlUtilsConfig)
