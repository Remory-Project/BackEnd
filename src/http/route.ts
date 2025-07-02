import { FastifyInstance } from "fastify";
import { createTask } from "./create-task";


export async function routes(app: FastifyInstance) {
    app.post("/tasks", createTask);
}