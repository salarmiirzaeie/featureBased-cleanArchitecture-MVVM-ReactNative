import { BaseError } from "./BaseError";

export type FieldErrors = Record<string, string>;

/** Input was rejected, either locally or by the server. Carries per-field messages for the form. */
export class ValidationError extends BaseError {
  readonly kind = "validation" as const;

  constructor(
    readonly fields: FieldErrors,
    message = "Please fix the highlighted fields."
  ) {
    super(message);
  }
}
