import { FastifyInstance, FastifyRequest } from "fastify";
import { CustomError } from "../../errors/index.js";
import { FastifyReply } from "fastify"
import { UsersService } from "../../services/users/index.js";
import { UserCreateSchemaCreate, UserUpdateSchema } from "../../schemas/users/index.js";
import { MultipartFile } from "@fastify/multipart";
import { ILoginInputDto } from "../../dto/users/index.js";


const usersService = new UsersService();
export class UsersController {
  app: FastifyInstance
  constructor(app: FastifyInstance) {
    this.app = app
  }
  async post(body: Record<string, any>, reply: FastifyReply) {
    try {

      const fields = {
        name: body.name?.value,
        email: body.email?.value,
        password: body.password?.value,
      };

      const imageFile: MultipartFile | null = body.image ?? null;

      const bodyValidation = UserCreateSchemaCreate.safeParse(fields);
      if (!bodyValidation.success) {
        return reply.status(400).send({
          error: bodyValidation.error.flatten(),
          code: "BAD_REQUEST",
        });
      }

      const res = await usersService.register({
        ...bodyValidation.data,
        image: imageFile,
      });
      return reply.status(201).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async postLogin(body: ILoginInputDto, reply: FastifyReply) {
    try {
      const res = await usersService.login(body);
      return reply.status(201).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async put(body: Record<string, any>, id: string, reply: FastifyReply) {
    try {

      const fields = {
        userId: id,
        name: body.name?.value,
        email: body.email?.value,
        password: body.password?.value,
      };

      const imageFile: MultipartFile | null = body.image ?? null;

      const bodyValidation = UserUpdateSchema.safeParse(fields);
      if (!bodyValidation.success) {
        return reply.status(400).send({
          error: bodyValidation.error.message,
          code: "BAD_REQUEST",
        });
      }
      const res = await usersService.updateUserFull({
        ...bodyValidation.data,
        image: imageFile,
      });
      return reply.status(200).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const res = await usersService.deleteUser(id);
      return reply.status(200).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
  async getRefreshToken(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) return reply.code(401).send({ error: 'Token não fornecido', code: "UNAUTHORIZED" })
      const token = authorization.split(" ")[1];
      const res = await usersService.authRefreshToken(token)
      return reply.status(200).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async sendEmailResetPassword(email: string, reply: FastifyReply) {
    try {
      const res = await usersService.sendEmailResetPassword(email);
      return reply.status(200).send(res)
    } catch (error) {

      this.app.log.error(error);
      if (error instanceof CustomError) {
        return reply.status(error.number).send({
          error: error.message,
          code: error.code,
        });
      }
      if (error instanceof Error) {
        return reply.status(500).send({
          error: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}