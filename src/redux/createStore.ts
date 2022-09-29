// setup & middleware
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import type { RootState } from '$/models/ui/RootState'

// reducers
import projects from '$/redux/projectsSlice'

/**
 * Redux-Toolkit setup
 * https://redux-toolkit.js.org/usage/usage-guide#simplifying-store-setup-with-configurestore
 * https://redux-toolkit.js.org/tutorials/typescript
 */

export function createStore(preloadedState = {}): EnhancedStore<RootState> {
  let middleWares
  if (import.meta.env.VITE_VERBOSE_REDUX_LOGGING === 'true') {
    middleWares = [logger]
  } else {
    middleWares = []
  }

  /**
   * configureStore
   * api: https://redux-toolkit.js.org/api/configureStore
   * with TypeScript: https://redux-toolkit.js.org/usage/usage-with-typescript#configurestore
   */
  return configureStore({
    // redux toolkit will automatically combine the reducers in this object
    reducer: {
      projects,
    },

    // the redux devtools extension is included and you configure it here
    devTools: { trace: true },

    // automatically runs applyMiddleware
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(middleWares)
    },

    // aka initialState
    preloadedState,
  })
}
