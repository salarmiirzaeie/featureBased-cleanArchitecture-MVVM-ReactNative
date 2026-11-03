import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/shared/ui/button";
import { Heading } from "@/shared/ui/heading";
import { Text } from "@/shared/ui/text";
import { VStack } from "@/shared/ui/vstack";
import { useLoginViewModel } from "../viewmodels/useLoginViewModel";
import { AuthTextField } from "./AuthTextField";
import { DEMO_USER } from "../../data/datasources/MockAuthDataSource";

interface Props {
  onLoggedIn: () => void;
  onGoToSignUp: () => void;
}

export function LoginView({ onLoggedIn, onGoToSignUp }: Props) {
  const vm = useLoginViewModel();

  const handleSubmit = async () => {
    if (await vm.submit()) onLoggedIn();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background-0">
      <VStack space="lg" className="flex-1 justify-center px-6">
        <Heading size="2xl">Welcome back</Heading>
        <Text className="text-typography-500">
          Demo account: {DEMO_USER.email} / {DEMO_USER.password}
        </Text>

        <AuthTextField
          label="Email"
          testID="login-email"
          keyboardType="email-address"
          value={vm.values.email}
          onChangeText={(v) => vm.setField("email", v)}
          error={vm.fieldErrors.email}
        />
        <AuthTextField
          label="Password"
          testID="login-password"
          secureTextEntry
          value={vm.values.password}
          onChangeText={(v) => vm.setField("password", v)}
          error={vm.fieldErrors.password}
        />

        {vm.formError ? <Text className="text-error-600">{vm.formError}</Text> : null}

        <Button onPress={handleSubmit} isDisabled={vm.isSubmitting}>
          {vm.isSubmitting ? <ButtonSpinner /> : <ButtonText>Log in</ButtonText>}
        </Button>
        <Button variant="link" onPress={onGoToSignUp}>
          <ButtonText>Create an account</ButtonText>
        </Button>
      </VStack>
    </KeyboardAvoidingView>
  );
}
