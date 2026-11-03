import { HttpAuthDataSource } from "./data/datasources/HttpAuthDataSource";
import { MockAuthDataSource } from "./data/datasources/MockAuthDataSource";
import type { AuthDataSource } from "./data/datasources/AuthDataSource";
import { AuthRepositoryImpl } from "./data/repositories/AuthRepositoryImpl";
import { LoginUseCase } from "./domain/usecases/LoginUseCase";
import { LogoutUseCase } from "./domain/usecases/LogoutUseCase";
import { SignUpUseCase } from "./domain/usecases/SignUpUseCase";

/** Composition root for the auth feature: the only place that knows concrete classes. */
export function createAuthModule(dataSource: AuthDataSource) {
  const repository = new AuthRepositoryImpl(dataSource);
  return {
    login: new LoginUseCase(repository),
    signUp: new SignUpUseCase(repository),
    logout: new LogoutUseCase(repository),
  };
}

export type AuthModule = ReturnType<typeof createAuthModule>;

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/** Uses the real API when EXPO_PUBLIC_API_URL is set, otherwise the in-memory mock. */
export const authModule: AuthModule = createAuthModule(
  apiUrl ? new HttpAuthDataSource(apiUrl) : new MockAuthDataSource()
);
