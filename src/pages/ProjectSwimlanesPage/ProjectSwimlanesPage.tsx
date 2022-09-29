import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { StatusColumn } from './components'
import { getProjectsByStatus, ProjectsByStatus } from '$/selectors/projects'
import { fetchProjects, updateProject } from '$/redux/projectsSlice'
import { RootState } from '$/models/ui/RootState'
import type { ProjectStatus } from '$/models/ui/ProjectStatus'
import type { KeyBoolean } from '$/models/ui/KeyBoolean'
import type { NavigateFunction } from 'react-router-dom'
import messages from './messages'
import { useIntl } from 'react-intl'

const handleDropped =
  (props: Props, setHovered: Dispatch<SetStateAction<string>>) => (projectId: string, status: ProjectStatus) => {
    const { projectsByStatus = {} } = props
    loop: for (const projects of Object.values(projectsByStatus)) {
      for (const project of projects) {
        if (project.id === projectId) {
          props.updateProject({ ...project, status })
          break loop
        }
      }
    }
    setHovered('')
  }

const navigateToNewProject = (navigate: NavigateFunction): void => {
  navigate('/project')
}

const ProjectSwimlanesPage: FC<Props> = (props: Props) => {
  const { projectsByStatus = {}, statuses, statusVisibility, fetchProjects: fetchProjectsAction } = props

  useEffect(() => {
    fetchProjectsAction()
  }, [fetchProjectsAction])

  const [hoveredStatus, setHoveredStatus] = useState('')

  const navigate = useNavigate()
  const intl = useIntl()

  return (
    <>
      <button
        data-testid="add-new"
        className="btn-primary float-right mt-2"
        onClick={() => navigateToNewProject(navigate)}>
        {intl.formatMessage(messages.addNewProject)}
      </button>
      <div className="d-flex p-4 mt-4">
        {statuses
          .filter(status => statusVisibility[status])
          .map((status, index) => (
            <div className="flex-grow-1" key={index}>
              <StatusColumn
                projects={projectsByStatus[status]}
                status={status}
                onDragging={setHoveredStatus}
                onDropped={handleDropped(props, setHoveredStatus)}
                hovering={hoveredStatus as ProjectStatus}
              />
            </div>
          ))}
      </div>
    </>
  )
}

interface PropsFromReact {
  statuses: ProjectStatus[]
}

interface PropsFromRedux {
  projectsByStatus: ProjectsByStatus
  statusVisibility: KeyBoolean
}

const mapDispatchToProps = {
  fetchProjects,
  updateProject,
}

const mapStateToProps = (rootState: RootState, props: PropsFromReact): PropsFromRedux => {
  return {
    projectsByStatus: getProjectsByStatus(rootState, props),
    statusVisibility: rootState.projects.statusVisibility,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & PropsFromReact

export default connector(ProjectSwimlanesPage)
