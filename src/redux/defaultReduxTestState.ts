import { RootState } from '$/models/ui/RootState'

/**
 * You should add anything here that you would want in the redux state by default for every test.
 * This might include site configuration data, or the logged in user.
 */
export const defaultReduxState: RootState = {
  projects: { projectsById: {}, statusVisibility: {} },
}
