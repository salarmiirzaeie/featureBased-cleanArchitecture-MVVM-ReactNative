import { err, ValidationError, type Result } from "@/shared/error";
import type { Session } from "../entities/User";
import type { AuthRepository, Credentials } from "../repositories/AuthRepository";
import { collectErrors, normalizeEmail, validateEmail } from "../validation";

export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute({ email, password }: Credentials): Promise<Result<Session>> {
    // Login only checks presence/format; strength rules belong to sign-up.
    const fields = collectErrors({
      email: validateEmail(email),
      password: password ? undefined : "Password is required.",
    });
    if (Object.keys(fields).length > 0) return err(new ValidationError(fields));

    return this.repository.login({ email: normalizeEmail(email), password });
  }
}
