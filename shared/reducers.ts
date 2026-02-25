import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./api/api";

// import {logout} from './features/auth/authSlice';

const reducers = combineReducers({
  [api.reducerPath]: api.reducer,
});

export const rootReducer = (
  state: any,
  action: { type: string; payload?: any }
) => {
  // if (action.type === logout.type) {
  //   return reducers(undefined, action);
  // }
  return reducers(state, action);
};
