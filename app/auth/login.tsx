import { router } from "expo-router";
import { LoginView } from "@/features/auth";

// Routes stay thin: they only wire navigation into feature views.
export default function LoginRoute() {
  return <LoginView onLoggedIn={() => router.replace("/home")} onGoToSignUp={() => router.push("/auth/signup")} />;
}
