import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ErrorSchema } from "../../schemas/errors/index.js";
import { TranscationsController } from "../../controllers/transactions/index.js";
import { TransactionSchemaCreate, TransactionSchemaUpdate } from "../../schemas/transactions/index.js";
import { MessageSchemaResponse } from "../../schemas/global/index.js";
import { IUpdateTransactionInputDto } from "../../dto/transactions/index.js";

export const transactionsRoutes = async (app: FastifyInstance) => {
  const transactionsControllers = new TranscationsController(app)
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    onRequest: [app.authenticate],
    schema: {
      operationId: "createTransaction",
      tags: ["Transação"],
      summary: "Criar transação",
      body: TransactionSchemaCreate,
      response: {
        201: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await transactionsControllers.post(request, reply)
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    onRequest: [app.authenticate],
    schema: {
      operationId: "updateTransaction",
      tags: ["Transação"],
      summary: "Editar transação",
      body: TransactionSchemaUpdate,
      response: {
        201: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await transactionsControllers.put(request, reply)
    },
  });
}