import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-native";
import { err, ok, UnauthorizedError, ValidationError } from "@/shared/error";
import sessionReducer, { selectIsAuthenticated, sessionEnded, sessionStarted } from "../presentation/state/sessionSlice";
import { useLoginViewModel } from "../presentation/viewmodels/useLoginViewModel";
import { useSignUpViewModel } from "../presentation/viewmodels/useSignUpViewModel";
import { session } from "./fakes";

function setup<T>(hook: () => T) {
  const store = configureStore({ reducer: { session: sessionReducer } });
  const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
  return { store, ...renderHook(hook, { wrapper }) };
}

describe("session slice", () => {
  it("starts and ends a session", () => {
    let state = sessionReducer(undefined, sessionStarted(session));
    expect(selectIsAuthenticated({ session: state })).toBe(true);
    state = sessionReducer(state, sessionEnded());
    expect(state).toEqual({ user: null, token: null });
  });
});

describe("useLoginViewModel", () => {
  it("logs in and stores the session", async () => {
    const login = { execute: jest.fn(async () => ok(session)) };
    const { result, store } = setup(() => useLoginViewModel(login));

    act(() => {
      result.current.setField("email", "salar@mail.com");
      result.current.setField("password", "abcd1234");
    });
    let success = false;
    await act(async () => {
      success = await result.current.submit();
    });

    expect(success).toBe(true);
    expect(login.execute).toHaveBeenCalledWith({ email: "salar@mail.com", password: "abcd1234" });
    expect(store.getState().session.token).toBe("t-1");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("shows field errors for validation failures and clears them when the field changes", async () => {
    const login = { execute: jest.fn(async () => err(new ValidationError({ email: "Email is required." }))) };
    const { result } = setup(() => useLoginViewModel(login));

    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.fieldErrors).toEqual({ email: "Email is required." });

    act(() => result.current.setField("email", "a"));
    expect(result.current.fieldErrors).toEqual({});
  });

  it("shows a form-level error for other failures and keeps the user logged out", async () => {
    const login = { execute: jest.fn(async () => err(new UnauthorizedError("Invalid email or password."))) };
    const { result, store } = setup(() => useLoginViewModel(login));

    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.formError).toBe("Invalid email or password.");
    expect(store.getState().session.token).toBeNull();
  });
});

describe("useSignUpViewModel", () => {
  it("signs up and stores the session", async () => {
    const signUp = { execute: jest.fn(async () => ok(session)) };
    const { result, store } = setup(() => useSignUpViewModel(signUp));

    await act(async () => {
      await result.current.submit();
    });
    expect(store.getState().session.user?.name).toBe("Salar");
  });

  it("shows the server message when a validation error has no field details", async () => {
    const signUp = { execute: jest.fn(async () => err(new ValidationError({}, "Weak password"))) };
    const { result } = setup(() => useSignUpViewModel(signUp));

    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.formError).toBe("Weak password");
  });
});
