import React from "react";
import { Button, ButtonSpinner, ButtonText } from "@/shared/ui/button";
import { Heading } from "@/shared/ui/heading";
import { Text } from "@/shared/ui/text";
import { VStack } from "@/shared/ui/vstack";
import { useHomeViewModel } from "./useHomeViewModel";

export function HomeView({ onLoggedOut }: { onLoggedOut: () => void }) {
  const vm = useHomeViewModel();

  const handleLogout = async () => {
    await vm.signOut();
    onLoggedOut();
  };

  return (
    <VStack space="lg" className="flex-1 justify-center bg-background-0 px-6">
      <Heading size="2xl">Hello, {vm.user?.name ?? "there"}</Heading>
      <Text className="text-typography-500">{vm.user?.email}</Text>
      <Button action="secondary" onPress={handleLogout} isDisabled={vm.isLoggingOut}>
        {vm.isLoggingOut ? <ButtonSpinner /> : <ButtonText>Log out</ButtonText>}
      </Button>
    </VStack>
  );
}
