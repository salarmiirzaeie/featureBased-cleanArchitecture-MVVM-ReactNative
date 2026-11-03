import type { FieldErrors } from "@/shared/error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain letters and numbers.";
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < 2) return "Name is too short.";
  return undefined;
}

/** Drops undefined entries so an empty object means "valid". */
export function collectErrors(entries: Record<string, string | undefined>): FieldErrors {
  return Object.fromEntries(
    Object.entries(entries).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
}
