import { Redirect, router } from "expo-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";
import { HomeView } from "@/features/home/presentation/HomeView";

export default function HomeRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Redirect href="/auth/login" />;
  return <HomeView onLoggedOut={() => router.replace("/auth/login")} />;
}
