import { Project } from '$/models/ui/Project'
import { CrudService } from '$/mockApi/services/CrudService'
import { ProjectAdapter } from '$/models/adapters/ProjectAdapter'
import { ProjectJson } from '$/models/api/ProjectJson'
import { ProjectGenerator } from '$/mockApi/generators/ProjectGenerator'

class ProjectService extends CrudService<Project, ProjectJson, string> {
  constructor() {
    super(ProjectAdapter, ProjectGenerator, 100)
  }
}

export default new ProjectService()
