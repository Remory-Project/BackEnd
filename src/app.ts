// será responsável por configurar o Fastify (rotas, plugins como CORS, autenticação, etc.

import fastify from "fastify";
import { routes } from './http/route';

export const app = fastify();

app.register(routes); // registra as rotas da aplicação-