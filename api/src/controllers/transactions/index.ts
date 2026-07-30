import { FastifyInstance, FastifyRequest } from "fastify";
import { CustomError } from "../../errors/index.js";
import { FastifyReply } from "fastify"
import { TransactionsService } from "../../services/transactions/index.js";
import { ICreateTransactionInputDto, IUpdateTransactionInputDto } from "../../dto/transactions/index.js";

const transactionService = new TransactionsService();

export class TranscationsController {
  app: FastifyInstance
  constructor(app: FastifyInstance) {
    this.app = app
  }
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) return reply.code(401).send({ error: 'Token não fornecido', code: "UNAUTHORIZED" })
      const token = authorization.split(" ")[1];
      const { dateInitial, dateFinal } = req.query as {
        dateInitial?: string;
        dateFinal?: string;
      };
      const res = await transactionService.getAllTransactions(token, dateInitial, dateFinal);
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
  async get(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const res = await transactionService.getTransactionById(id);
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
  async post(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authorization = req.headers.authorization;
      const body = req.body
      if (!authorization) return reply.code(401).send({ error: 'Token não fornecido', code: "UNAUTHORIZED" })
      const token = authorization.split(" ")[1];
      const res = await transactionService.createTransaction(body as ICreateTransactionInputDto, token);
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

  async put(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body
      const res = await transactionService.updateTransaction(body as IUpdateTransactionInputDto, id);
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
      const res = await transactionService.deleteTransaction(id);
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