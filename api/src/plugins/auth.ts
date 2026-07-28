import fp from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

//adiciona uma função à instância do Fastify, então em qualquer lugar que você tivermos acesso ao app (instância do fastify), iremos ter acesso ao authenticate
export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Token não fornecido', code: "UNAUTHORIZED" })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
      request.user = decoded
    } catch (err) {
      return reply.code(401).send({ error: 'Token inválido ou expirado', code: "UNAUTHORIZED" })
    }
  })
})