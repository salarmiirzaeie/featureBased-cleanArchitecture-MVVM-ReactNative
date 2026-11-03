import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/shared/ui/button";
import { Heading } from "@/shared/ui/heading";
import { Text } from "@/shared/ui/text";
import { VStack } from "@/shared/ui/vstack";
import { useSignUpViewModel } from "../viewmodels/useSignUpViewModel";
import { AuthTextField } from "./AuthTextField";

interface Props {
  onSignedUp: () => void;
  onGoToLogin: () => void;
}

export function SignUpView({ onSignedUp, onGoToLogin }: Props) {
  const vm = useSignUpViewModel();

  const handleSubmit = async () => {
    if (await vm.submit()) onSignedUp();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background-0">
      <ScrollView contentContainerClassName="flex-grow justify-center">
        <VStack space="lg" className="px-6 py-10">
          <Heading size="2xl">Create account</Heading>

          <AuthTextField label="Name" value={vm.values.name} onChangeText={(v) => vm.setField("name", v)} error={vm.fieldErrors.name} />
          <AuthTextField
            label="Email"
            keyboardType="email-address"
            value={vm.values.email}
            onChangeText={(v) => vm.setField("email", v)}
            error={vm.fieldErrors.email}
          />
          <AuthTextField
            label="Password"
            secureTextEntry
            value={vm.values.password}
            onChangeText={(v) => vm.setField("password", v)}
            error={vm.fieldErrors.password}
          />
          <AuthTextField
            label="Confirm password"
            secureTextEntry
            value={vm.values.confirmPassword}
            onChangeText={(v) => vm.setField("confirmPassword", v)}
            error={vm.fieldErrors.confirmPassword}
          />

          {vm.formError ? <Text className="text-error-600">{vm.formError}</Text> : null}

          <Button onPress={handleSubmit} isDisabled={vm.isSubmitting}>
            {vm.isSubmitting ? <ButtonSpinner /> : <ButtonText>Sign up</ButtonText>}
          </Button>
          <Button variant="link" onPress={onGoToLogin}>
            <ButtonText>I already have an account</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
