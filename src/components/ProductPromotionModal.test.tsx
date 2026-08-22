import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import lightTheme from "../themes/light";
import ProductPromotionModal from "./ProductPromotionModal";
import { ProductGridItem } from "../types/product";
import { updateProduct } from "../services/productService";

// productService transitively imports axiosConfig -> axios, whose installed
// version ships ESM-only and breaks CRA's default Jest transform. Mock it
// out, same as ProductCard.test.tsx / CategoryGroup.test.tsx do.
jest.mock("../services/productService", () => ({
  updateProduct: jest.fn().mockResolvedValue({}),
}));

const renderModal = (
  props: Partial<React.ComponentProps<typeof ProductPromotionModal>> = {},
) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <ProductPromotionModal
          open
          onClose={() => {}}
          product={null}
          {...props}
        />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

const getSentFormData = (): FormData => {
  const mock = updateProduct as jest.Mock;
  expect(mock).toHaveBeenCalledTimes(1);
  return mock.mock.calls[0][1] as FormData;
};

describe("ProductPromotionModal disable payload", () => {
  it("sends explicit empty strings (not omitted/null) for multibuy_option and both dates when turning the promotion off", async () => {
    // Product already has an active promo with a countdown, so the modal
    // hydrates with "Activar promoción" ON — matches the real "disable an
    // existing promo" flow the ticket describes.
    const productWithPromo: ProductGridItem = {
      id: 7,
      name: "Pizza",
      price: "50000",
      discountPercent: 30,
      promotionStartsAt: "2026-08-15T10:00:00Z",
      promotionEndsAt: "2026-08-16T23:59:00Z",
    };

    renderModal({ product: productWithPromo });

    const promotionSwitch = await screen.findByRole("checkbox", {
      name: "Activar promoción",
    });
    await waitFor(() => expect(promotionSwitch).toBeChecked());

    // Turn the promotion off.
    fireEvent.click(promotionSwitch);
    expect(promotionSwitch).not.toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /Guardar cambios/ }));

    await waitFor(() => expect(updateProduct).toHaveBeenCalledTimes(1));
    const formData = getSentFormData();

    // "" survives objectToFormData's null/undefined-dropping (see
    // utils/formData.ts) — a real `null` here would be silently omitted and
    // the previous promo would survive server-side (the bug this fixes).
    expect(formData.get("multibuy_option")).toBe("");
    expect(formData.get("promotion_starts_at")).toBe("");
    expect(formData.get("promotion_ends_at")).toBe("");
    expect(formData.get("discount_percentage")).toBe("0");
  });
});

describe("ProductPromotionModal promotion type requirement", () => {
  it("defaults to Descuento as soon as the promotion switch is turned on", async () => {
    renderModal({ product: { id: 9, name: "Sushi", price: "20000" } });

    const promotionSwitch = await screen.findByRole("checkbox", {
      name: "Activar promoción",
    });
    fireEvent.click(promotionSwitch);

    const descuentoRadio = await screen.findByRole("radio", {
      name: "Descuento",
    });
    expect(descuentoRadio).toBeChecked();
  });

  it("keeps Guardar disabled until a discount percentage is entered, and enables it once one is", async () => {
    renderModal({ product: { id: 10, name: "Sushi", price: "20000" } });

    const promotionSwitch = await screen.findByRole("checkbox", {
      name: "Activar promoción",
    });
    fireEvent.click(promotionSwitch);

    const submitButton = screen.getByRole("button", {
      name: /Crear promoción/,
    });
    await waitFor(() => expect(submitButton).toBeDisabled());

    const percentageInput = screen.getByPlaceholderText(
      "Porcentaje de descuento (0-100)",
    );
    fireEvent.change(percentageInput, { target: { value: "20" } });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it("re-enables Guardar after turning the promotion switch back off without picking a type", async () => {
    // Regression: a stale "descuento" default (set when the switch was
    // turned on) must not keep discountPercentage's conditional-required
    // rule active once the switch is off again — that field is hidden and
    // the switch being off should lift every promo-type requirement.
    renderModal({ product: { id: 11, name: "Sushi", price: "20000" } });

    const promotionSwitch = await screen.findByRole("checkbox", {
      name: "Activar promoción",
    });
    fireEvent.click(promotionSwitch); // on: defaults to "descuento", no percentage entered yet
    fireEvent.click(promotionSwitch); // off, without ever fixing the missing percentage

    const submitButton = screen.getByRole("button", {
      name: /Crear promoción/,
    });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});

describe("ProductPromotionModal dirty-state gating on an existing promotion", () => {
  const productWithPromo: ProductGridItem = {
    id: 12,
    name: "Pizza",
    price: "50000",
    discountPercent: 30,
    promotionStartsAt: "2026-08-15T10:00:00Z",
    promotionEndsAt: "2026-08-16T23:59:00Z",
  };

  it("disables Guardar cambios immediately on open, and enables it once a real field changes", async () => {
    renderModal({ product: productWithPromo });

    const submitButton = await screen.findByRole("button", {
      name: /Guardar cambios/,
    });
    expect(submitButton).toBeDisabled();

    const countdownSwitch = screen.getByRole("checkbox", {
      name: "Activar cuenta regresiva",
    });
    fireEvent.click(countdownSwitch);

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it("stays disabled if the modal is closed and reopened without any edits", async () => {
    // Closing then reopening remounts the dialog's contents (MUI's Dialog
    // isn't keepMounted), which is the scenario this simulates directly
    // rather than toggling the `open` prop on one render tree.
    const { unmount } = renderModal({ product: productWithPromo });
    unmount();

    renderModal({ product: productWithPromo });

    const submitButton = await screen.findByRole("button", {
      name: /Guardar cambios/,
    });
    expect(submitButton).toBeDisabled();
  });

  it("hydrates a countdown-only promotion (no discount, no multibuy) without forcing a discount type", async () => {
    // Regression: a naive hydration mapping (multibuyOption ? "oferta" :
    // "descuento") would wrongly default this to "descuento" with an empty
    // percentage, making the form permanently invalid/disabled.
    const countdownOnlyProduct: ProductGridItem = {
      id: 13,
      name: "Sushi",
      price: "20000",
      promotionStartsAt: "2026-08-15T10:00:00Z",
      promotionEndsAt: "2026-08-16T23:59:00Z",
    };

    renderModal({ product: countdownOnlyProduct });

    const promotionSwitch = await screen.findByRole("checkbox", {
      name: "Activar promoción",
    });
    await waitFor(() => expect(promotionSwitch).toBeChecked());

    expect(
      screen.queryByRole("radio", { name: "Descuento" }),
    ).not.toBeChecked();
    expect(
      screen.queryByRole("radio", { name: "Oferta" }),
    ).not.toBeChecked();

    const countdownSwitch = screen.getByRole("checkbox", {
      name: "Activar cuenta regresiva",
    });
    expect(countdownSwitch).toBeChecked();

    const submitButton = screen.getByRole("button", {
      name: /Guardar cambios/,
    });
    expect(submitButton).toBeDisabled();
  });
});
