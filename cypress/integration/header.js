import { getEnumValues } from '../../src/util/enum'
import { ProjectStatus } from '../../src/models/ui/ProjectStatus'

describe('Header', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('greets with Projects by Status', () => {
    cy.contains('h1', 'Projects By Status')
  })

  it('contains a Filter', () => {
    cy.contains('h2', 'Filter')
  })

  it('contains a language dropdown', () => {
    cy.get('select')
  })

  /**
   * Filter
   */
  describe('Filter', () => {
    const filterNames = getEnumValues(ProjectStatus)
    filterNames.map(filterName => {
      describe(`Deselecting: ${filterName}`, () => {
        it('should remove this column', () => {
          cy.get(`[data-testid=${filterName}_toggle]`).click()
          cy.get(`[data-testid=column_${filterName}]`).should('not.exist')
        })
      })
    })
  })
})
