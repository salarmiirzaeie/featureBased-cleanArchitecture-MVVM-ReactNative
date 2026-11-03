import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "../../domain/entities/User";

export interface SessionState {
  user: User | null;
  token: string | null;
}

const initialState: SessionState = { user: null, token: null };

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionStarted: (_state, action: PayloadAction<Session>) => ({
      user: action.payload.user,
      token: action.payload.token,
    }),
    sessionEnded: () => initialState,
  },
});

export const { sessionStarted, sessionEnded } = sessionSlice.actions;
export default sessionSlice.reducer;

type WithSession = { session: SessionState };
export const selectCurrentUser = (state: WithSession) => state.session.user;
export const selectToken = (state: WithSession) => state.session.token;
export const selectIsAuthenticated = (state: WithSession) => Boolean(state.session.token);
