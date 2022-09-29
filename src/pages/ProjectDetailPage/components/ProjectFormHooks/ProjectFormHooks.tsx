import { FC } from 'react'
import { Project } from '$/models/ui/Project'
import { useForm, valueExtractors } from '$/hooks/useForm'
import { titleCase } from '$/util/text'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import { ProjectFormMeta } from '$/pages/ProjectDetailPage/components/ProjectFormMeta/ProjectFormMeta'

interface Props {
  handleSubmit: (values: Project) => void
  project: Project
}

export const ProjectFormHooks: FC<Props> = (props: Props) => {
  const { project, handleSubmit } = props
  const [formValues, update] = useForm(project || {})
  return (
    <form data-testid="project-form" onSubmit={() => handleSubmit(formValues)}>
      <section>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" data-testid="title" onChange={update('title')} defaultValue={formValues.title} />
      </section>
      <div>
        <section>
          <label htmlFor="division">Division</label>
          <input
            type="text"
            id="division"
            data-testid="division"
            onChange={update((value, source) => {
              // An example of a custom handler
              source.division = value
            })}
            defaultValue={formValues.division}
          />
        </section>
        <section>
          <label htmlFor="owner">Owner</label>
          <input
            type="text"
            id="owner"
            data-testid="owner"
            onChange={update('owner')}
            defaultValue={formValues.owner}
          />
        </section>
      </div>
      <div>
        <section>
          <label htmlFor="budget">Budget</label>
          <input
            data-testid="budget"
            id="budget"
            type="number"
            onChange={update('budget', valueExtractors.integer)}
            defaultValue={formValues.budget}
          />
        </section>
        <section>
          <label htmlFor="status">Status</label>
          <select id="status" data-testid="status" onChange={update('status')} value={formValues.status}>
            <option value="">-Select Status-</option>
            {projectStatuses.map((status, index) => (
              <option key={index} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
        </section>
      </div>
      <ProjectFormMeta created={project.created} modified={project.modified} />
      <button className="btn-primary" type="submit" data-testid="save-button">
        Save
      </button>
    </form>
  )
}
