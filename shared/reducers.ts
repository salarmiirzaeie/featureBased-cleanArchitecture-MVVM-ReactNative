import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import { sessionEnded, sessionReducer } from "@/features/auth";
import { api } from "./api/api";

const appReducer = combineReducers({
  session: sessionReducer,
  [api.reducerPath]: api.reducer,
});

export type AppState = ReturnType<typeof appReducer>;

/** Logging out resets the whole store, so no cached data from the previous user survives. */
export const rootReducer = (state: AppState | undefined, action: UnknownAction): AppState => {
  if (action.type === sessionEnded.type) return appReducer(undefined, action);
  return appReducer(state, action);
};
