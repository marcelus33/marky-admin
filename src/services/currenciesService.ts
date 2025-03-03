import api from "./axiosConfig";

export interface Currency {
  id: string;
  name: string;
  code: string;
}

const baseURL = `${process.env.REACT_APP_API_URL}/business`;

export async function getCurrencies(params: any) {
  const response = await api.get(`${baseURL}/currencies/`, { params: params });
  return response.data;
}
