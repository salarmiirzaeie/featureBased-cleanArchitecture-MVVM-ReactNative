import { err, ValidationError, type Result } from "@/shared/error";
import type { Session } from "../entities/User";
import type { AuthRepository, SignUpInput } from "../repositories/AuthRepository";
import { collectErrors, normalizeEmail, validateEmail, validateName, validatePassword } from "../validation";

export interface SignUpForm extends SignUpInput {
  confirmPassword: string;
}

export class SignUpUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute({ name, email, password, confirmPassword }: SignUpForm): Promise<Result<Session>> {
    const fields = collectErrors({
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: password === confirmPassword ? undefined : "Passwords do not match.",
    });
    if (Object.keys(fields).length > 0) return err(new ValidationError(fields));

    return this.repository.signUp({ name: name.trim(), email: normalizeEmail(email), password });
  }
}
