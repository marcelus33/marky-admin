import api from "./axiosConfig";

export interface Category {
  id: string;
  name: string;
}

const baseURL = `${process.env.REACT_APP_API_URL}/business`;

export async function getCategories(params: any) {
  const response = await api.get(`${baseURL}/categories/`, { params: params });
  return response.data;
}
