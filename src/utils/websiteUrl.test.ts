import { normalizeWebsiteUrl, isValidWebsiteUrl } from "./websiteUrl";

describe("normalizeWebsiteUrl", () => {
  it("prepends https:// when no protocol is present", () => {
    expect(normalizeWebsiteUrl("www.sitio.com")).toBe("https://www.sitio.com");
  });

  it("leaves an existing http:// or https:// protocol untouched", () => {
    expect(normalizeWebsiteUrl("http://sitio.com")).toBe("http://sitio.com");
    expect(normalizeWebsiteUrl("https://sitio.com")).toBe("https://sitio.com");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeWebsiteUrl("  www.sitio.com  ")).toBe(
      "https://www.sitio.com",
    );
  });
});

describe("isValidWebsiteUrl", () => {
  it("accepts a bare domain", () => {
    expect(isValidWebsiteUrl("www.sitio.com")).toBe(true);
  });

  it("accepts a domain with an explicit protocol", () => {
    expect(isValidWebsiteUrl("https://sitio.com")).toBe(true);
  });

  it("rejects an empty value", () => {
    expect(isValidWebsiteUrl("")).toBe(false);
    expect(isValidWebsiteUrl("   ")).toBe(false);
  });

  it("rejects a value that cannot form a valid URL", () => {
    expect(isValidWebsiteUrl("not a url")).toBe(false);
  });
});
