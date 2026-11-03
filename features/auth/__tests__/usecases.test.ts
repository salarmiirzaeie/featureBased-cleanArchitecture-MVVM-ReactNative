import { err, UnauthorizedError, ValidationError } from "@/shared/error";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { LogoutUseCase } from "../domain/usecases/LogoutUseCase";
import { SignUpUseCase } from "../domain/usecases/SignUpUseCase";
import { fakeRepository, session } from "./fakes";

describe("LoginUseCase", () => {
  it("rejects invalid input without calling the repository", async () => {
    const repo = fakeRepository();
    const result = await new LoginUseCase(repo).execute({ email: "bad", password: "" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect((result.error as ValidationError).fields).toEqual({
        email: "Enter a valid email address.",
        password: "Password is required.",
      });
    }
    expect(repo.login).not.toHaveBeenCalled();
  });

  it("normalizes the email before calling the repository", async () => {
    const repo = fakeRepository();
    const result = await new LoginUseCase(repo).execute({ email: " Salar@Mail.com ", password: "x" });

    expect(repo.login).toHaveBeenCalledWith({ email: "salar@mail.com", password: "x" });
    expect(result).toEqual({ ok: true, value: session });
  });

  it("passes repository failures through unchanged", async () => {
    const failure = err(new UnauthorizedError("Invalid email or password."));
    const repo = fakeRepository({ login: jest.fn(async () => failure) });
    expect(await new LoginUseCase(repo).execute({ email: "a@b.co", password: "x" })).toBe(failure);
  });
});

describe("SignUpUseCase", () => {
  const valid = { name: " Salar ", email: "S@Mail.com", password: "abcd1234", confirmPassword: "abcd1234" };

  it("reports every invalid field at once", async () => {
    const repo = fakeRepository();
    const result = await new SignUpUseCase(repo).execute({ name: "", email: "x", password: "short", confirmPassword: "other" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys((result.error as ValidationError).fields).sort()).toEqual(
        ["confirmPassword", "email", "name", "password"]
      );
    }
    expect(repo.signUp).not.toHaveBeenCalled();
  });

  it("trims the name and normalizes the email", async () => {
    const repo = fakeRepository();
    await new SignUpUseCase(repo).execute(valid);
    expect(repo.signUp).toHaveBeenCalledWith({ name: "Salar", email: "s@mail.com", password: "abcd1234" });
  });
});

describe("LogoutUseCase", () => {
  it("delegates to the repository with the token", async () => {
    const repo = fakeRepository();
    await new LogoutUseCase(repo).execute("t-1");
    expect(repo.logout).toHaveBeenCalledWith("t-1");
  });
});
