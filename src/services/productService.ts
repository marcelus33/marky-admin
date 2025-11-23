import { CategoryWithProducts } from "../types/categoryWithProducts";
import { Product } from "../types/product";
import { objectToFormData } from "../utils/formData";
import api from "./axiosConfig";
import { PaginatedProductCategoriesResponse, PaginatedResponse } from "./types";

export interface ProductCategory {
  id: number;
  name: string;
  icon: string;
  discount_percentage: string;
  multibuy_option?: string;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
}

const categoryBaseURL = `${process.env.REACT_APP_API_URL}/products/product-categories`;
const productBaseURL = `${process.env.REACT_APP_API_URL}/products/products`;

export const getProductCategories = async (
  params?: any
): Promise<PaginatedResponse<ProductCategory>> => {
  const response = await api.get(`${categoryBaseURL}/`, { params });
  return response.data;
};

export const getProductCategoriesWithProducts = async (
  params?: any
): Promise<PaginatedProductCategoriesResponse<CategoryWithProducts>> => {
  const response = await api.get(`${categoryBaseURL}/with_products/`, {
    params,
  });
  return response.data;
};

export interface ProductCategoryPayload {
  name: string;
  icon: string;
}

export const createProductCategory = async (
  category: ProductCategoryPayload
): Promise<ProductCategory> => {
  const response = await api.post(`${categoryBaseURL}/`, category);
  return response.data;
};

export const updateProductCategory = async (
  id: number,
  category: ProductCategoryPayload
): Promise<ProductCategory> => {
  const response = await api.patch(`${categoryBaseURL}/${id}/`, category);
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
  }
): Promise<ProductCategory> => {
  const response = await api.post(
    `${categoryBaseURL}/${id}/add_promotion/`,
    promotion
  );
  return response.data;
};

export const updateProductCategoryOrder = async (
  categories: { id: number; order: number }[]
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
  formData: FormData
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
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`${productBaseURL}/${id}/`);
  return mapProductToCamelCase(response.data);
};
