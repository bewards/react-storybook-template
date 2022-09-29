import type { FC, ChangeEvent, FocusEvent } from 'react'
import { Project } from '$/models/ui/Project'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import { titleCase } from '$/util/text'
import { useFormik, FormikErrors, FormikTouched } from 'formik'
import { ProjectFormMeta } from '$/pages/ProjectDetailPage/components/ProjectFormMeta/ProjectFormMeta'

interface Props {
  project: Project
  handleSubmit: (values: Project) => void
}

interface FormErrorProps {
  name: string
  errors: FormikErrors<Project>
  touched: FormikTouched<Project>
}

const FormError: FC<FormErrorProps> = (errorProps: FormErrorProps) => {
  const { errors, touched, name } = errorProps
  return errors[name] && touched[name] ? (
    <small id={name} className="text-danger">
      {errors[name]}
    </small>
  ) : (
    <></>
  )
}

export const ProjectFormFormik: FC<Props> = (props: Props) => {
  const { project, handleSubmit } = props
  // Validation schema
  const validate = (values: Project): FormikErrors<Project> => {
    const errors: { [key: string]: string } = {}
    const required = ['division', 'owner', 'title', 'budget', 'status']
    required.forEach(key => {
      if (!values[key]) {
        errors[key] = `${titleCase(key)} is required.`
      }
    })
    return errors
  }

  // Formik hook config
  const formik = useFormik({
    initialValues: project || {},
    validate,
    validateOnMount: true,
    onSubmit: values => {
      handleSubmit(values)
    },
  })

  interface ControlProps {
    name: string
    type: string
    id: string
    className: string
    'data-testid': string
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    value: string
  }

  // Common props for each control
  const controlClassProps = (name: string, type: string): ControlProps => ({
    type,
    name,
    id: name,
    className: formik.errors[name] && formik.touched[name] ? 'is-invalid' : '',
    'data-testid': `formik-${name}`,
    onChange: formik.handleChange,
    // To make bootstrap forms compatible with formik.touched
    onBlur: formik.handleBlur,
    value: formik.values[name] ?? '',
  })

  return (
    <form data-testid="formik-project-form" onSubmit={formik.handleSubmit}>
      <section>
        <label htmlFor="title">Title</label>
        <input {...controlClassProps('title', 'text')} />
        <FormError name="title" errors={formik.errors} touched={formik.touched} />
      </section>
      <div>
        <section>
          <label htmlFor="divistion">Division</label>
          <input {...controlClassProps('division', 'text')} />
          <FormError name="division" errors={formik.errors} touched={formik.touched} />
        </section>
        <section>
          <label htmlFor="owner">Owner</label>
          <input {...controlClassProps('owner', 'text')} />
          <FormError name="owner" errors={formik.errors} touched={formik.touched} />
        </section>
      </div>
      <div>
        <section>
          <label htmlFor="budget">Budget</label>
          <input {...controlClassProps('budget', 'number')} />
          <FormError name="budget" errors={formik.errors} touched={formik.touched} />
        </section>
        <section>
          <label htmlFor="status">Status</label>
          <select {...controlClassProps('status', '')}>
            <option value="">-Select Status-</option>
            {projectStatuses.map((status, index) => (
              <option key={index} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
          <FormError name="status" errors={formik.errors} touched={formik.touched} />
        </section>
      </div>
      <ProjectFormMeta created={project.created} modified={project.modified} />
      <button className="btn-primary" type="submit" data-testid="save-button" disabled={!formik.isValid}>
        Save
      </button>
    </form>
  )
}
