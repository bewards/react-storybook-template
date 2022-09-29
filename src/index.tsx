import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { createStore } from '$/redux/createStore'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from '$/App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { LocaleWrapper } from '$/components'
import { pushFetchImpl } from './util/fetch'
import type { ApiContract } from '$/lib/api-mocking/interfaces/ApiContract'
import type { InitFetch } from '$/lib/api-mocking/initFetchMock'

const renderApp = (): void => {
  const markup = (
    <Provider store={createStore()}>
      <LocaleWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleWrapper>
    </Provider>
  )

  // using `as HTMLElement` here because otherwise TS complains that `container` could be null and
  // `createRoot` does not accept null. We know that our index.html has a `div#root` so in this
  // instance it's ok to coerce this type
  const container = document.getElementById('root') as HTMLElement
  const root = createRoot(container)
  root.render(markup)

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
}

/***************************************************************************************************************
 * We conditionally load the following dependencies so that they don't add to page weight in production builds *
 ***************************************************************************************************************/

const promises: Array<Promise<unknown>> = []
if (import.meta.env.VITE_USE_MOCK_BACKEND === 'true') {
  // We want all of this code to bet lazy loaded so that it doesn't ever accidentally
  // become part of the production main.js. By lazy loading, this code is pushed to a
  // chunk that will only get loaded if we expressly want to use the mock backend
  const fetchPromises = [import('$/mockApi/contracts'), import('$/lib/api-mocking/initFetchMock')]
  const apiContractPromise = Promise.all(fetchPromises).then(importedValues => {
    const contracts = importedValues[0] as { apiContracts: ApiContract[] }
    const initFetchMock = importedValues[1] as { initFetchMockForDevelopment: InitFetch }
    pushFetchImpl(initFetchMock.initFetchMockForDevelopment(contracts.apiContracts))
  })
  promises.push(apiContractPromise)
} else {
  pushFetchImpl(window.fetch)
}

if (process.env.NODE_ENV !== 'production') {
  const axePromise = import('./util/axe-core-importer').then(({ setupAxe }) => {
    setupAxe()
  })
  promises.push(axePromise)
}

Promise.all(promises).then(() => {
  renderApp()
})
