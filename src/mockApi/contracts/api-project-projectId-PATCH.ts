import type { ApiContract } from '$/lib/api-mocking/interfaces/ApiContract'
import type { ProjectJson } from '$/models/api/ProjectJson'
import type { Error } from '$/models/Error'
import { defaultErrorResponse } from '$/mockApi/responses/defaultErrorResponse'
import { Response } from '$/lib/api-mocking/interfaces/ApiContract'
import projectService from '$/mockApi/services/ProjectService'

export default {
  url: '/api/project/:projectId',
  method: 'PATCH',
  success: (url, pathParams, jsonBody): Response<ProjectJson> => ({
    status: 200,
    body: projectService.update(jsonBody),
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
