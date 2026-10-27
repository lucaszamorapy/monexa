import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UsersController } from "../../controllers/users/index.js";
import { AuthRefreshTokenSchemaResponse, AuthVerifyCodeVerificationSchema, AuthVerifyCodeVerificationSchemaResponse, LoginSchema, UserCreateSchemaResponse, UserSendEmailCodeVerificationSchema, UserUpdatePasswordSchema, UserUpdateSchema, UserUpdateSchemaResponse } from "../../schemas/users/index.js";
import { ErrorSchema } from "../../schemas/errors/index.js";
import { MessageSchemaResponse } from "../../schemas/global/index.js";

export const usersRoutes = async (app: FastifyInstance) => {
  const usersControllers = new UsersController(app)
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      operationId: "createUser",
      tags: ["Usuário"],
      summary: "Criar conta de usuário",
      response: {
        201: UserCreateSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.post(request.body as Record<string, any>, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    onRequest: [app.authenticate],
    schema: {
      operationId: "putUser",
      tags: ["Usuário"],
      summary: "Alterar usuário no sistema",
      response: {
        200: UserUpdateSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      return await usersControllers.put(request.body as Record<string, any>, id, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    onRequest: [app.authenticate],
    schema: {
      operationId: "deleteUser",
      tags: ["Usuário"],
      summary: "Excluir usuário no sistema",
      response: {
        200: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.delete(request, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/login",
    schema: {
      operationId: "loginUser",
      tags: ["Usuário"],
      summary: "Logar usuário no sistema",
      body: LoginSchema,
      response: {
        200: UserCreateSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.postLogin(request.body, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/auth/refresh-token",
    schema: {
      operationId: "refreshTokenUser",
      tags: ["Usuário"],
      summary: "Atualizar o login do usuário",
      response: {
        200: AuthRefreshTokenSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.getRefreshToken(request, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/send-email-reset-password",
    schema: {
      operationId: "sendEmailResetPassword",
      tags: ["Usuário"],
      body: UserSendEmailCodeVerificationSchema,
      summary: "Enviar e-mail de redefinição de senha",
      response: {
        200: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.sendEmailResetPassword(request.body.email, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/verify-code-verification",
    schema: {
      operationId: "VerifyCodeVerification",
      tags: ["Usuário"],
      summary: "Validar coódigo de verificação do usuário por e-mail",
      body: AuthVerifyCodeVerificationSchema,
      response: {
        200: AuthVerifyCodeVerificationSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.verifyCodeVerification(request.body, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/auth/update-password",
    schema: {
      operationId: "updatePassword",
      tags: ["Usuário"],
      summary: "Atualizar senha do usuário",
      body: UserUpdatePasswordSchema,
      response: {
        200: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await usersControllers.updatePassword(request.body, reply)
    },
  });
}