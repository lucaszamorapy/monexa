import Fastify from 'fastify'
import "dotenv/config";
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fs from "fs";
import path from "path";
import { usersRoutes } from './routes/users/index.js';
import { authPlugin } from './plugins/auth.js';

const app = Fastify({
  logger: true
})

app.setValidatorCompiler(validatorCompiler) //Valida entrada usando Zod
app.setSerializerCompiler(serializerCompiler) //Valida saída usando Zod

//Pluigins
//plugin do swagger para gerar a documentação da api, usando o jsonSchemaTransform para transformar os schemas do zod em json schema
await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Monexa API',
      description: 'API para o projeto Monexa',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8082',
        description: 'Servidor local',
      }
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifyApiReference, {
  routePrefix: "/docs",
  configuration: {
    sources: [
      {
        title: "Monexa API",
        slug: "monexa-api",
        url: "/swagger.json",
      },
    ],
  },
});

await app.register(fastifyCors, {
  origin: process.env.WEB_URL || "http://localhost:3000",
  credentials: true,
});

await app.register(fastifyMultipart, {
  attachFieldsToBody: true, //usado para aceitar MultipartFile no body da requisição
});

await app.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/", // URL pública: http://localhost:8022/uploads/...
});

await app.register(authPlugin)


//Routes
await app.register(usersRoutes, { prefix: "/users" });

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});


//Criar pastas necessárias para o upload de arquivos
const REQUIRED_DIRS = ["uploads/users"];
for (const dir of REQUIRED_DIRS) {
  const fullPath = path.join(process.cwd(), dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Pasta criada: ${dir}`);
}

try {
  await app.listen({ port: Number(process.env.PORT) })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}