import type { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

// Components
import { SelectIntl } from '$/components'

// Styles
import './Navigation.scss'

// Messages
import messages from './messages'

// Types
interface Props {
  isHome: boolean
}

export const Navigation: FC<PropsWithChildren<Props>> = props => {
  const { children, isHome } = props
  const title = isHome ? messages.homeTitle : messages.detailTitle
  const intl = useIntl()

  return (
    <nav className="jumbotron pb-3 pt-3">
      <div className="d-flex">
        <h1 className="flex-grow-1 h3" data-testid="nav-title">
          {intl.formatMessage(title)}
        </h1>
        <SelectIntl />
      </div>
      {!isHome && (
        <div className="ml-4">
          <Link to="/projects">Back</Link>
        </div>
      )}
      <div className="mt-4">{children}</div>
    </nav>
  )
}
