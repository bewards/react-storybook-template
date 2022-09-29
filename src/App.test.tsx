import { describe, it, expect } from 'vitest'
import { waitFor, screen } from '@testing-library/react'
import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { newComponentTest } from '$/lib/rtl-utils/newComponentTest'
import { getElement } from '$/lib/rtl-utils'
import { getEnumValues } from '$/util/enum'

import App from './App'

describe('App - Projects', () => {
  const renderedTest = newComponentTest(App).renderForTestSuite({
    dontWrapWithRoute: true,
    stateProvider: () => ({
      projects: {
        statusVisibility: {
          [ProjectStatus.new]: true,
          [ProjectStatus.archived]: true,
          [ProjectStatus.working]: false,
        },
        projectsById: {},
      },
    }),
  })

  it('should render', () => {
    expect(renderedTest.baseElement).toBeTruthy()
  })

  it('should show status nav', () => {
    const statuses = getEnumValues(ProjectStatus).map(s => `${s}_toggle`)
    expect(statuses.every(s => expect(screen.getByTestId(s)).toBeTruthy()))
  })

  it('should show status nav with defaults', () => {
    // Since this suite is rendered once, no need to re-click toggle/dropdown
    const status = getElement(`${ProjectStatus.new}_toggle`)
    expect(status.getElementsByTagName('input')[0].hasAttribute('checked')).toBe(true)
  })

  it('should toggle status when clicked', async () => {
    const status = getElement(`${ProjectStatus.new}_toggle`)
    expect(status.getElementsByTagName('input')[0].hasAttribute('checked')).toBe(true)
    console.log(status.getElementsByTagName('input')[0].value)
    status.click()
    // Wait for async changes to propagate from redux/action
    await waitFor(() => expect(status.getElementsByTagName('input')[0].hasAttribute('checked')).toBe(false))
  })
})

// TODO
// describe('App - Should handle fatal errors', () => {
//   const test = renderForTestSuite(App, {
//     location: '/projects',
//     stateProvider: () => ({
//       projects: {
//         statusVisibility: new Error(),
//       },
//     }),
//     propsProvider: () => ({
//       statusVisibility: new Error(),
//     }),
//   })
// })
