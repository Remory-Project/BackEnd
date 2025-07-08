import cors from "@fastify/cors";
import fastify from "fastify";
import { routes } from './http/routes';

export const app = fastify();

app.register(cors, {
    origin: true 
});

app.register(routes);
