import api from "./axiosConfig";
import { PaginatedResponse } from "./types";

export interface ProductCategory {
  id: number;
  name: string;
  icon: string;
  discount_percentage: string;
  multibuy_option?: string;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
}

const baseURL = `${process.env.REACT_APP_API_URL}/products/product-categories`;

export const getProductCategories = async (
  params?: any
): Promise<PaginatedResponse<ProductCategory>> => {
  const response = await api.get(`${baseURL}/`, { params });
  return response.data;
};

export interface ProductCategoryPayload {
  name: string;
  icon: string;
}

export const createProductCategory = async (
  category: ProductCategoryPayload
): Promise<ProductCategory> => {
  const response = await api.post(`${baseURL}/`, category);
  return response.data;
};

export const updateProductCategory = async (
  id: number,
  category: ProductCategoryPayload
): Promise<ProductCategory> => {
  const response = await api.patch(`${baseURL}/${id}/`, category);
  return response.data;
};

export const deleteProductCategory = async (id: number): Promise<void> => {
  await api.delete(`${baseURL}/${id}/`);
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
  const response = await api.post(`${baseURL}/${id}/add_promotion/`, promotion);
  return response.data;
};

export const updateProductCategoryOrder = async (
  categories: { id: number; order: number }[]
): Promise<void> => {
  await api.post(`${baseURL}/update_order/`, { categories });
};
