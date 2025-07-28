import api from "./axiosConfig";

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributesApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Attribute[];
}

const baseURL = `${process.env.REACT_APP_API_URL}/business`;

export async function getAttributes(): Promise<AttributesApiResponse> {
  const response = await api.get(`${baseURL}/branch_attributes/`);
  return response.data;
}
