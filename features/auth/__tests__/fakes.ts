import { ok, type Result } from "@/shared/error";
import type { Session } from "../domain/entities/User";
import type { AuthRepository } from "../domain/repositories/AuthRepository";

export const session: Session = { token: "t-1", user: { id: "1", name: "Salar", email: "salar@mail.com" } };

export function fakeRepository(overrides: Partial<AuthRepository> = {}): jest.Mocked<AuthRepository> {
  return {
    login: jest.fn(async (): Promise<Result<Session>> => ok(session)),
    signUp: jest.fn(async (): Promise<Result<Session>> => ok(session)),
    logout: jest.fn(async (): Promise<Result<void>> => ok(undefined)),
    ...overrides,
  } as jest.Mocked<AuthRepository>;
}
