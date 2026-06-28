import { objectToFormData } from "./formData";

describe("objectToFormData", () => {
  it("throws when given a primitive without a key", () => {
    expect(() => objectToFormData("value")).toThrow(
      "Cannot append value without a key"
    );
  });

  it("appends a primitive value under the given key", () => {
    const fd = objectToFormData("hello", new FormData(), "name");
    expect(fd.get("name")).toBe("hello");
  });

  it("converts Date values to ISO strings", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    const fd = objectToFormData(date, new FormData(), "createdAt");
    expect(fd.get("createdAt")).toBe(date.toISOString());
  });

  it("converts camelCase object keys to snake_case", () => {
    const fd = objectToFormData({ businessName: "Marky" });
    expect(fd.get("business_name")).toBe("Marky");
  });

  it("nests object keys using bracket notation", () => {
    const fd = objectToFormData({ category: { id: 5, name: "Bebidas" } });
    expect(fd.get("category[id]")).toBe("5");
    expect(fd.get("category[name]")).toBe("Bebidas");
  });

  it("represents arrays using indexed bracket notation", () => {
    const fd = objectToFormData({
      variants: [{ name: "Chico" }, { name: "Grande" }],
    });
    expect(fd.get("variants[0][name]")).toBe("Chico");
    expect(fd.get("variants[1][name]")).toBe("Grande");
  });

  it("appends the _delete flag when true", () => {
    const fd = objectToFormData({ media: [{ id: 1, _delete: true }] });
    expect(fd.get("media[0][_delete]")).toBe("true");
    expect(fd.get("media[0][id]")).toBe("1");
  });

  it("skips file/image fields when their value is a string URL", () => {
    const fd = objectToFormData({
      image: "https://example.com/a.png",
      name: "x",
    });
    expect(fd.get("image")).toBeNull();
    expect(fd.get("name")).toBe("x");
  });

  it("includes File values for file/image fields", () => {
    const file = new File(["data"], "photo.png", { type: "image/png" });
    const fd = objectToFormData({ image: file });
    expect(fd.get("image")).toBe(file);
  });

  it("skips null and undefined values", () => {
    const fd = objectToFormData({ a: null, b: undefined, c: "kept" });
    expect(fd.get("a")).toBeNull();
    expect(fd.get("b")).toBeNull();
    expect(fd.get("c")).toBe("kept");
  });
});
