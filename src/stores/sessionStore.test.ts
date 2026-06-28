import { useSessionStore } from "./sessionStore";

const testUser = {
  id: 1,
  username: "demo",
  email: "demo@marky.com",
  has_configuration: true,
};

describe("sessionStore", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    localStorage.clear();
  });

  it("starts with no session", () => {
    const { accessToken, refreshToken, user } = useSessionStore.getState();
    expect(accessToken).toBeNull();
    expect(refreshToken).toBeNull();
    expect(user).toBeNull();
  });

  it("setSession stores the access token, refresh token and user", () => {
    useSessionStore.getState().setSession({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      user: testUser,
    });

    const state = useSessionStore.getState();
    expect(state.accessToken).toBe("access-123");
    expect(state.refreshToken).toBe("refresh-456");
    expect(state.user).toEqual(testUser);
    expect(state.isAuthenticated()).toBe(true);
  });

  it("clearSession resets the store", () => {
    useSessionStore.getState().setSession({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      user: testUser,
    });

    useSessionStore.getState().clearSession();

    const state = useSessionStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });

  it("isAuthenticated reflects whether an access token is present", () => {
    expect(useSessionStore.getState().isAuthenticated()).toBe(false);

    useSessionStore.getState().setSession({
      accessToken: "access-123",
      refreshToken: "",
      user: null,
    });

    expect(useSessionStore.getState().isAuthenticated()).toBe(true);
  });

  it("updateUserConfiguration preserves other user fields", () => {
    useSessionStore.getState().setSession({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      user: { ...testUser, has_configuration: false },
    });

    useSessionStore.getState().updateUserConfiguration(true);

    expect(useSessionStore.getState().user).toEqual({
      ...testUser,
      has_configuration: true,
    });
  });

  it("updateUserConfiguration is a no-op when there is no user", () => {
    useSessionStore.getState().updateUserConfiguration(true);
    expect(useSessionStore.getState().user).toBeNull();
  });

  it("persists accessToken and user but NOT refreshToken to localStorage", () => {
    useSessionStore.getState().setSession({
      accessToken: "access-123",
      refreshToken: "refresh-456",
      user: testUser,
    });

    const stored = JSON.parse(localStorage.getItem("session-storage") || "{}");
    expect(stored.state.accessToken).toBe("access-123");
    expect(stored.state.user).toEqual(testUser);
    expect(stored.state.refreshToken).toBeUndefined();
  });
});
