import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import lightTheme from "../themes/light";
import CategoryGroup from "./CategoryGroup";
import { CategoryWithProducts } from "../types/categoryWithProducts";

// productService transitively imports axiosConfig -> axios, whose installed
// version ships ESM-only and breaks CRA's default Jest transform. Mock it out,
// same as Login.test.tsx does for authService.
jest.mock("../services/productService", () => ({
  getProductCategories: jest.fn(),
  getProductCategoriesWithProducts: jest.fn(),
  createProductCategory: jest.fn(),
  updateProductCategory: jest.fn(),
  updateProductCategoryAvailability: jest.fn(),
  deleteProductCategory: jest.fn(),
  addPromotionToProductCategory: jest.fn(),
  updateProductCategoryOrder: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  getProductById: jest.fn(),
  deleteProduct: jest.fn(),
}));

const category: CategoryWithProducts = {
  id: 1,
  name: "Galletas",
  icon: "cookie",
  multibuy_option: null,
  discount_percentage: "0",
  promotion_starts_at: null,
  promotion_ends_at: null,
  is_available: true,
  products: [
    {
      id: 42,
      name: "Galleta de chocolate",
      price: "2.00",
    },
  ],
};

const renderCategoryGroup = (
  props: Partial<React.ComponentProps<typeof CategoryGroup>> = {},
) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <CategoryGroup category={category} {...props} />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("CategoryGroup promotion countdown badge", () => {
  it("shows the compact DD:HH:MM:SS countdown when promotion_status is active", () => {
    const activeCategory: CategoryWithProducts = {
      ...category,
      promotion_status: "active",
      promotion_starts_at: new Date(Date.now() - 3600000).toISOString(),
      promotion_ends_at: new Date(Date.now() + 25 * 3600000).toISOString(),
    };
    renderCategoryGroup({ category: activeCategory });

    expect(
      screen.getByText(/^\d{2}:\d{2}:\d{2}:\d{2}$/),
    ).toBeInTheDocument();
  });

  it("shows the 'Inicia en' indicator when promotion_status is scheduled", () => {
    // A scheduled promotion (now < promotion_starts_at) shows the "Inicia en"
    // indicator rather than the live countdown.
    const scheduledCategory: CategoryWithProducts = {
      ...category,
      promotion_status: "scheduled",
      promotion_starts_at: new Date(Date.now() + 2 * 3600000).toISOString(),
      promotion_ends_at: new Date(Date.now() + 26 * 3600000).toISOString(),
    };
    renderCategoryGroup({ category: scheduledCategory });

    expect(screen.getByText(/Inicia en/)).toBeInTheDocument();
  });

  it("shows no badge when promotion_status is expired, even with dates present", () => {
    const expiredCategory: CategoryWithProducts = {
      ...category,
      promotion_status: "expired",
      promotion_starts_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      promotion_ends_at: new Date(Date.now() - 86400000).toISOString(),
    };
    renderCategoryGroup({ category: expiredCategory });

    expect(screen.queryByText(/Empieza en|Finaliza en/)).not.toBeInTheDocument();
  });
});

describe("CategoryGroup product delete propagation", () => {
  it("calls onProductDeleteClick with the product when 'Eliminar' is clicked in the product card menu", () => {
    const onProductDeleteClick = jest.fn();
    renderCategoryGroup({ onProductDeleteClick });

    // buttons[0] is the category header's own "..." menu trigger;
    // buttons[1] is the product card's "..." menu trigger.
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    fireEvent.click(screen.getByText("Eliminar"));

    expect(onProductDeleteClick).toHaveBeenCalledTimes(1);
    expect(onProductDeleteClick).toHaveBeenCalledWith(category.products[0]);
  });

  it("still calls onDeleteCategory when 'Eliminar categoría' is clicked (regression check)", () => {
    const onDeleteCategory = jest.fn();
    renderCategoryGroup({ onDeleteCategory });

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(screen.getByText("Eliminar categoría"));

    expect(onDeleteCategory).toHaveBeenCalledTimes(1);
  });
});
