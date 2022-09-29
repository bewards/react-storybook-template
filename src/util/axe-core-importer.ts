import React from 'react'
import ReactDOM from 'react-dom'
import Axe from '@axe-core/react'

export function setupAxe(): void {
  Axe(React, ReactDOM, 1000)
}
