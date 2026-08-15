import { mapNotification } from "./notificationMapper";

describe("mapNotification", () => {
  it("maps snake_case DRF fields to camelCase", () => {
    const raw = {
      id: 1,
      title: "Promoción por finalizar",
      message: "Tu promoción termina hoy",
      link: "/product/42",
      created_at: "2026-08-15T10:00:00Z",
      is_read: false,
      read_at: null,
    };

    expect(mapNotification(raw)).toEqual({
      id: 1,
      title: "Promoción por finalizar",
      message: "Tu promoción termina hoy",
      link: "/product/42",
      createdAt: "2026-08-15T10:00:00Z",
      isRead: false,
      readAt: null,
    });
  });

  it("defaults link to an empty string and isRead to false when absent", () => {
    const raw = {
      id: 2,
      title: "T",
      message: "M",
      created_at: "2026-08-15T10:00:00Z",
    };

    const result = mapNotification(raw);
    expect(result.link).toBe("");
    expect(result.isRead).toBe(false);
    expect(result.readAt).toBeNull();
  });

  it("accepts already-camelCase input", () => {
    const raw = {
      id: 3,
      title: "T",
      message: "M",
      link: "/x",
      createdAt: "2026-08-15T10:00:00Z",
      isRead: true,
      readAt: "2026-08-15T11:00:00Z",
    };

    expect(mapNotification(raw)).toEqual({
      id: 3,
      title: "T",
      message: "M",
      link: "/x",
      createdAt: "2026-08-15T10:00:00Z",
      isRead: true,
      readAt: "2026-08-15T11:00:00Z",
    });
  });
});
