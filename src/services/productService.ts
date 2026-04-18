import { CategoryWithProducts } from "../types/categoryWithProducts";
import { Product } from "../types/product";
import { objectToFormData } from "../utils/formData";
import api from "./axiosConfig";
import { PaginatedProductCategoriesResponse, PaginatedResponse } from "./types";
import { mapCategoryWithProducts } from "../mappers/productMapper";

export interface ProductCategory {
  id: number;
  name: string;
  icon: string;
  discount_percentage: string;
  multibuy_option?: string;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
  is_available: boolean;
}

const categoryBaseURL = `${process.env.REACT_APP_API_URL}/products/product-categories`;
const productBaseURL = `${process.env.REACT_APP_API_URL}/products/products`;

export const getProductCategories = async (
  params?: any,
): Promise<PaginatedResponse<ProductCategory>> => {
  const response = await api.get(`${categoryBaseURL}/`, { params });
  return response.data;
};

export const getProductCategoriesWithProducts = async (
  params?: any,
): Promise<PaginatedProductCategoriesResponse<CategoryWithProducts>> => {
  const response = await api.get(`${categoryBaseURL}/with_products/`, {
    params,
  });
  // Map products inside each category to frontend-friendly shape
  const data = response.data as PaginatedProductCategoriesResponse<any>;
  const mappedResults = Array.isArray(data.results)
    ? data.results.map((cat) => mapCategoryWithProducts(cat))
    : [];

  return {
    ...data,
    results: mappedResults,
  } as PaginatedProductCategoriesResponse<CategoryWithProducts>;
};

export interface ProductCategoryPayload {
  name?: string;
  icon?: string;
  is_available?: boolean;
}

export const createProductCategory = async (
  category: ProductCategoryPayload,
): Promise<ProductCategory> => {
  const response = await api.post(`${categoryBaseURL}/`, category);
  return response.data;
};

export const updateProductCategory = async (
  id: number,
  category: ProductCategoryPayload,
): Promise<ProductCategory> => {
  const response = await api.patch(`${categoryBaseURL}/${id}/`, category);
  return response.data;
};

export const updateProductCategoryAvailability = async (
  id: number,
  payload: { is_available: boolean },
): Promise<ProductCategory> => {
  const response = await api.patch(`${categoryBaseURL}/${id}/`, payload);
  return response.data;
};

export const deleteProductCategory = async (id: number): Promise<void> => {
  await api.delete(`${categoryBaseURL}/${id}/`);
};

export const addPromotionToProductCategory = async (
  id: number,
  promotion: {
    has_offer: boolean;
    discount_percentage: string;
    multibuy_option?: string;
    promotion_starts_at: string;
    promotion_ends_at: string;
  },
): Promise<ProductCategory> => {
  const response = await api.post(
    `${categoryBaseURL}/${id}/add_promotion/`,
    promotion,
  );
  return response.data;
};

export const updateProductCategoryOrder = async (
  categories: { id: number; order: number }[],
): Promise<void> => {
  await api.post(`${categoryBaseURL}/update_order/`, { categories });
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await api.post(`${productBaseURL}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  formData: FormData,
): Promise<Product> => {
  const response = await api.patch(`${productBaseURL}/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const mapProductToCamelCase = (productData: any): Product => {
  return {
    ...productData,
    is_active: productData.is_active,
    multibuyOption: productData.multibuy_option,
    discountPercentage: productData.discount_percentage,
    promotionStartDate: productData.promotion_starts_at,
    promotionEndDate: productData.promotion_ends_at,
    // map formatted price labels if backend provides them
    primaryPrice: productData.primary_price ?? productData.primaryPrice,
    secondaryPrice: productData.secondary_price ?? productData.secondaryPrice,
    primaryPriceWithDiscount:
      productData.primary_price_with_discount ??
      productData.primaryPriceWithDiscount,
    secondaryPriceWithDiscount:
      productData.secondary_price_with_discount ??
      productData.secondaryPriceWithDiscount,
    variants: Array.isArray(productData.variants)
      ? productData.variants.map((v: any) => ({
          ...v,
          primaryPrice: v.primary_price ?? v.primaryPrice,
          secondaryPrice: v.secondary_price ?? v.secondaryPrice,
        }))
      : [],
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`${productBaseURL}/${id}/`);
  return mapProductToCamelCase(response.data);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`${productBaseURL}/${id}/`);
};
