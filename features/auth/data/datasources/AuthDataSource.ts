import type { AuthResponseDto } from "../dto/AuthResponseDto";

/** Raised by data sources for non-2xx responses. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export interface AuthDataSource {
  login(email: string, password: string): Promise<AuthResponseDto>;
  signUp(name: string, email: string, password: string): Promise<AuthResponseDto>;
  logout(token: string): Promise<void>;
}
