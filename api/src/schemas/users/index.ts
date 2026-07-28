import z from "zod"

export const UserCreateSchemaCreate = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string()
})

export const UserCreateSchemaResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  name: z.string(),
  userId: z.string(),
  email: z.email(),
  image: z.string().nullable(),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string()
});

export const UserUpdateSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string().nullable(),
});

export const UserUpdateSchemaResponse = z.object({
  name: z.string(),
  email: z.email(),
  message: z.string(),
  image: z.string().nullable(),
});

export const AuthRefreshTokenSchemaResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  name: z.string(),
  userId: z.string(),
  email: z.email(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const UserResetPasswordSchema = z.object({
  email: z.email(),
});

