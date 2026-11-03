import { NetworkError, UnauthorizedError, UnknownError, ValidationError } from "@/shared/error";
import { HttpError, type AuthDataSource } from "../data/datasources/AuthDataSource";
import { HttpAuthDataSource } from "../data/datasources/HttpAuthDataSource";
import { DEMO_USER, MockAuthDataSource } from "../data/datasources/MockAuthDataSource";
import { toSession } from "../data/dto/AuthResponseDto";
import { AuthRepositoryImpl, mapError } from "../data/repositories/AuthRepositoryImpl";

const dto = { access_token: "tok", user: { id: 7, full_name: "Salar", email: "s@mail.com" } };

describe("toSession mapper", () => {
  it("maps the server DTO to the domain entity", () => {
    expect(toSession(dto)).toEqual({ token: "tok", user: { id: "7", name: "Salar", email: "s@mail.com" } });
  });

  it("throws on a malformed payload", () => {
    expect(() => toSession({ user: {} } as any)).toThrow("Malformed auth response");
  });
});

describe("mapError", () => {
  it.each([
    [new HttpError(401, "nope"), UnauthorizedError],
    [new HttpError(409, "taken"), ValidationError],
    [new HttpError(422, "bad"), ValidationError],
    [new HttpError(503, "down"), NetworkError],
    [new TypeError("Network request failed"), NetworkError],
    [new Error("weird"), UnknownError],
  ])("maps %p to the right domain error", (input, expected) => {
    expect(mapError(input)).toBeInstanceOf(expected);
  });

  it("puts a 409 conflict on the email field", () => {
    expect((mapError(new HttpError(409, "Email is already registered.")) as ValidationError).fields).toEqual({
      email: "Email is already registered.",
    });
  });
});

describe("AuthRepositoryImpl", () => {
  const source = (impl: Partial<AuthDataSource>): AuthDataSource => ({
    login: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
    ...impl,
  });

  it("returns ok(session) on success", async () => {
    const repo = new AuthRepositoryImpl(source({ login: jest.fn(async () => dto) }));
    expect(await repo.login({ email: "s@mail.com", password: "x" })).toEqual({ ok: true, value: toSession(dto) });
  });

  it("never throws: transport errors become err(...)", async () => {
    const repo = new AuthRepositoryImpl(source({ login: jest.fn(async () => Promise.reject(new HttpError(401, "x"))) }));
    const result = await repo.login({ email: "s@mail.com", password: "x" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("unauthorized");
  });

  it("reports a malformed response as an unknown error", async () => {
    const repo = new AuthRepositoryImpl(source({ signUp: jest.fn(async () => ({}) as any) }));
    const result = await repo.signUp({ name: "a", email: "b", password: "c" });
    expect(!result.ok && result.error.kind).toBe("unknown");
  });
});

describe("MockAuthDataSource", () => {
  it("logs in the demo user and rejects a wrong password", async () => {
    const mock = new MockAuthDataSource(0);
    await expect(mock.login(DEMO_USER.email, DEMO_USER.password)).resolves.toMatchObject({
      user: { email: DEMO_USER.email },
    });
    await expect(mock.login(DEMO_USER.email, "wrong")).rejects.toMatchObject({ status: 401 });
  });

  it("registers new users and refuses duplicates", async () => {
    const mock = new MockAuthDataSource(0);
    await mock.signUp("New", "new@mail.com", "abcd1234");
    await expect(mock.login("new@mail.com", "abcd1234")).resolves.toBeDefined();
    await expect(mock.signUp("Again", "new@mail.com", "abcd1234")).rejects.toMatchObject({ status: 409 });
  });
});

describe("HttpAuthDataSource", () => {
  const response = (status: number, body: unknown) =>
    ({ ok: status < 400, status, statusText: "x", json: async () => body }) as Response;

  it("posts JSON to the right URL", async () => {
    const fetchFn = jest.fn(async () => response(200, dto));
    await new HttpAuthDataSource("https://api.test/", fetchFn as any).login("a@b.co", "pw");

    expect(fetchFn).toHaveBeenCalledWith(
      "https://api.test/auth/login",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "a@b.co", password: "pw" }) })
    );
  });

  it("throws HttpError with the server message on failure", async () => {
    const fetchFn = jest.fn(async () => response(409, { message: "Email taken" }));
    await expect(new HttpAuthDataSource("https://api.test", fetchFn as any).signUp("n", "e", "p")).rejects.toMatchObject({
      status: 409,
      message: "Email taken",
    });
  });

  it("sends the Bearer token on logout", async () => {
    const fetchFn = jest.fn(async () => response(204, null));
    await new HttpAuthDataSource("https://api.test", fetchFn as any).logout("tok");
    expect((fetchFn.mock.calls[0] as any)[1].headers.Authorization).toBe("Bearer tok");
  });
});
