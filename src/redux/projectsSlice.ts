import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ProjectStatus } from '$/models/ui/ProjectStatus'
import { ProjectAdapter } from '$/models/adapters/ProjectAdapter'
import type { ProjectJson } from '$/models/api/ProjectJson'
import type { Project } from '$/models/ui/Project'
import type { KeyBoolean } from '$/models/ui/KeyBoolean'
import type { ProjectsState } from '$/models/ui/ProjectsState'
import type { CustomAsyncThunk } from '$/redux/types'
import { get, patch, post } from '../util/fetch'

const initialState: ProjectsState = {
  projectsById: {},
  statusVisibility: Object.keys(ProjectStatus).reduce((p, n) => ({ ...p, [n]: true }), {}),
}

/**
 * createAsyncThunk
 * API: https://redux-toolkit.js.org/api/createAsyncThunk
 * with TypeScript: https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk
 *
 * CustomAsyncThunk - see file `src/redux/types.d.ts` for more info
 */

export const fetchProjects: CustomAsyncThunk<ProjectJson[]> = createAsyncThunk('app/fetchAllProjects', async () => {
  return await get(`/api/projects`)
})

export const updateProject: CustomAsyncThunk<Project, Project> = createAsyncThunk(
  'app/updateProject',
  async project => {
    let data
    const projectAsJson = ProjectAdapter.toJson(project)
    if (project.id) {
      data = await patch(`/api/project/${project.id}`, projectAsJson)
    } else {
      data = await post(`/api/project`, projectAsJson)
    }
    return ProjectAdapter.toModel(data) || ({} as Project)
  }
)

/**
 * createSlice
 * API: https://redux-toolkit.js.org/api/createSlice
 * with TypeScript: https://redux-toolkit.js.org/usage/usage-with-typescript#createslice
 */

export const projectsSlice = createSlice({
  name: 'app/projects',
  initialState: initialState,

  /**
   * non-async reducers go here.
   * actions are automatically generated and you export them below
   */
  reducers: {
    setStatusVisibility: (state, action: PayloadAction<KeyBoolean>) => {
      const { payload } = action
      Object.entries(payload).forEach(([key, value]) => {
        state.statusVisibility[key] = value
      })
    },
  },

  /**
   * extraReducers
   * this is where you add reducers where their actions are created externally from this slice.
   * So any reducers added here will not autogenerate their action.
   * https://redux-toolkit.js.org/api/createSlice#extrareducers
   *
   * Since we created async thunk actions above, their reducers go in here
   */
  extraReducers: builder => {
    // because we're using TypeScript, we always need to use the builder callback
    // https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers
    builder
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectJson[]>) => {
        const { payload: projects } = action
        state.projectsById = projects
          .map(ProjectAdapter.toModel)
          .reduce((prev, next) => ({ ...prev, [next.id as string]: next }), {})
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        // TODO show something in the UI showing that this fails
        console.error('fetchProjects rejected', action.error)
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const { payload: project } = action
        if (project.id) {
          state.projectsById[project.id] = project
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        // TODO show something in the UI showing that this fails
        console.error('updateProject rejected', action.error)
      })

    /*
    TODO: handle pending status
      .addCase(updateProject.pending, (state, action) => {
        // set a loading state
        // action will be null/undefined in this
      }) 
    */
  },
})

// Action creators are generated for each case reducer function
export const { setStatusVisibility } = projectsSlice.actions

export default projectsSlice.reducer
