import { FastifyInstance } from "fastify";
import { createCuidador } from "./create-cuidador";
import { criarPaciente } from "./create-paciente";
import { criarRelatorio } from "./create-relatorio";
import { deleteCuidador } from "./delete-cuidador";
import { deletePaciente } from "./delete-paciente";
import { deleteRelatorio } from "./delete-relatorio";
import { editPaciente } from "./edit-paciente";
import { listPaciente } from "./list-paciente";
import { loginCuidador } from "./login-cuidador";


export async function routes(app: FastifyInstance) {
    app.post("/criar/cuidador", createCuidador);

    app.post("/criar/paciente", criarPaciente);

    app.get("/lista", listPaciente);

    app.put("/edit-paciente/:id", editPaciente);

    app.post("/login", loginCuidador);

    app.delete("/delete-paciente/:id", deletePaciente);

    app.delete("/delete-relatorio/:id", deleteRelatorio)

    app.delete("/delete-cuidador/:id", deleteCuidador)

    app.post("/criar-relatorio", criarRelatorio)

}