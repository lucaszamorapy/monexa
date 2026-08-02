import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ErrorSchema } from "../../schemas/errors/index.js";
import { TranscationsController } from "../../controllers/transactions/index.js";
import { TransactionSchemaCreate, TransactionSchemaGetAll, TransactionSchemaGetAllQuery, TransactionSchemaGetByIdResponse, TransactionSchemaUpdate } from "../../schemas/transactions/index.js";
import { MessageSchemaResponse } from "../../schemas/global/index.js";

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
    method: "GET",
    url: "/",
    onRequest: [app.authenticate],
    schema: {
      operationId: "getAllTransactions",
      tags: ["Transação"],
      summary: "Listar transações",
      querystring: TransactionSchemaGetAllQuery,
      response: {
        200: TransactionSchemaGetAll,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await transactionsControllers.getAll(request, reply)
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
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:id",
    onRequest: [app.authenticate],
    schema: {
      operationId: "getTranscationById",
      tags: ["Transação"],
      summary: "Buscar transação por ID",
      response: {
        200: TransactionSchemaGetByIdResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await transactionsControllers.get(request, reply)
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    onRequest: [app.authenticate],
    schema: {
      operationId: "deleteTransaction",
      tags: ["Transação"],
      summary: "Excluir transação no sistema",
      response: {
        200: MessageSchemaResponse,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      return await transactionsControllers.delete(request, reply)
    },
  });
}