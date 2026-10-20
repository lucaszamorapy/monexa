"use server"

import { Request } from "@/app/utils/class/api";
import { IAuthResponse } from "@/app/utils/types/users";

export const createUser = async (body: FormData): Promise<IAuthResponse> => {
  const api = new Request("users", { body })
  const user = await api.post<IAuthResponse>();
  return user;
}

export const refreshApiToken = async (): Promise<IAuthResponse> => {
  // Sem `token` na options: o Bearer vem do getServerToken / withBearerToken
  const api = new Request("users/auth/refresh-token")
  const token = await api.get<IAuthResponse>();
  return token;
};
