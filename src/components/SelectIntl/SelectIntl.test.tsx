import { describe, it, expect } from 'vitest'
import { SelectIntl } from './SelectIntl'
import { newComponentTest } from '$/lib/rtl-utils/newComponentTest'
import { screen } from '@testing-library/react'

describe('<SelectIntl />', () => {
  newComponentTest(SelectIntl).renderForTestSuite()

  describe('default behavior', () => {
    it('should be an HTML select', () => {
      const element: HTMLElement = screen.getByTestId('select-intl')
      expect(element.tagName).toBe('SELECT')
    })
  })
})
