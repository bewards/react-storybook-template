import { ApiContract, RequestOptions } from '$/lib/api-mocking/interfaces/ApiContract'
import type { FetchMockStatic } from 'fetch-mock'
import routington from 'routington'

/**
 * This loads your api apiContracts for use during runtime. This allows you to develop without a backend.
 * @param fetchMock
 * @param apiContracts
 */
export const contractsForRuntime = (
  fetchMock: FetchMockStatic,
  apiContracts: ApiContract<unknown, unknown, unknown>[]
): void => {
  for (const contract of apiContracts) {
    if (contract.scope.runtime) {
      respondWithSuccess(fetchMock, contract)
    }
  }
}

/**
 * This loads your api apiContracts for use during tests.
 * @param fetchMock
 * @param apiContracts
 */
export const contractsForTests = (
  fetchMock: FetchMockStatic,
  apiContracts: ApiContract<unknown, unknown, unknown>[]
): void => {
  for (const contract of apiContracts) {
    if (contract.scope.test) {
      respondWithSuccess(fetchMock, contract)
    }
  }
}

/**
 * Configures fetchMock with success path of your contract.
 * @param fetchMock
 * @param contract
 */
export function respondWithSuccess<Contract extends ApiContract<unknown, unknown, unknown>>(
  fetchMock: FetchMockStatic,
  contract: Contract
): void {
  configureResponse(fetchMock, contract, 'success')
}

/**
 * Configures fetchMock with success path of your contract.
 * @param fetchMock
 * @param contract
 */
export function respondWithError<Contract extends ApiContract<unknown, unknown, unknown>>(
  fetchMock: FetchMockStatic,
  contract: Contract
): void {
  configureResponse(fetchMock, contract, 'error')
}

type SuccessOrError = 'success' | 'error'

function configureResponse<Contract extends ApiContract<unknown, unknown, unknown>>(
  fetchMock: FetchMockStatic,
  contract: Contract,
  successOrError: SuccessOrError
): void {
  const { method, [successOrError]: responseFunction } = contract

  const matcher = {
    url: formatUrlPattern(contract.url),
    method,
  }

  fetchMock.mock(matcher, (url: string, opts: RequestOptions) => {
    const router = routington()
    router.define(contract.url)
    let parsedUrl
    try {
      // if the url is relative, this will fail, and it will get parsed in the catch
      parsedUrl = new URL(url)
    } catch (e) {
      // We are parsing a relative URL, so try again, but supply a baseUrl this time
      parsedUrl = new URL(url, 'http://localhost')
    }
    const pathParams = router.match(parsedUrl.pathname).param
    const headers = opts.headers as Record<string, string>
    let jsonBody
    if (headers) {
      const contentType = headers['Content-Type']
      jsonBody = contentType.indexOf('json') >= 0 && opts.body ? JSON.parse(opts.body) : null
    }
    return responseFunction(parsedUrl, pathParams, jsonBody, opts)
  })
}

/**
 * This function formats an express-style url pattern so that fetch-mock will understand it as such.
 * It expects a pattern like /api/service/:paramName and will treat :paramName as a * wildcard.
 * @param pattern
 */
export const createExpressUrlPattern = (pattern: string): string => {
  return `express:${pattern}`
}

/**
 * This function accepts absolute URLs and expresse style URIs (https://github.com/pillarjs/path-to-regexp#readme).
 * The following are examples of acceptable url patterns:
 *   /api/service/:paramName
 *   //someurl.com/api/service/:paramName
 *   http://someurl.com/api/service/:paramName
 * @param pattern
 */
export const formatUrlPattern = (pattern: string): string => {
  let urlPattern: string
  if (pattern.startsWith('http') || pattern.startsWith('//')) {
    urlPattern = pattern
  } else {
    urlPattern = createExpressUrlPattern(pattern)
  }
  return urlPattern
}
