import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/dom'
import { screen } from '@testing-library/react'

import ProjectDetailPage from './ProjectDetailPage'
import { newComponentTest } from '$/lib/rtl-utils/newComponentTest'
import {
  expectInputValue,
  expectNavigatedTo,
  expectApiCall,
  type,
  selectOption,
  clearForm,
  submitForm,
  getElement,
} from '$/lib/rtl-utils'
import projectService from '$/mockApi/services/ProjectService'
import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { Project } from '$/models/ui/Project'
import { ProjectAdapter } from '$/models/adapters/ProjectAdapter'

const tabs: { formTestId: string; testIdPrefix?: string }[] = [
  { formTestId: 'project-form' },
  { formTestId: 'formik-project-form', testIdPrefix: 'formik-' },
  { formTestId: 'react-hook-form-project-form' },
  { formTestId: 'formik-form-field-project-form' },
]

describe('ProjectDetailPage', () => {
  describe('Tabs', () => {
    newComponentTest(ProjectDetailPage).renderForTestSuite({
      routePath: '/project',
      location: '/project',
    })

    it(`should have exactly ${tabs.length} tabs`, async () => {
      expect(screen.queryByTestId('tab-0')).toBeFalsy()
      for (let tab = 1; tab <= tabs.length; tab++) {
        expect(getElement('tab-' + tab)).toBeTruthy()
      }
      expect(screen.queryByTestId('tab-' + (tabs.length + 1))).toBeFalsy()
    })
  })

  for (let i = 0; i < tabs.length; i++) {
    const tabIndex = i
    const { formTestId, testIdPrefix = '' } = tabs[tabIndex]
    describe('Tab ' + formTestId + ' - ' + (tabIndex + 1), () => {
      describe('When rendering a new project', () => {
        const test = newComponentTest(ProjectDetailPage).renderForTestSuite({
          routePath: '/project',
          location: '/project',
        })

        it(`should select tab ${tabIndex + 1}`, async () => {
          const tabElement = getElement('tab-' + (tabIndex + 1))
          userEvent.click(tabElement)
          await waitFor(() => {
            expect(tabElement).toHaveAttribute('aria-selected')
            getElement(formTestId)
          })
        })

        it('should render a form populated with no values', () => {
          expectInputValue(testIdPrefix + 'title').toBeFalsy()
          expectInputValue(testIdPrefix + 'division').toBeFalsy()
          expectInputValue(testIdPrefix + 'owner').toBeFalsy()
          expectInputValue(testIdPrefix + 'budget').toBeFalsy()
          expectInputValue(testIdPrefix + 'status').toBeFalsy()
        })

        it('should call api/project when form is submitted, and navigate to /projects', async () => {
          const newProject = {
            title: 'My Title 1 2 3',
            division: 'Special Ops',
            owner: 'Me',
            budget: 300,
            status: ProjectStatus.new,
          } as Project

          await fillOutForm(testIdPrefix, newProject)

          // wait for the form to stabilize - without this, we get "missing act()" errors when using a form that uses async logic (ie. formik)
          await waitFor(() => {
            expect((getElement(testIdPrefix + 'status') as HTMLSelectElement).value).toBe(newProject.status)
          })

          submitForm(formTestId)

          await waitFor(() => {
            expectApiCall(test, '/api/project', ProjectAdapter.toJson(newProject))

            expectNavigatedTo(test, '/projects')
          })
        })
      })

      describe('When rendering an existing project', () => {
        const projectToEdit = getFirstNewProject(projectService.modelList)

        const test = newComponentTest(ProjectDetailPage).renderForTestSuite({
          routePath: '/project/:projectId',
          location: `/project/${projectToEdit.id}`,
          stateProvider: () => ({
            projects: {
              statusVisibility: {},
              projectsById: projectService.modelsById,
            },
          }),
        })

        it(`should select tab ${tabIndex + 1}`, async () => {
          const tabElement = getElement('tab-' + (tabIndex + 1))
          userEvent.click(tabElement)
          await waitFor(() => {
            expect(tabElement).toHaveAttribute('aria-selected')
            getElement(formTestId)
          })
        })

        it('should render a form populated with the values from project being edited', () => {
          expectInputValue(testIdPrefix + 'title').toBe(projectToEdit.title)
          expectInputValue(testIdPrefix + 'division').toBe(projectToEdit.division)
          expectInputValue(testIdPrefix + 'owner').toBe(projectToEdit.owner)
          expectInputValue(testIdPrefix + 'budget').toBe(`${projectToEdit.budget}`)
          expectInputValue(testIdPrefix + 'status').toBe(projectToEdit.status)
        })

        it('should call api/project with the correct values when form is submitted, and navigate to /projects', async () => {
          const updatedProject = {
            id: projectToEdit.id,
            title: 'Updated Title',
            division: 'Updated Division',
            owner: 'Updated Owner',
            budget: 1500,
            status: ProjectStatus.archived,
          } as Project

          clearForm(formTestId)
          await waitFor(() => {
            expect((getElement(testIdPrefix + 'title') as HTMLInputElement).value).toBe('')
          })

          await fillOutForm(testIdPrefix, updatedProject)
          await waitFor(() => {
            expect((getElement(testIdPrefix + 'status') as HTMLSelectElement).value).toBe(updatedProject.status)
          })

          submitForm(formTestId)
          await waitFor(() => {
            expectApiCall(test, `/api/project/${projectToEdit.id}`, ProjectAdapter.toJson(updatedProject))

            expectNavigatedTo(test, '/projects')
          })
        })
      })
    })
  }
})

async function fillOutForm(testIdPrefix: string, newProject: Project): Promise<void> {
  await type(testIdPrefix + 'title', newProject.title)
  await type(testIdPrefix + 'division', newProject.division)
  await type(testIdPrefix + 'owner', newProject.owner)
  await type(testIdPrefix + 'budget', newProject.budget ?? '')
  selectOption(testIdPrefix + 'status', newProject.status)
}

function getFirstNewProject(projects: Project[]): Project {
  for (const project of projects) {
    if (project.status === ProjectStatus.new) {
      return project
    }
  }
  return projects[0]
}
