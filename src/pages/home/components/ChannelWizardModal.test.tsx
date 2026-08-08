import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import lightTheme from "../../../themes/light";
import { ChannelWizardModal } from "./ChannelWizardModal";
import { useSessionStore } from "../../../stores/sessionStore";
import {
  updateSocialMediaLinks,
  getBusinessAccountInfo,
} from "../../../services/businessService";

// businessService transitively imports axiosConfig -> axios, whose installed
// version ships ESM-only and breaks CRA's default Jest transform, same
// reasoning as productGrid.test.tsx mocking productService/businessService.
// Jest hoists this above the imports above at runtime regardless of source
// order, so the mock is in place before ChannelWizardModal.tsx ever imports it.
jest.mock("../../../services/businessService", () => ({
  updateSocialMediaLinks: jest.fn(),
  getBusinessAccountInfo: jest.fn(),
}));

const mockedGetBusinessAccountInfo = getBusinessAccountInfo as jest.Mock;
const mockedUpdateSocialMediaLinks = updateSocialMediaLinks as jest.Mock;

const renderModal = (props: Partial<React.ComponentProps<typeof ChannelWizardModal>> = {}) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <ChannelWizardModal open onClose={() => {}} {...props} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("ChannelWizardModal", () => {
  beforeEach(() => {
    mockedUpdateSocialMediaLinks.mockResolvedValue(undefined);
    useSessionStore.setState({
      user: {
        id: 1,
        username: "biz",
        email: "biz@test.com",
        has_configuration: true,
        phone_number: "595911111111", // stale value set at login
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    useSessionStore.setState({ user: null });
  });

  it("prefills WhatsApp with the current phone number from the account info query, not the stale session value", async () => {
    mockedGetBusinessAccountInfo.mockResolvedValue({
      phone_number: "595922222222", // updated later in Account settings
    });

    renderModal();

    await waitFor(() => {
      expect(mockedGetBusinessAccountInfo).toHaveBeenCalled();
    });

    // Walk the wizard: welcome -> pick "WhatsApp" -> admin step.
    fireEvent.click(screen.getByText("Configurar canales"));
    fireEvent.click(screen.getByText("WhatsApp"));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    const whatsappInput = (await screen.findByPlaceholderText(
      "Ingrese su número",
    )) as HTMLInputElement;

    await waitFor(() => {
      expect(whatsappInput.value.replace(/\D/g, "")).toContain("922222222");
    });
    expect(whatsappInput.value.replace(/\D/g, "")).not.toContain("911111111");
  });

  it("redisplays a saved website URL without the https:// prefix, matching the placeholder format", async () => {
    mockedGetBusinessAccountInfo.mockResolvedValue({ phone_number: "" });

    renderModal({
      initialData: [{ type: "website", url: "https://www.sitio.com" } as any],
    });

    const websiteInput = (await screen.findByPlaceholderText(
      "www.sitio.com",
    )) as HTMLInputElement;

    expect(websiteInput.value).toBe("www.sitio.com");
  });
});
