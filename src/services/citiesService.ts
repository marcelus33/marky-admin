import api from "./axiosConfig";

export interface Country {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

const baseURL = `${process.env.REACT_APP_API_URL}/business`;

export async function getCountries(params: any) {
  const response = await api.get(`${baseURL}/countries/`, params);
  return response.data;
}

export async function getCities(params: any) {
  const response = await api.get(`${baseURL}/cities/`, { params: params });
  return response.data;
}
