import api from "./axiosConfig";

const baseURL = `${process.env.REACT_APP_API_URL}/business`;

export interface BusinessProfile {
  business_id: string;
  categories: number[];
  city: number | null;
  primary_currency: number;
  secondary_currency?: number | null;
  exchange_rate: string;
  // management_methods?: any;
  // display_methods?: any;
}

// POST: Crear un BusinessProfile
export async function createBusinessProfile(
  data: BusinessProfile
): Promise<BusinessProfile> {
  const response = await api.post(`${baseURL}/business_profile/`, data);
  return response.data;
}

// GET: Obtener un BusinessProfile por ID
export async function getBusinessProfile(
  id: number | string
): Promise<BusinessProfile> {
  const response = await api.get(`${baseURL}/business_profile/${id}/`);
  return response.data;
}

// PUT: Actualizar un BusinessProfile (sustituye todos los campos)
export async function updateBusinessProfile(
  id: number | string,
  data: BusinessProfile
): Promise<BusinessProfile> {
  const response = await api.put(`${baseURL}/business_profile/${id}/`, data);
  return response.data;
}

// PATCH: Actualizar parcialmente un BusinessProfile
export async function patchBusinessProfile(
  id: number | string,
  data: Partial<BusinessProfile>
): Promise<BusinessProfile> {
  const response = await api.patch(`${baseURL}/business_profile/${id}/`, data);
  return response.data;
}

export const validateBusinessName = async (business_id: string) => {
  try {
    const response = await api.get(`${baseURL}/validate-name/`, {
      params: { business_id },
    });
    return response.data; // { is_taken: true/false }
  } catch (error) {
    console.error("Error al intentar validar id de negocio", error);
    throw error;
  }
};
