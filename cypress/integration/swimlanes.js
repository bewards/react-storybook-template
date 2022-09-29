describe('Swimlanes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Component: Swimlanes', () => {
    beforeEach(() => {
      cy.get('select').select('en')
    })

    describe('Add New Project Button', () => {
      it('should exist', () => {
        cy.get('[data-testid=add-new]').contains('Add New Project')
      })
    })
  })
})
