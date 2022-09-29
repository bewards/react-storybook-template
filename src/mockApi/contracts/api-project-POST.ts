import type { ApiContract, Response } from '$/lib/api-mocking/interfaces/ApiContract'
import type { Error } from '$/models/Error'
import type { ProjectJson } from '$/models/api/ProjectJson'
import { defaultErrorResponse } from '$/mockApi/responses/defaultErrorResponse'
import projectService from '$/mockApi/services/ProjectService'

export default {
  url: '/api/project',
  method: 'POST',
  success: (url, pathParams, jsonBody): Response<ProjectJson> => ({
    status: 200,
    body: projectService.insert(jsonBody),
  }),
  error: (): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  scope: {
    test: true,
    runtime: true,
  },
} as ApiContract<ProjectJson, ProjectJson, Error>
