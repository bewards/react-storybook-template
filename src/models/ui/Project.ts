import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { BaseAuditedModel } from '$/models/BaseAuditedModel'

export interface Project extends BaseAuditedModel<string> {
  title: string
  division: string
  owner: string
  budget?: number
  status: ProjectStatus
}

export function createEmptyProject(): Project {
  return {
    title: '',
    division: '',
    owner: '',
    status: ProjectStatus.new,
  }
}
