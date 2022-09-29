import { FetchMockSandbox } from 'fetch-mock'

// FetchMockSandbox and typeof fetch are not 100% compatible. TS will error if you just use typeof
// fetch because fetch's first argument is required, but FetchMockSandbox allows it to be undefined.
// So I had to create this type so that TS would stop complaining
type Fetch = typeof fetch | FetchMockSandbox

/**
 * All calls to the fetch API should be made through this utility and never directly
 * from window.fetch()
 *
 * This is an abstraction around the fetch API that serves 5 functions:
 * 1) bring consistency to headers that are sent with requests
 * 2) handle error responses consistently across the application
 * 3) allows alternate fetch implementations to be injected for testing purposes
 * 4) log details about requests made during testing to help troubleshoot issues
 * 5) allow your application to run offline in dev mode by initializing with
 *    a mock implementation of fetch
 *
 * This utility allows for multiple fetch implementations to be tracked and used.
 * The fetch implementations are stored in a stack, and the implementation at the top
 * of the stack is the one that is used when fetch operations are performed.
 *
 * Before any operations can be performed, a fetch implementation must be placed
 * on the stack by calling pushFetchImpl() which should be done prior to the
 * initialization of your application as shown below.
 *
 *    import { pushFetchImpl } from './util/fetch'
 *    pushFetchImpl(window.fetch)
 *    render(<App/>, document.getElementById('root'))
 *
 * This implementation stack is needed so that test suites that
 * are nested inside other test suites can both push their own fetch behaviors to
 * the stack without overriding each other's behaviors.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const get = async (url: string, options = {}): Promise<any> => {
  return await doFetch(currentFetchImpl(), url, 'GET', null, options)
}

export const post = async (url: string, payload = {}, options = {}): Promise<any> => {
  return await doFetch(currentFetchImpl(), url, 'POST', payload, options)
}

export const patch = async (url: string, payload = {}, options = {}): Promise<any> => {
  return await doFetch(currentFetchImpl(), url, 'PATCH', payload, options)
}

export const head = async (url: string, options = {}): Promise<any> => {
  return await doFetch(currentFetchImpl(), url, 'HEAD', null, options)
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const doFetch = async (fetchImpl: Fetch, url: string, method = 'GET', payload?, headers: any = {}): Promise<any> => {
  const headersToSend = { ...defaultHeaders, ...headers }

  const fetchConfig: any = {
    method,
    headers: headersToSend,
  }

  if (payload) {
    fetchConfig.body = JSON.stringify(payload)
  }

  const response = await fetchImpl(url, fetchConfig)

  const data = await response.json()

  if (process.env.NODE_ENV === 'test') {
    const fetchMock = fetchImpl as FetchMockSandbox
    const lastOptions = fetchMock.lastOptions()
    const payload = lastOptions ? lastOptions.body : {}
    if (import.meta.env.VITE_FETCH_TRACE_LOGGING === 'true') {
      console.log(url, 'handled by fetchMock\nmethod:', method, '\nheaders:\n', headersToSend, '\npayload:\n', payload)
    }
  }

  if (response.ok) {
    return data
  } else {
    throw data
  }
}

const fetchInstances: Array<Fetch> = []

/**
 * push a new fetch implementation to the top of the implementation stack
 * @param fetchImpl
 */
export const pushFetchImpl = (fetchImpl: Fetch): void => {
  fetchInstances.push(fetchImpl)
}

/**
 * remove the current fetch implementation from the top of the implementation stack
 * and revert to the previous implementation
 */
export const popFetchImpl = (): Fetch | undefined => {
  if (fetchInstances.length < 1) {
    throw Error('There is nothing to popFetchImpl')
  }
  return fetchInstances.pop()
}

const currentFetchImpl = (): Fetch => {
  if (fetchInstances.length < 1) {
    throw Error(
      "No implementations of Fetch exist. You must first call pushFetchImpl with the implementation you'd like to use."
    )
  }

  return fetchInstances[fetchInstances.length - 1]
}
