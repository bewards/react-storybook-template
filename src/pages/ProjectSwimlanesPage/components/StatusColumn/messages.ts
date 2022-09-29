import { defineMessages } from 'react-intl'

const scope = 'react-best-practices.pages.ProjectSwimlanes'

export default defineMessages({
  // Swimlane titles
  new: {
    id: `${scope}.new`,
    defaultMessage: 'New',
  },
  working: {
    id: `${scope}.working`,
    defaultMessage: 'Working',
  },
  delivered: {
    id: `${scope}.delivered`,
    defaultMessage: 'Delivered',
  },
  archived: {
    id: `${scope}.archived`,
    defaultMessage: 'Archived',
  },
})
