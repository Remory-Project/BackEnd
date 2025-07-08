import { FastifyInstance } from "fastify";
import { createCuidador } from "./create-cuidador";
import { criarPaciente } from "./create-paciente";
import { deletePaciente } from "./delete-paciente";
import { listPaciente } from "./list-paciente";


export async function routes(app: FastifyInstance) {
    app.post("/criar/cuidador", createCuidador);
    app.post("/criar/paciente", criarPaciente);

    app.get("/lista", listPaciente);

    // app.put("/tasks/:id", updateTask);

    app.delete("/paciente/:id", deletePaciente);

}