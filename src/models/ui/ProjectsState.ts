import { Project } from '$/models/ui/Project'
import { KeyBoolean } from '$/models/ui/KeyBoolean'

export type ProjectsById = { [id: string]: Project }

export interface ProjectsState {
  projectsById: ProjectsById
  statusVisibility: KeyBoolean
}
