import { describe, it, expect } from 'vitest'
import ProjectSwimlanesPage from './ProjectSwimlanesPage'
import { newComponentTest } from '$/lib/rtl-utils/newComponentTest'
import { click, dragTo, exists, expectApiCall, expectNavigatedTo, expectRequestMade } from '$/lib/rtl-utils'
import { ProjectStatus, projectStatuses } from '$/models/ui/ProjectStatus'
import { ProjectAdapter } from '$/models/adapters/ProjectAdapter'
import { screen } from '@testing-library/react'

describe('ProjectSwimlanesPage', () => {
  const test = newComponentTest(ProjectSwimlanesPage).renderForTestSuite({
    propsProvider: () => ({ statuses: projectStatuses }),
    stateProvider: () => ({
      projects: {
        statusVisibility: {
          [ProjectStatus.new]: true,
          [ProjectStatus.working]: true,
        },
        projectsById: {},
      },
    }),
  })

  it('should load projectsById from api/projectsById when the component mounts', () => {
    expectRequestMade(test, '/api/projects')
  })

  it('should only show the columns that are visible', () => {
    for (const status of projectStatuses) {
      expect(exists(`column_${status}`)).toBe(!!test.appStateStore.getState().projects.statusVisibility[status])
    }
  })

  it('should update the project status when it is dragged from one column to another', async () => {
    const firstNewItem = await screen.findByTestId(`${ProjectStatus.new}_item_0`)
    const id = firstNewItem.getAttribute('data-project-id') || ''
    const workingColumn = screen.getByTestId(`column_${ProjectStatus.working}`)

    dragTo(firstNewItem, workingColumn)

    const { projectsById } = test.appStateStore.getState().projects
    const updatedProject = { ...projectsById[id], status: ProjectStatus.working }

    expectApiCall(test, '/api/project/:projectId', ProjectAdapter.toJson(updatedProject))
  })

  it('should navigate to the add new project page when clicking the add new project button', () => {
    click('add-new')
    expectNavigatedTo(test, '/project')
  })

  it('should navigate to the add existing project page when clicking the edit project button', () => {
    const firstNewItemDataTestId = `${ProjectStatus.new}_item_0`
    const firstNewItem = screen.getByTestId(firstNewItemDataTestId)
    const id = firstNewItem.getAttribute('data-project-id')
    click(firstNewItem.querySelector('button'))
    expectNavigatedTo(test, `/project/${id}`)
  })
})
