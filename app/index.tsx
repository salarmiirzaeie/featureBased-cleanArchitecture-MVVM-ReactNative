import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";

/** Entry route: sends the user to the right place based on the persisted session. */
export default function Index() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return <Redirect href={isAuthenticated ? "/home" : "/auth/login"} />;
}
