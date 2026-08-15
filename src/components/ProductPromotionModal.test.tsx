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
