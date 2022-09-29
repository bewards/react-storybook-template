describe('Internationalization', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  /*
   * English
   * */
  describe('Language: English', () => {
    beforeEach(() => {
      cy.get('select').select('en')
    })

    describe('Header', () => {
      it('greets with Projects by Status', () => {
        cy.contains('h1', 'Projects By Status')
      })

      it('contains a Filter', () => {
        cy.contains('h2', 'Filter')
      })
    })

    describe('Swimlanes', () => {
      it('Button: Add New Project', () => {
        cy.contains('button', 'Add New Project')
      })

      describe('Titles', () => {
        it('has title: New', () => {
          cy.contains('h3', 'New')
        })
        it('has title: Working', () => {
          cy.contains('h3', 'Working')
        })
        it('has title: Delivered', () => {
          cy.contains('h3', 'Delivered')
        })
        it('has title: Archived', () => {
          cy.contains('h3', 'Archived')
        })
      })
    })
  })

  /*
   * French
   * */
  describe('Language: French', () => {
    beforeEach(() => {
      cy.get('select').select('fr')
    })

    describe('Header', () => {
      it('greets with Projets par statut', () => {
        cy.contains('h1', 'Projets par statut')
      })

      it('contains a Filtre', () => {
        cy.contains('h2', 'Filtre')
      })
    })

    describe('Swimlanes', () => {
      it('Button: Ajouter un nouveau projet', () => {
        cy.contains('button', 'Ajouter un nouveau projet')
      })

      describe('Titles', () => {
        it('has title: Neuf', () => {
          cy.contains('h3', 'Neuf')
        })
        it('has title: Actif', () => {
          cy.contains('h3', 'Actif')
        })
        it('has title: Livré', () => {
          cy.contains('h3', 'Livré')
        })
        it('has title: Archivé', () => {
          cy.contains('h3', 'Archivé')
        })
      })
    })
  })
})
