"use server"

import { api } from "@/app/utils/functions"
import { IAuthResponse } from "@/app/utils/types/users";

export const createUser = async (body: FormData): Promise<IAuthResponse> => {
  const user = await api.post("users", body)
  return user as IAuthResponse;
}

export const refreshApiToken = async (): Promise<IAuthResponse> => {
  // Sem `token` na options: o Bearer vem do getServerToken / withBearerToken
  const token = await api.get<IAuthResponse>("users/auth/refresh-token");
  return token;
};
