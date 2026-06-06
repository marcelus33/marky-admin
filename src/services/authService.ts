// src/services/authService.ts

import { useSessionStore } from "../stores/sessionStore";
import api from "./axiosConfig";

const baseURL = `${process.env.REACT_APP_API_URL}/users`;

interface LoginPayload {
  username?: string;
  password: string;
  // ... si tu login usa "username" o "email"
}

interface LoginResponse {
  access: string;
  refresh?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    has_configuration: boolean;
  };
}

interface RegisterPayload {
  email: string;
  password: string;
  business_name: string;
  phone_number: string;
}

interface RegisterResponse {
  message: string;
  verification_link: string;
  user?: {
    id: number;
    username: string;
    email: string;
    has_configuration: boolean;
  };
}

interface VerifyEmailPayload {
  token: string;
  verification_code: string;
}

interface VerifyEmailResponse {
  message?: string;
  error?: string;
}

interface ResendVerificationPayload {
  email: string;
}

interface ResendVerificationResponse {
  message: string;
}

interface SendPasswordRecoveryPayload {
  email: string;
}

interface SendPasswordRecoveryRespopnse {
  email: string;
  message: string;
}

interface ChangePasswordPayload {
  uid: string;
  token: string;
  new_password: string;
}

interface ChangePasswordRespponse {
  message: string;
}

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>(`${baseURL}/login/`, payload);

  // Destructuramos lo que la API devuelva:
  const { access, refresh, user } = response.data;

  // Guardo en la store de Zustand
  const { setSession } = useSessionStore.getState();
  setSession({
    accessToken: access,
    refreshToken: refresh || "", // si no hay refresh, pasas un string vacío
    user: user || null,
  });

  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<RegisterResponse>(
    `${baseURL}/register/`,
    payload
  );
  //
  const { user } = response.data;
  const { setSession } = useSessionStore.getState();
  setSession({
    accessToken: "",
    refreshToken: "",
    user: user || null,
  });

  return response.data;
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const response = await api.post<VerifyEmailResponse>(
    `${baseURL}/verify-email/`,
    payload
  );
  // Podría retornar { message: "Correo verificado con éxito." } o { error: "..."}
  return response.data;
}

export async function resendVerification(payload: ResendVerificationPayload) {
  const response = await api.post<ResendVerificationResponse>(
    `${baseURL}/resend-verification/`,
    payload
  );
  return response.data;
}

export async function sendPasswordRecovery(
  payload: SendPasswordRecoveryPayload
) {
  const response = await api.post<SendPasswordRecoveryRespopnse>(
    `${baseURL}/password-recovery/`,
    payload
  );
  return response.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await api.post<ChangePasswordRespponse>(
    `${baseURL}/password-change/`,
    payload
  );
  return response.data;
}
