export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IVerifyCodeVerificationBody {
  email: string;
  code: number;
}

export interface IUpdatePasswordBody {
  email: string;
  password: string;
}
