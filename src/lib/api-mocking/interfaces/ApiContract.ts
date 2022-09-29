import { Scope } from './Scope'
import type { URL } from 'url'

export interface RequestOptions {
  body: string
  headers?: unknown
}

/**
 * The response is an object as documented here http://www.wheresrhys.co.uk/fetch-mock/#api-mockingmock_response
 */
export interface Response<B> {
  status: number
  body: B
  headers?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * @RequestBody - The expected shape of the body of the request. This would be void for GET requests.
 * @ResponseBody - The expected shape of the response body from the server when getting a 200 response.
 * @ResponseBodyError - The expected shape of the response body from the server when getting a 500 response.
 */
export interface ApiContract<RequestBody = any, ResponseBody = any, ResponseBodyError = any> {
  /**
   * This contract will be loaded by `loadContracts.ts` which expects an express-style url pattern
   * like /api/service/:paramName and will treat :paramName as a * wildcard.
   * @param pattern
   */
  url: string

  /**
   * a standard http method
   */
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD'

  /**
   * This is a function that handles requests that match the contract url and responds with a mock success response.
   * The response is an object as documented here http://www.wheresrhys.co.uk/fetch-mock/#api-mockingmock_response
   * @param url
   * @param opts
   */
  success: (
    url: URL,
    pathParams: Record<string, string>,
    jsonBody: RequestBody,
    opts: RequestOptions
  ) => Response<ResponseBody>

  /**
   * This is a function that handles requests that match the contract url and responds with a mock error response.
   * The response is an object as documented here http://www.wheresrhys.co.uk/fetch-mock/#api-mockingmock_response
   * @param url
   * @param opts
   */
  error: (
    url: URL,
    pathParams: Record<string, string>,
    jsonBody: RequestBody,
    opts: RequestOptions
  ) => Response<ResponseBodyError>

  /**
   * This defines in what contexts the contract will be loaded. If runtime is true, then fetch will be configured to
   * respond with the above success response during local development. This will allow you to develop locally without
   * a backend. If test is true, then fetch will be configured to respond with the success contract above during tests.
   */
  scope: Scope
}
