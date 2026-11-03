import {
  err,
  NetworkError,
  ok,
  UnauthorizedError,
  UnknownError,
  ValidationError,
  type BaseError,
  type Result,
} from "@/shared/error";
import type { Session } from "../../domain/entities/User";
import type { AuthRepository, Credentials, SignUpInput } from "../../domain/repositories/AuthRepository";
import { HttpError, type AuthDataSource } from "../datasources/AuthDataSource";
import { toSession } from "../dto/AuthResponseDto";

/** Translates transport-level failures into domain errors. Nothing above this layer sees HTTP. */
export function mapError(e: unknown): BaseError {
  if (e instanceof HttpError) {
    if (e.status === 401 || e.status === 403) return new UnauthorizedError("Invalid email or password.");
    if (e.status === 409) return new ValidationError({ email: e.message || "Email is already registered." });
    if (e.status === 400 || e.status === 422) return new ValidationError({}, e.message);
    if (e.status >= 500) return new NetworkError("The server is unavailable. Try again later.");
    return new UnknownError(e.message);
  }
  // fetch rejects with TypeError when the device is offline or the host is unreachable
  if (e instanceof TypeError && /network|fetch|failed/i.test(e.message)) return new NetworkError();
  return new UnknownError(e instanceof Error ? e.message : "Something went wrong.");
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}

  async login({ email, password }: Credentials): Promise<Result<Session>> {
    try {
      return ok(toSession(await this.dataSource.login(email, password)));
    } catch (e) {
      return err(mapError(e));
    }
  }

  async signUp({ name, email, password }: SignUpInput): Promise<Result<Session>> {
    try {
      return ok(toSession(await this.dataSource.signUp(name, email, password)));
    } catch (e) {
      return err(mapError(e));
    }
  }

  async logout(token: string): Promise<Result<void>> {
    try {
      await this.dataSource.logout(token);
      return ok(undefined);
    } catch (e) {
      return err(mapError(e));
    }
  }
}
