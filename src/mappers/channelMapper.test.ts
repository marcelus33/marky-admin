import { mapSocialLinksToChannels, mapChannelsToPayload } from "./channelMapper";
import { SocialLink } from "../services/businessService";

describe("mapSocialLinksToChannels", () => {
  it("groups links by platform, ordered by `order`, without collapsing multiple entries", () => {
    const links: SocialLink[] = [
      {
        id: 1,
        platform: "whatsapp",
        platform_display: "WhatsApp",
        label: "Atención",
        url: "595982000000",
        order: 1,
      },
      {
        id: 2,
        platform: "whatsapp",
        platform_display: "WhatsApp",
        label: "Pedidos",
        url: "595981000000",
        order: 0,
      },
      {
        id: 3,
        platform: "instagram",
        platform_display: "Instagram",
        label: "",
        url: "https://www.instagram.com/dulce_momento",
        order: 0,
      },
    ];

    const result = mapSocialLinksToChannels(links);

    expect(result.whatsapp).toEqual([
      { id: 2, label: "Pedidos", url: "595981000000" },
      { id: 1, label: "Atención", url: "595982000000" },
    ]);
    expect(result.instagram).toEqual([
      { id: 3, label: "", url: "dulce_momento" },
    ]);
  });

  it("strips the https:// scheme back off `link` entries for editing", () => {
    const links: SocialLink[] = [
      {
        id: 4,
        platform: "link",
        platform_display: "Enlaces",
        label: "Cómo llegar",
        url: "https://maps.google.com/xyz",
        order: 0,
      },
    ];

    const result = mapSocialLinksToChannels(links);

    expect(result.link).toEqual([
      { id: 4, label: "Cómo llegar", url: "maps.google.com/xyz" },
    ]);
  });
});

describe("mapChannelsToPayload", () => {
  it("re-adds the platform prefix and normalizes link URLs", () => {
    const payload = mapChannelsToPayload({
      instagram: [{ label: "", url: "dulce_momento" }],
      whatsapp: [
        { label: "Pedidos", url: "595981000000" },
        { label: "Atención", url: "595982000000" },
      ],
      link: [{ label: "Cómo llegar", url: "maps.google.com/xyz" }],
    });

    expect(payload).toEqual({
      channels: [
        {
          platform: "instagram",
          label: "",
          url: "https://www.instagram.com/dulce_momento",
        },
        { platform: "whatsapp", label: "Pedidos", url: "595981000000" },
        { platform: "whatsapp", label: "Atención", url: "595982000000" },
        {
          platform: "link",
          label: "Cómo llegar",
          url: "https://maps.google.com/xyz",
        },
      ],
    });
  });

  it("drops entries with a blank URL", () => {
    const payload = mapChannelsToPayload({
      link: [{ label: "Vacío", url: "" }],
    });

    expect(payload).toEqual({ channels: [] });
  });

  it("round-trips through mapSocialLinksToChannels", () => {
    const links: SocialLink[] = [
      {
        id: 1,
        platform: "whatsapp",
        platform_display: "WhatsApp",
        label: "Pedidos",
        url: "595981000000",
        order: 0,
      },
    ];

    const channels = mapSocialLinksToChannels(links);
    const payload = mapChannelsToPayload(channels);

    expect(payload.channels).toEqual([
      { platform: "whatsapp", label: "Pedidos", url: "595981000000" },
    ]);
  });
});
