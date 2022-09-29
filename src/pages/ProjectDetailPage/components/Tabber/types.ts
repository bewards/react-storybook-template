import { ReactElement } from 'react'

export interface ITabObject {
  id: string
  tabComponent: string | null | ReactElement
  tabTitle: string
}
