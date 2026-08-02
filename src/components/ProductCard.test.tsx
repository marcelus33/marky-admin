import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import lightTheme from "../themes/light";
import ProductCard from "./ProductCard";
import { ProductGridItem } from "../types/product";

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

const product: ProductGridItem = {
  id: 42,
  name: "Galleta de chocolate",
  price: "2.00",
};

const renderProductCard = (
  props: Partial<React.ComponentProps<typeof ProductCard>> = {},
) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <ProductCard product={product} {...props} />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("ProductCard 'Eliminar' menu action (Home page card)", () => {
  it("calls onDeleteClick with the product when 'Eliminar' is clicked", () => {
    const onDeleteClick = jest.fn();
    renderProductCard({ onDeleteClick });

    const [menuButton] = screen.getAllByRole("button");
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByText("Eliminar"));

    expect(onDeleteClick).toHaveBeenCalledTimes(1);
    expect(onDeleteClick).toHaveBeenCalledWith(product);
  });

  it("does not throw when 'Eliminar' is clicked and no onDeleteClick prop is given", () => {
    renderProductCard();

    const [menuButton] = screen.getAllByRole("button");
    fireEvent.click(menuButton);

    expect(() => fireEvent.click(screen.getByText("Eliminar"))).not.toThrow();
  });
});
