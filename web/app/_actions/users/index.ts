"use server"

import { Request } from "@/app/utils/class/api";
import { IAuthResponse } from "@/app/utils/types/users";

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
