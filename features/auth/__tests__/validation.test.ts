import { collectErrors, normalizeEmail, validateEmail, validateName, validatePassword } from "../domain/validation";

describe("auth validation rules", () => {
  it("validates email presence and format", () => {
    expect(validateEmail("")).toBe("Email is required.");
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
    expect(validateEmail(" user@mail.com ")).toBeUndefined();
  });

  it("requires 8+ characters with letters and numbers", () => {
    expect(validatePassword("")).toBe("Password is required.");
    expect(validatePassword("abc1")).toBe("Password must be at least 8 characters.");
    expect(validatePassword("abcdefgh")).toBe("Password must contain letters and numbers.");
    expect(validatePassword("12345678")).toBe("Password must contain letters and numbers.");
    expect(validatePassword("abcd1234")).toBeUndefined();
  });

  it("validates names", () => {
    expect(validateName("  ")).toBe("Name is required.");
    expect(validateName("A")).toBe("Name is too short.");
    expect(validateName("Salar")).toBeUndefined();
  });

  it("normalizes email and collects only real errors", () => {
    expect(normalizeEmail("  User@Mail.COM ")).toBe("user@mail.com");
    expect(collectErrors({ a: undefined, b: "bad" })).toEqual({ b: "bad" });
  });
});
