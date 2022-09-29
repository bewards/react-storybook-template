import apiProjects from '$/mockApi/contracts/api-projects'
import apiProject from '$/mockApi/contracts/api-project-POST'
import apiProjectProjectId from '$/mockApi/contracts/api-project-projectId-PATCH'

/**
 * There is no automatic discovery of apiContracts. You have to import and them and
 * add each of them to the array below:
 */
export const apiContracts = [apiProjects, apiProject, apiProjectProjectId]
