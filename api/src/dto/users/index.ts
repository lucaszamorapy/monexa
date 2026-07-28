import { MultipartFile } from "@fastify/multipart";

export interface IRegisterUserInputDto {
  name: string;
  email: string;
  image: MultipartFile | null;
  password: string;
}

export interface IRegisterUserOutputDto {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginInputDto {
  email: string;
  password: string;
}

export interface IUpdateUserInputDto {
  userId: string;
  name: string;
  email: string;
  password: string | null;
}

export interface IUpdateUserOutputDto {
  name: string;
  email: string;
}

export interface IUpdateUserImageInputDto {
  userId: string;
  image: MultipartFile;
}

export interface IUpdateUserImageOutputDto {
  image: string;
}

export interface IUpdateUserFullInputDto {
  userId: string;
  name: string;
  email: string;
  password: string | null;
  image: MultipartFile | null;
}

export interface IUpdateUserFullOutputDto {
  name: string;
  email: string;
  message: string;
  image: string | null;
}

export interface IUser {
  userId: string;
  password: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRefreshTokenOutputDto {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
