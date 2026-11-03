import { BaseError } from "./BaseError";

/** The request never reached the server or the server failed (offline, timeout, 5xx). */
export class NetworkError extends BaseError {
  readonly kind = "network" as const;

  constructor(message = "Network error. Check your connection and try again.") {
    super(message);
  }
}
