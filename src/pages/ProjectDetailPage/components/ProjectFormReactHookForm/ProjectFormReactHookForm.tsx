import { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectFormMeta } from '$/pages/ProjectDetailPage/components/ProjectFormMeta/ProjectFormMeta'

// Utils
import { titleCase } from '$/util/text'

// Types
import { ProjectStatus, projectStatuses } from '$/models/ui/ProjectStatus'
import { Project } from '$/models/ui/Project'
interface IProps {
  project: Project
  onSubmit(project): void
}

export const ProjectFormReactHookForm = (props: IProps): ReactElement => {
  const { project, onSubmit } = props
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: project,
  })

  const someErrorMessage = (): ReactElement => <span className="bg-danger">This field is required</span>

  return (
    <form
      data-testid="react-hook-form-project-form"
      onSubmit={handleSubmit((data, e) => {
        e?.preventDefault()

        // Send our server-generated fields merged with our updated fields.
        onSubmit({ ...project, ...data })
      })}>
      <section>
        <label htmlFor="title">Title</label>
        <input data-testid="title" {...register('title', { required: true })} />
        {errors.title && someErrorMessage()}
      </section>
      <div>
        <section>
          <label htmlFor="division">Division</label>
          <input data-testid="division" {...register('division', { required: true })} />
          {errors.division && someErrorMessage()}
        </section>
        <section>
          <label htmlFor="owner">Owner</label>
          <input data-testid="owner" {...register('owner', { required: true })} />
          {errors.owner && someErrorMessage()}
        </section>
      </div>
      <div>
        <section>
          <label htmlFor="budget">Budget</label>
          <input data-testid="budget" {...register('budget', { required: true })} type="number" />
          {errors.budget && someErrorMessage()}
        </section>
        <section>
          <label htmlFor="status">Status</label>
          <select data-testid="status" {...register('status', { required: true })}>
            <option value="">-Select Status-</option>
            {projectStatuses.map(
              (status: ProjectStatus, index: number): JSX.Element => (
                <option key={index} value={status}>
                  {titleCase(status)}
                </option>
              )
            )}
          </select>
          {errors.status && someErrorMessage()}
        </section>
      </div>
      <ProjectFormMeta created={project.created} modified={project.modified} />
      <button className="btn-primary" type="submit" data-testid="save-button">
        Save
      </button>
    </form>
  )
}
