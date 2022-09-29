import { isValidElement, ReactElement } from 'react'
import { connect } from 'formik'

// Read more about why it's preferable to have individual lodash functions here:
// https://github.com/Rightpoint/rp-react-best-practices/issues/77
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'
import orderBy from 'lodash/orderBy'

import styles from './FormErrorMessage.module.scss'

interface ErrorMessageProps {
  // a string error message, or an object of errors, like what formik provides as `props.error`.
  error: string | Record<string, unknown>
  // if supplied and error is an object, a value from error will only be used if there is a truthy value for the same key in filter
  // this is very useful with Formik, passing `error={props.error} filter={props.touched}` to only show errors for touched fields
  filter?: Record<string, unknown>
  // if supplied, properties identified here will be first - note, this does *not* use array syntax, ie. pass `products.0.id`, not `products[0].id`.
  order?: string[]
}

// like toPairs, but recurses, giving a flat list of [ key, value ].  Ie. `{ a: { b: [ 'c' ]}}` will return `[['a.b.0', 'c' ]]`.
// it will recurse through everything but strings, bools, and react elements.  Ie. this is designed for use with `props.error` and `props.touched` from formik
function flattenToDeepPairs(value: Parameters<typeof toPairs>[0] | string | boolean): [string, unknown][] {
  if (typeof value === 'string' || value === true || value === false || isValidElement(value)) {
    return [['', value]]
  }
  return toPairs(value).flatMap(i =>
    flattenToDeepPairs(i[1]).map(ii => [i[0] + (ii[0] ? '.' + ii[0] : ''), ii[1]])
  ) as [string, unknown][]
}

/**
 * A component to display errors that are structured like Formik's `errors` property, and filtered by it's `touched` property
 */
export const ErrorMessage = (props: ErrorMessageProps): ReactElement<ErrorMessageProps> | null => {
  const { error, filter, order } = props

  // build the flattened list of errors to consider showing
  let flatError = flattenToDeepPairs(error)

  // if we have a filter, flatten it too and use it to filter the errors
  if (filter) {
    const flatFilter = flattenToDeepPairs(filter)
    const flatFilterIndex = fromPairs(flatFilter)
    flatError = flatError.filter(i => !!flatFilterIndex[i[0]])
  }

  // if we have a sort order specified, use it to sort the list
  if (order) {
    // flip keys/values so we can look up the error key and get the sort order
    const orderIndex = fromPairs(toPairs(order).map(i => [i[1], i[0]]))
    // order the errors by the values in the 'order' array
    flatError = orderBy(flatError, [i => (orderIndex[i[0]] === undefined ? 999999 : orderIndex[i[0]])])
  }

  // the list is filtered and sorted, so we don't need the keys unknownmore - just keep the values and render them in-order
  const errors = flatError.map(i => i[1]) as string[]
  if (!errors.length) return null

  return (
    <div className={styles['error-message']}>
      {errors.map((error, ix) => (
        <div className={styles['error-message__item']} key={ix}>
          {error}
        </div>
      ))}
    </div>
  )
}

export const FormErrorMessage = connect(({ formik }) => <ErrorMessage error={formik.errors} filter={formik.touched} />)
