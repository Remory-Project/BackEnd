import { FastifyInstance } from "fastify";
import { createPaciente } from "./create-paciente";
import { createTask } from "./create-task";
import { deleteTask } from "./delete-task";
import { listTasks } from "./list-tasks";
import { updateTask } from "./update-task";


export async function routes(app: FastifyInstance) {
    app.post("/tasks", createTask);

    app.get("/tasks", listTasks);

    app.put("/tasks/:id", updateTask);

    app.delete("/tasks/:id", deleteTask);

    app.post("/pacientes", createPaciente);
}