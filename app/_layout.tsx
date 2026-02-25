import { Providers } from "@/shared/providers";
import { Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
