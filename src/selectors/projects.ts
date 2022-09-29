import { createSelector } from 'reselect'
import { Project } from '$/models/ui/Project'
import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { RootState } from '$/models/ui/RootState'

export interface ProjectsByStatus {
  [status: string]: Project[]
}
interface StatusProps {
  statuses: ProjectStatus[]
}

const getProjects = (state: RootState): { [id: string]: Project } => {
  const { projectsById = {} } = state.projects
  return projectsById
}
const getStatuses = (state: RootState, props: StatusProps): ProjectStatus[] => props.statuses || []

export const getProjectsByStatus = createSelector(
  getProjects,
  getStatuses,
  (projectsById, statuses): ProjectsByStatus => {
    // Create empty buckets
    const result = statuses.reduce(
      (prev, next) => ({
        ...prev,
        [next]: [],
      }),
      {}
    )
    // Fill buckets
    Object.values(projectsById).forEach(p => {
      if (statuses.includes(p.status)) {
        result[p.status].push(p)
      }
    })
    return result
  }
)
