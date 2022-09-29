import fetch_mock, { FetchMockSandbox } from 'fetch-mock/esm/client'
import { ApiContract } from './interfaces/ApiContract'
import { contractsForRuntime, contractsForTests } from './loadContracts'

export type InitFetch = (contracts: ApiContract[]) => FetchMockSandbox

export const initFetchMockForDevelopment: InitFetch = contracts => {
  fetch_mock.config.fallbackToNetwork = true
  fetch_mock.config.warnOnFallback = false
  fetch_mock.config.overwriteRoutes = true
  contractsForRuntime(fetch_mock, contracts)
  const sandbox = fetch_mock.sandbox.bind(fetch_mock)
  const fetchImpl = sandbox()

  Object.assign(fetchImpl.config, {
    fetch: window.fetch,
  })

  return fetchImpl
}

export const initFetchMockForTests: InitFetch = contracts => {
  fetch_mock.config.fallbackToNetwork = false
  fetch_mock.config.warnOnFallback = false
  fetch_mock.config.overwriteRoutes = true
  contractsForTests(fetch_mock, contracts)
  const sandbox = fetch_mock.sandbox.bind(fetch_mock)
  return sandbox()
}
