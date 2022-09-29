import produce from 'immer'
import { Dispatch, Action, AnyAction, Reducer as ReduxReducer } from 'redux'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ActionWithData<R> extends Action {
  data?: R
}

type ActionResult<R> = Promise<R> | R
type ActionHandler<R, P extends any[]> = (...args: P) => () => ActionResult<R>
type ActionPromise<R, T, P extends any[]> = (
  ...args: P
) => (dispatch: Dispatch<ActionWithData<R>>, getState: GetState<T>) => Promise<R>
type Reducer<R, T> = (payload: R, draft: T) => void
type ReducerMap<R, T> = { [type: string]: Reducer<R, T> }
type GetState<T> = () => T

interface ActionReducer<R, T, P extends any[]> {
  type: string
  action: ActionHandler<R, P>
  reducer: Reducer<R, T>
}

/**
 * ReducerFactory implements the duck pattern in a concise way. The pattern is intended to force the programmer to
 * implement the action and the reducer in pairs. The steps to create an action/reducer pair using the factory are:
 *
 * 1. Instantiate a new factory
 * 2. Call add() to add action/reducer pair
 * 3. The add() function returns an action creator so export the associated action creator
 * 4. Call create() to generate a reducer
 * 5. Export the reducer
 *
 * Simple Example:

  const initialState = {}

  const factory = new ReducerFactory<ProjectsState>(initialState)

  export const fetchProjects = factory.add({
    type: 'FETCH_PROJECTS',
    action: () => async (fetchUtil: FetchUtil): Promise<ProjectJson[]> => {
      return await fetchUtil.get(`${ROOT_URL}/projects`)
    },
    reducer: (data, draft) => {
      draft.projects = data
    },
  })

  export const projects = factory.create()

 *
 * Note: The factory will orchestrate the use of the action and reducer and incorporate immer into the state.
 * Your reducer will be provided exactly what is returned from your action, and the draft object is an immer draft
 * of your state. This ensures that the state is always updated in a safe immutable way. Modify the immer draft
 * however needed and the rest will be handled by immer and the factory.
 *
 */
export class ReducerFactory<T> {
  constructor(public initialState: T) {}

  private reducers: ReducerMap<any, T> = {}

  private addAction<R, P extends any[]>(
    type: string,
    action: ActionHandler<R, P>,
    reducer: Reducer<R, T>
  ): ActionPromise<R, T, P> {
    this.reducers[type] = reducer
    return (...args: P) =>
      async (dispatch: Dispatch<ActionWithData<R>>) => {
        const data: R = await action(...args)()
        dispatch({ type, data })
        return data
      }
  }

  add<R, P extends any[]>(actionReducer: ActionReducer<R, T, P>): ActionPromise<R, T, P>
  add<R, P extends any[]>(type: string, action: ActionHandler<R, P>, reducer: Reducer<R, T>): ActionPromise<R, T, P>
  add<R, P extends any[]>(
    actionReducer: ActionReducer<R, T, P> | string,
    action?: ActionHandler<R, P>,
    reducer?: Reducer<R, T>
  ): ActionPromise<R, T, P> {
    if (typeof actionReducer === 'string' && action && reducer) {
      return this.addAction(actionReducer, action, reducer)
    } else {
      const { type, action, reducer } = actionReducer as ActionReducer<R, T, P>
      return this.addAction(type, action, reducer)
    }
  }

  create<R>(): ReduxReducer<T, AnyAction> {
    return (state: T = this.initialState, action?: ActionWithData<R>) => {
      if (action) {
        const reducer = this.reducers[action.type]
        if (reducer) {
          return produce(state, draft => {
            reducer(action.data, draft as T)
          })
        }
      }
      return state
    }
  }
}
