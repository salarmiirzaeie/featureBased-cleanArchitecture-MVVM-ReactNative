import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authModule, selectCurrentUser, selectToken, sessionEnded } from "@/features/auth";

export function useHomeViewModel(logout = authModule.logout) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /** The local session is always cleared, even if the server call fails. */
  const signOut = useCallback(async () => {
    setIsLoggingOut(true);
    if (token) await logout.execute(token);
    dispatch(sessionEnded());
    setIsLoggingOut(false);
  }, [dispatch, logout, token]);

  return { user, isLoggingOut, signOut };
}
