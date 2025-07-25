import cors from "@fastify/cors";
import fastify from "fastify";
import { routes } from './http/routes';

export const app = fastify();

app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(routes);
