import { ReactNode, ReactElement, InputHTMLAttributes, ComponentType, ChangeEvent } from 'react'
import classNames from 'classnames'
import { FormikContextType, Field, FieldConfig, GenericFieldHTMLAttributes, getIn, connect } from 'formik'

import styles from './FormField.module.scss'

export interface FormFieldProps extends FieldConfig {
  label?: ReactNode
  description?: string
  instructions?: ReactNode
}

export interface FormFieldPropsWithContext<TFormikValues> extends FormFieldProps {
  formik: FormikContextType<TFormikValues>
}

/* you can support custom components here - ie. add a case for 'recaptcha' and a RecaptchaFormField component */
const getComponent = ({ component, type }: { component: FieldConfig['component']; type?: string }): unknown => {
  if (component && typeof component !== 'string') {
    return component
  }
  switch (component) {
    case 'select':
      return SelectFormField
    case 'textarea':
      return TextAreaFormField
    default:
      switch (type) {
        case 'checkbox':
          return CheckboxFormField
        default:
          return InputFormField
      }
  }
}

export function FormField<TFormikValues>({
  name,
  className,
  description,
  placeholder: passedPlaceholder,
  label: passedLabel,
  instructions,
  formik,
  component,
  type = 'text',
  ...rest
}: FormFieldPropsWithContext<TFormikValues> & GenericFieldHTMLAttributes): ReactElement {
  const placeholder = passedPlaceholder || description
  const label = passedLabel || description
  const isTouched = getIn(formik.touched, name)
  const error = isTouched && getIn(formik.errors, name)
  const hasValue = !!getIn(formik.values, name) || getIn(formik.values, name) === 0
  return (
    /*
      This styling/structure is *for example only* - the point of this is to adapt this to match your project's styling needs
      (and/or use custom components in here - ie. from Material UI/etc.)

      The goal of this component is to make it simple for the rest of your project to get form inputs "right", by
      centralizing what a "form input" is within this component.  That could include displaying `error` here (or not),
      and changing when a component is counted as "errored" (ie. using `submitCount > 0` instead of `touched`)
    */
    <section
      className={classNames(
        styles['form-field'],
        type && styles[`form-field-type-${type}`],
        typeof component === 'string' && styles[`form-field-component-${component}`],
        className,
        {
          [styles['form-field--error']]: !!error,
          [styles['form-field--touched']]: isTouched,
          [styles['form-field--has-value']]: hasValue,
        }
      )}>
      {instructions}
      {/* label has to come after the field for custom checkbox styles */}
      {label && type !== 'checkbox' && <label htmlFor={name}>{label}</label>}
      <Field
        id={name}
        name={name}
        data-testid={name}
        placeholder={placeholder}
        type={type}
        {...rest}
        component={getComponent({ component, type })}
      />
      {label && type === 'checkbox' && <label htmlFor={name}>{label}</label>}
      {error && <span className="bg-danger">{error}</span>}
    </section>
  )
}

// wrap a normal HTML form component to allow using a custom `onChange` along with the one Formik needs
interface InputFormFieldProps<THtmlElement> {
  field: InputHTMLAttributes<THtmlElement>
}
function customInputComponentBuilder<P extends InputHTMLAttributes<THtmlElement>, THtmlElement>(
  Component: ComponentType<P>
): ComponentType<InputFormFieldProps<THtmlElement> & P> {
  const WrappedComponent = ({ field, ...rest }: InputFormFieldProps<THtmlElement> & P): ReactElement => {
    const onChange = (e: ChangeEvent<THtmlElement>): void => {
      field.onChange?.(e)
      rest.onChange?.(e)
    }
    return (
      <Component
        {...(rest as unknown as P)}
        {...field}
        {...(field && field.onChange && rest.onChange && { onChange })}
      />
    )
  }
  return WrappedComponent
}

// we need to convert value from undefined to '' to avoid an "uncontrolled input" error from React
//   when the user makes a change to a field from undefined to a value
const Input = ({ form, value, ...props }: InputHTMLAttributes<HTMLInputElement>): ReactElement => (
  <input value={value ?? ''} {...props} />
)
const Select = ({ form, value, ...props }: InputHTMLAttributes<HTMLSelectElement>): ReactElement => (
  <select value={value ?? ''} {...props} />
)
const TextArea = ({ form, value, ...props }: InputHTMLAttributes<HTMLTextAreaElement>): ReactElement => (
  <textarea value={value ?? ''} {...props} />
)

function CheckboxInput<TFormikValues>(
  props: { form: FormikContextType<TFormikValues> } & InputHTMLAttributes<HTMLInputElement>
): ReactElement {
  const { form, name, id } = props
  const index = name || id
  const checked = !!index && !!form.values[index]
  return <input {...props} checked={checked} />
}

// the components that will be passed to Formik.Field
const InputFormField = customInputComponentBuilder(Input)
const CheckboxFormField = customInputComponentBuilder(CheckboxInput)
const SelectFormField = customInputComponentBuilder(Select)
const TextAreaFormField = customInputComponentBuilder(TextArea)

// Formik.connect provides the `formik` property to our component
// for this to work, it must be inside a `<Formik/>` component - `useFormik` will *not* work
export default connect<FormFieldProps & GenericFieldHTMLAttributes, FormFieldPropsWithContext<unknown>>(FormField)
