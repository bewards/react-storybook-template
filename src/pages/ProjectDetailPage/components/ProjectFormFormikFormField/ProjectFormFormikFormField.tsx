import { FC } from 'react'
import { Project } from '$/models/ui/Project'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import { titleCase } from '$/util/text'
import { Formik } from 'formik'
import { ProjectFormMeta } from '$/pages/ProjectDetailPage/components/ProjectFormMeta/ProjectFormMeta'
import FormField from '../FormField/FormField'
import { FormErrorMessage } from '../FormErrorMessage/FormErrorMessage'
import * as Yup from 'yup'

interface Props {
  project: Project
  handleSubmit: (values: Project) => void
}

const schema = Yup.object({
  division: Yup.string().label('Division').required(),
  owner: Yup.string().label('Owner').required(),
  title: Yup.string().label('Title').required(),
  budget: Yup.number().label('Budget').required(),
  status: Yup.string().label('Status').required(),
})

export const ProjectFormFormikFormField: FC<Props> = (props: Props) => {
  const { project, handleSubmit } = props

  return (
    <Formik initialValues={project || {}} onSubmit={handleSubmit} validationSchema={schema} validateOnMount={true}>
      {({ isValid, submitForm }) => (
        <form data-testid="formik-form-field-project-form" onSubmit={submitForm}>
          {/* if only description is specified, it it used for label and placeholder */}
          <FormField name="title" description="Title" component="textarea" />
          <div>
            {/* placeholder is used when the field is blank and hasn't been touched */}
            <FormField name="division" description="Division" placeholder="The division managing the project" />
            {/* for the default styling, label is only used after the field has been touched (ie. you should have a placeholder/description for everything) */}
            <FormField name="owner" label="Owner" />
          </div>
          <div>
            {/* `instructions` is additional content displayed with the field - it may not be very helpful though, as it makes styling the component more difficult */}
            <FormField
              name="budget"
              description="Budget"
              type="number"
              instructions={<p>Enter the budget for the project</p>}
            />
            <FormField name="status" description="Status" component="select">
              <option value="">-Select Status-</option>
              {projectStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </FormField>
            {/** project doens't have a checkbox - this is just to illustrate how you'd use it **/}
            <FormField name="enabled" description="Enabled" type="checkbox" />
          </div>
          <ProjectFormMeta created={project.created} modified={project.modified} />
          <FormErrorMessage />
          <button className="btn-primary" type="submit" data-testid="save-button" disabled={!isValid}>
            Save
          </button>
        </form>
      )}
    </Formik>
  )
}
