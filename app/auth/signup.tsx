import { router } from "expo-router";
import { SignUpView } from "@/features/auth";

export default function SignUpRoute() {
  return <SignUpView onSignedUp={() => router.replace("/home")} onGoToLogin={() => router.back()} />;
}
