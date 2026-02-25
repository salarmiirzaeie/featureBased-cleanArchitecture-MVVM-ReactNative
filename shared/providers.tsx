import React, { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <GluestackUIProvider mode="light">
          <SafeAreaProvider
            style={{
              flex: 1,
            }}
          >
            {children}
          </SafeAreaProvider>
        </GluestackUIProvider>
      </PersistGate>
    </ReduxProvider>
  );
};
