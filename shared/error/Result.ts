import type { BaseError } from "./BaseError";

/**
 * Explicit success/failure value returned by repositories and use cases.
 * Domain code never throws for expected failures; it returns `err(...)`.
 */
export type Result<T, E extends BaseError = BaseError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E extends BaseError>(error: E): Result<never, E> => ({ ok: false, error });
