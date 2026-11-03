import type { Result } from "@/shared/error";
import type { Session } from "../entities/User";

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpInput extends Credentials {
  name: string;
}

/** Contract the domain depends on. The data layer provides the implementation. */
export interface AuthRepository {
  login(credentials: Credentials): Promise<Result<Session>>;
  signUp(input: SignUpInput): Promise<Result<Session>>;
  logout(token: string): Promise<Result<void>>;
}
