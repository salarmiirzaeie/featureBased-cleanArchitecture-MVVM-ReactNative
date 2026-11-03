import type { Result } from "@/shared/error";
import type { AuthRepository } from "../repositories/AuthRepository";

export class LogoutUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(token: string): Promise<Result<void>> {
    return this.repository.logout(token);
  }
}
