import type { Session } from "../../domain/entities/User";

/** Shape returned by the backend. Kept separate from the domain entity on purpose. */
export interface AuthResponseDto {
  access_token: string;
  user: {
    id: string | number;
    full_name: string;
    email: string;
  };
}

/** Maps and validates a server payload. Throws on malformed data so the repository can report it. */
export function toSession(dto: AuthResponseDto): Session {
  if (!dto?.access_token || !dto.user?.email || dto.user.id === undefined) {
    throw new TypeError("Malformed auth response");
  }
  return {
    token: dto.access_token,
    user: { id: String(dto.user.id), name: dto.user.full_name ?? "", email: dto.user.email },
  };
}
