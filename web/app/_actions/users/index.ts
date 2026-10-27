"use server"

import { Request } from "@/app/utils/class/api";
import { IAuthResponse, IVerifyCodeVerificationBody } from "@/app/utils/types/users";

export const createUser = async (body: FormData): Promise<IAuthResponse> => {
  const api = new Request("users", { body })
  const user = await api.post<IAuthResponse>();
  return user;
}

export const refreshApiToken = async (token: string): Promise<IAuthResponse> => {
  const api = new Request("users/auth/refresh-token", { token })
  const newToken = await api.get<IAuthResponse>();
  return newToken;
};

export const forgotPasswordEmail = async (email: string): Promise<{ message: string }> => {
  const api = new Request("users/auth/send-email-reset-password", { body: { email } })
  const res = await api.post<{ message: string }>();
  return res;
}

export const verifyCodeVerification = async (body: IVerifyCodeVerificationBody): Promise<{ valid: boolean }> => {
  const api = new Request("users/auth/verify-code-verification", { body })
  const res = await api.post<{ valid: boolean }>();
  return res;
}
