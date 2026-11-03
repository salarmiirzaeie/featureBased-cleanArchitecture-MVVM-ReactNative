import type { AuthResponseDto } from "../dto/AuthResponseDto";
import { HttpError, type AuthDataSource } from "./AuthDataSource";

export class HttpAuthDataSource implements AuthDataSource {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = fetch
  ) {}

  private async request<T>(path: string, body: unknown, token?: string): Promise<T> {
    const response = await this.fetchFn(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new HttpError(response.status, payload?.message ?? response.statusText);
    }
    return (response.status === 204 ? undefined : await response.json()) as T;
  }

  login(email: string, password: string) {
    return this.request<AuthResponseDto>("/auth/login", { email, password });
  }

  signUp(name: string, email: string, password: string) {
    return this.request<AuthResponseDto>("/auth/register", { full_name: name, email, password });
  }

  logout(token: string) {
    return this.request<void>("/auth/logout", {}, token);
  }
}
