import { FC, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

// Components
import {
  Tabber,
  ProjectFormHooks,
  ProjectFormFormik,
  ProjectFormReactHookForm,
  ProjectFormFormikFormField,
} from './components'

// Redux
import { fetchProjects, updateProject } from '$/redux/projectsSlice'

// Types
import { Project } from '$/models/ui/Project'
import { RootState } from '$/models/ui/RootState'
import { ITabObject } from '$/pages/ProjectDetailPage/components/Tabber/types'
import { ProjectsById } from '$/models/ui/ProjectsState'
import type { NavigateFunction } from 'react-router-dom'

const handleSubmit = (props: FormProps, navigate: NavigateFunction) => (project: Project) => {
  const { updateProject } = props
  updateProject(project)
  navigate('/projects')
}

const ProjectDetail: FC<FormProps> = (props: FormProps) => {
  const { projectsById = {}, fetchProjects: fetchProjectsAction } = props
  const { projectId } = useParams<{ projectId: string }>()
  const project = projectId ? projectsById[projectId] : ({} as Project)
  const navigate = useNavigate()
  useEffect(() => {
    if (!projectsById) {
      fetchProjectsAction()
    }
  }, [fetchProjectsAction, projectsById])

  const data: ITabObject[] = [
    {
      id: '1',
      tabComponent: <ProjectFormHooks project={project} handleSubmit={handleSubmit(props, navigate)} />,
      tabTitle: 'Using Hooks',
    },
    {
      id: '2',
      tabComponent: <ProjectFormFormik project={project} handleSubmit={handleSubmit(props, navigate)} />,
      tabTitle: 'Using Formik',
    },
    {
      id: '3',
      tabComponent: <ProjectFormReactHookForm project={project} onSubmit={handleSubmit(props, navigate)} />,
      tabTitle: 'Using React Hook Form',
    },
    {
      id: '4',
      tabComponent: <ProjectFormFormikFormField project={project} handleSubmit={handleSubmit(props, navigate)} />,
      tabTitle: 'Using Formik w/ custom FormField',
    },
  ]

  return (
    <div id="tabs" className="mt-4">
      <Tabber data={data} />
    </div>
  )
}

interface PropsFromRedux {
  projectsById: ProjectsById
}

const mapDispatchToProps = {
  fetchProjects,
  updateProject,
}

const mapStateToProps = ({ projects }: RootState): PropsFromRedux => ({
  projectsById: projects.projectsById,
})

const connector = connect(mapStateToProps, mapDispatchToProps)
export type FormProps = ConnectedProps<typeof connector>
export default connector(ProjectDetail)
