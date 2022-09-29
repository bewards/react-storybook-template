import { useState, Dispatch, DragEvent, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StatusColumn.module.scss'
import { titleCase } from '$/util/text'
import { statusColorMap } from '$/util/colors'
import type { ProjectStatus } from '$/models/ui/ProjectStatus'
import type { Project } from '$/models/ui/Project'
import type { NavigateFunction } from 'react-router-dom'
import { useIntl } from 'react-intl'
import messages from './messages'

interface Props {
  projects: Project[]
  status: ProjectStatus
  hovering?: ProjectStatus
  onDragging?: (status: ProjectStatus) => void
  onDropped?: (projectId: string, status: ProjectStatus) => void
}

const getTitle = (project: Project): string => {
  return `Title: ${project.title}\r\nDivision: ${project.division}\r\nBudget $${project.budget}\r\nCreated:${
    project.created ? new Date(project.created).toLocaleDateString('en-US') : ''
  }`
}

const handleDrag = (setIsDragging: Dispatch<boolean>) => (e: DragEvent<HTMLElement>) => {
  const id = e.currentTarget.getAttribute('data-project-id') || ''
  e.dataTransfer.setData('text', id)
  setIsDragging(true)
}

const handleDrop = (props: Props, setIsDragging: Dispatch<boolean>) => (e: DragEvent<HTMLElement>) => {
  const { status, onDropped } = props
  if (onDropped) {
    const projectId = e.dataTransfer.getData('text')
    onDropped(projectId, status)
  }
  setIsDragging(false)
}

const handleDragOver = (props: Props) => (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  const { onDragging, status } = props
  if (onDragging) {
    onDragging(status)
  }
}

const editProject = (navigate: NavigateFunction, project: Project): void => {
  navigate(`/project/${project.id}`)
}

export const StatusColumn: FC<Props> = (props: Props) => {
  const { projects = [], status, hovering } = props
  const navigate = useNavigate()
  const intl = useIntl()
  const [, setIsDragging] = useState(false)
  return (
    <div
      onDrop={handleDrop(props, setIsDragging)}
      onDragOver={handleDragOver(props)}
      style={{ opacity: hovering ? (hovering === status ? 1 : 0.5) : 1 }}
      data-testid={`column_${status}`}>
      <h3>{`${titleCase(intl.formatMessage(messages[status]))} (${projects.length})`}</h3>
      {projects.map((p, index2) => (
        <div key={index2}>
          <span
            draggable={true}
            data-project-id={p.id}
            data-testid={`${status}_item_${index2}`}
            onDragStart={handleDrag(setIsDragging)}
            className={`${styles['status-badge']} badge btn-${statusColorMap[p.status]}`}
            title={getTitle(p)}>
            <button
              className={`btn-secondary ${styles['status-edit']} mr-2`}
              onClick={() => {
                editProject(navigate, p)
              }}>
              Edit
            </button>
            {p.title}
          </span>
        </div>
      ))}
    </div>
  )
}
