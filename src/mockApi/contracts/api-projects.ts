import type { ApiContract } from '$/lib/api-mocking/interfaces/ApiContract'
import type { Error } from '$/models/Error'
import type { ProjectJson } from '$/models/api/ProjectJson'
import { defaultErrorResponse } from '$/mockApi/responses/defaultErrorResponse'
import { Response } from '$/lib/api-mocking/interfaces/ApiContract'
import projectService from '$/mockApi/services/ProjectService'

export default {
  url: '/api/projects',
  method: 'GET',
  success: (): Response<ProjectJson[]> => ({
    status: 200,
    body: projectService.listAll(),
  }),
  error: (): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  scope: {
    test: true,
    runtime: true,
  },
} as ApiContract<void, ProjectJson[], Error>
