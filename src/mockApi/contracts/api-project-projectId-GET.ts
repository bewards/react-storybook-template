import type { ApiContract, Response } from '$/lib/api-mocking/interfaces/ApiContract'
import type { Error } from '$/models/Error'
import type { ProjectJson } from '$/models/api/ProjectJson'
import { defaultErrorResponse } from '$/mockApi/responses/defaultErrorResponse'
import projectService from '$/mockApi/services/ProjectService'

export default {
  url: '/api/project/:projectId',
  method: 'GET',
  success: (url, pathParams, opts): Response<ProjectJson> => {
    return {
      status: 200,
      // eslint-disable-next-line testing-library/await-async-query
      body: projectService.findById(pathParams.projectId),
    }
  },
  error: (): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  scope: {
    test: true,
    runtime: true,
  },
} as ApiContract<void, ProjectJson, Error>
