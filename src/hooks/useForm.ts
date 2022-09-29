import { ChangeEvent, ChangeEventHandler, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
type ValueExtractor = (e: ChangeEvent<FormEventTarget>) => any
interface FormEventTarget extends EventTarget {
  value: any
}

//consider moving this into it's own file
export const valueExtractors: { [type: string]: ValueExtractor } = {
  integer: (e: ChangeEvent<FormEventTarget>) => {
    const value = e.target.value
    if (value) {
      return parseInt(value)
    }
  },
  boolean: (e: ChangeEvent<FormEventTarget>) => {
    const value = e.target.value
    return (value || '').toString().toLowerCase() === 'true'
  },
  float: (e: ChangeEvent<FormEventTarget>) => {
    const value = e.target.value || 0
    return parseFloat(value)
  },
}

type Custom<T> = (value: any, source: T) => void
type Updater<T> = (
  propertyNameOrCustom: Custom<T> | string,
  valueExtractor?: ValueExtractor
) => (e: ChangeEvent<FormEventTarget>) => void

/**
 * A hook that exposes projectUpdatedFromSocket form values based on a set of initial values.  Exposes
 * `update` handler to use in conjunction with onChange, onBlur, etc. in a form control
 * The values to initialize the form with
 * @param initialValues
 * @example
 * const myForm = (props: any) => {
 * const [ formValues, update ] = useForm(props.userInfo)
 * return (
 *    <form onSubmit={() => doSubmit(formValues)}>
 *       <input type="text" onChange={update('email')} />
 *       <input type="number" onChange={update('age', ValueExtractors.integer)} /> 
 *       <input type="text" type="lastName" 
 *            onChange={update((value, data) => {
 *                data.name.last = value
 *            }
 *        )} />
 *      <button type="submit">Save</button>
 *    </form>
 * })
 
 */
export const useForm = function <T>(initialValues: T): [T, Updater<T>, T] {
  const [formValues, updateState] = useState(initialValues)
  const source: T = { ...formValues }
  const update: Updater<T> = (
    propertyNameOrCustom: string | Custom<T>,
    valueExtractor?: ValueExtractor
  ): ChangeEventHandler<FormEventTarget> => {
    return (e: ChangeEvent<FormEventTarget>) => {
      const newValue = valueExtractor ? valueExtractor(e) : e.target.value
      if (typeof propertyNameOrCustom == 'string') {
        const propertyName = propertyNameOrCustom as string
        source[propertyName] = newValue
      } else {
        propertyNameOrCustom(newValue, source)
      }
      updateState(source)
    }
  }

  return [formValues as T, update, source]
}
