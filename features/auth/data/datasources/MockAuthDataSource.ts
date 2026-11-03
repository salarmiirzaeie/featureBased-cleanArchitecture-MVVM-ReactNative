import type { AuthResponseDto } from "../dto/AuthResponseDto";
import { HttpError, type AuthDataSource } from "./AuthDataSource";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const DEMO_USER = { email: "demo@example.com", password: "Password1", name: "Demo User" };

/**
 * In-memory backend so the app runs end to end without a server.
 * Behaves like the real API: 401 for bad credentials, 409 for a taken email.
 */
export class MockAuthDataSource implements AuthDataSource {
  private users: StoredUser[] = [{ id: "1", ...DEMO_USER }];

  constructor(private readonly latencyMs = 600) {}

  private delay() {
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }

  private toDto(user: StoredUser): AuthResponseDto {
    return {
      access_token: `mock-token-${user.id}-${Date.now()}`,
      user: { id: user.id, full_name: user.name, email: user.email },
    };
  }

  async login(email: string, password: string) {
    await this.delay();
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new HttpError(401, "Invalid email or password.");
    return this.toDto(user);
  }

  async signUp(name: string, email: string, password: string) {
    await this.delay();
    if (this.users.some((u) => u.email === email)) {
      throw new HttpError(409, "Email is already registered.");
    }
    const user = { id: String(this.users.length + 1), name, email, password };
    this.users.push(user);
    return this.toDto(user);
  }

  async logout() {
    await this.delay();
  }
}
