/**
 * Base class for every error that crosses a layer boundary.
 * `kind` gives a stable discriminator, so callers can branch without `instanceof`
 * (which is unreliable across bundles and after serialisation).
 */
export abstract class BaseError extends Error {
  abstract readonly kind: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends BaseError {
  readonly kind = "unauthorized" as const;
}

export class UnknownError extends BaseError {
  readonly kind = "unknown" as const;
}
