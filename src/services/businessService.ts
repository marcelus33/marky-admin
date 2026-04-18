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
  data: BusinessProfile,
): Promise<BusinessProfile> {
  const response = await api.post(`${baseURL}/business_profile/`, data);
  return response.data;
}

// GET: Obtener un BusinessProfile por ID
export async function getBusinessProfile(
  id: number | string,
): Promise<BusinessProfile> {
  const response = await api.get(`${baseURL}/business_profile/${id}/`);
  return response.data;
}

// PUT: Actualizar un BusinessProfile (sustituye todos los campos)
export async function updateBusinessProfile(
  id: number | string,
  data: BusinessProfile,
): Promise<BusinessProfile> {
  const response = await api.put(`${baseURL}/business_profile/${id}/`, data);
  return response.data;
}

// PATCH: Actualizar parcialmente un BusinessProfile
export async function patchBusinessProfile(
  id: number | string,
  data: Partial<BusinessProfile>,
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

// Interface for social media links
export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  website?: string;
}

// POST/PUT: Update social media links in bulk
export async function updateSocialMediaLinks(
  data: SocialMediaLinks,
): Promise<SocialMediaLinks> {
  const response = await api.post(
    `${baseURL}/social-media-links/bulk-update/`,
    data,
  );
  return response.data;
}

// Interface for social link
export interface SocialLink {
  id: number;
  platform: "facebook" | "instagram" | "whatsapp" | "website";
  platform_display: string;
  url: string;
}

// Interface for category
export interface Category {
  id: number;
  name: string;
}

// Interface for home page data
export interface HomePageData {
  business_name: string;
  social_links: SocialLink[];
  description: string | null;
  categories: Category[];
  profile_image: string;
  headquarter_attributes: { id: number; name: string }[] | null;
}

// GET: Fetch home page data
export async function getHomePageData(): Promise<HomePageData> {
  const response = await api.get(`${baseURL}/home-page/`);
  return response.data;
}

// Interface for business account info categories (re-uses Category shape)
export interface BusinessCategory {
  id: number;
  name: string;
}

// Interface for the account info endpoint response
export interface BusinessAccountInfo {
  business_name: string;
  email: string;
  phone_number: string;
  business_id: string;
  business_type: string;
  exchange_rate: string;
  city_id: number | null;
  city_name: string | null;
  country_id: number | null;
  country_name: string | null;
  primary_currency_id: number | null;
  primary_currency_name: string | null;
  primary_currency_code: string | null;
  secondary_currency_id: number | null;
  secondary_currency_name: string | null;
  secondary_currency_code: string | null;
  categories: BusinessCategory[];
}

// GET: Fetch business account info
export async function getBusinessAccountInfo(): Promise<BusinessAccountInfo> {
  const response = await api.get(`${baseURL}/account-info/`);
  return response.data;
}

// Interface for business data to be updated
export interface BusinessData {
  business_name?: string;
  description?: string;
  profile_image?: string;
  headquarter_attributes?: number[];
}

// PATCH: Update business data
export const updateBusiness = async (
  data: Partial<BusinessData>,
): Promise<BusinessData> => {
  const response = await api.patch(`${baseURL}/update/`, data);
  return response.data;
};

export const updateProfileImage = async (
  image: FormData,
): Promise<{ profile_image: string }> => {
  const response = await api.patch(`${baseURL}/profile-image/`, image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
