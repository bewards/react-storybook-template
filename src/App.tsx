// npm packages
import { FC } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useLocation } from 'react-router-dom'

// local components, etc
import './App.scss'
import { ErrorBoundary, Navigation, StatusToggle } from '$/components'
import { projectStatuses } from '$/models/ui/ProjectStatus'
import PageRoutes from '$/pages/PageRoutes'

// redux
import { setStatusVisibility } from '$/redux/projectsSlice'

// types only
import type { KeyBoolean } from '$/models/ui/KeyBoolean'
import type { RootState } from '$/models/ui/RootState'

const handleStatusClicked = (props: Props) => (status: string) => {
  const { statusVisibility = {} } = props
  props.setStatusVisibility({ [status]: !statusVisibility[status] })
}
const App: FC<Props> = (props: Props) => {
  const { statusVisibility } = props
  const { pathname = '' } = useLocation()
  const isHome = pathname === '/' || pathname.includes('/projects')
  return (
    <ErrorBoundary>
      <main className="p-4">
        <Navigation isHome={isHome}>
          {isHome && (
            <StatusToggle
              onItemClicked={handleStatusClicked(props)}
              itemVisibility={statusVisibility}
              items={projectStatuses}
            />
          )}
        </Navigation>
        <PageRoutes />
      </main>
    </ErrorBoundary>
  )
}

interface PropsFromRedux {
  statusVisibility: KeyBoolean
}

const mapDispatchToProps = {
  setStatusVisibility,
}

const mapStateToProps = (rootState: RootState): PropsFromRedux => {
  return {
    statusVisibility: rootState.projects.statusVisibility,
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

export default connector(App)
