import type { AsyncThunk } from '@reduxjs/toolkit'

/**
 * We've created a custom type which is a wrapper around RTK's AsyncThunk type that allows us to
 * write cleaner generics when using `createAsyncThunk`. It sets defaults so you don't always have
 * to provide them because in most cases you're probably not using all three type arguments
 */
export type CustomAsyncThunk<
  Returned, // what your async thunk will return
  ThunkArg = void, // the first argument of the callback function (aka payloadCreator) that will handle your thunk. This represents the data passed in during dispatching
  ThunkApiConfig = Record<string, unknown> // The thunk API, the 2nd argument of the callback function
> = AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
