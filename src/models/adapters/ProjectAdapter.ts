import type { ProjectJson } from '$/models/api/ProjectJson'
import type { Adapter } from './Adapter'
import { Project, createEmptyProject } from '$/models/ui/Project'
import { ProjectStatus } from '$/models/ui/ProjectStatus'

export const ProjectAdapter: Adapter<ProjectJson, Project> = {
  toModel: (projectAsJson: ProjectJson): Project => {
    const { project_owner, status, budget, created, modified, ...rest } = projectAsJson

    const project = createEmptyProject()
    project.owner = project_owner
    project.status = ProjectStatus[status]
    project.budget = parseInt(budget)
    Object.assign(project, rest)

    if (created) {
      project.created = created
    }
    if (modified) {
      project.modified = modified
    }

    return project
  },

  toJson: (value: Project): ProjectJson => {
    const { owner, budget, created, modified, ...rest } = value

    const result = {
      project_owner: owner,
      budget: `${budget}`,
      ...rest,
    } as ProjectJson

    if (created) {
      result.created = created
    }
    if (modified) {
      result.modified = modified
    }

    return result
  },
}
