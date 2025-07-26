import { FastifyInstance } from "fastify";
import { requestPasswordReset } from "./auth/request-password-reset";
import { resetPassword } from "./auth/reset-password";
import { verifyResetCode } from "./auth/verify-reset-code";
import { createCuidador } from "./create-cuidador";
import { criarPaciente } from "./create-paciente";
import { criarRelatorio } from "./create-relatorio";
import { deleteCuidador } from "./delete-cuidador";
import { deletePaciente } from "./delete-paciente";
import { deleteRelatorio } from "./delete-relatorio";
import { editPaciente } from "./edit-paciente";
import { getPaciente } from "./get-paciente";
import { listPaciente } from "./list-paciente";
import { listRelatorios } from "./list-relatorio";
import { loginCuidador } from "./login-cuidador";


export async function routes(app: FastifyInstance) {
    app.post("/criar/cuidador", createCuidador);

    app.post("/criar/paciente", criarPaciente);

    app.get("/lista", listPaciente);

    app.put("/edit-paciente/:id", editPaciente);

    app.post("/login", loginCuidador);

    app.delete("/delete-paciente/:id", deletePaciente);

    app.delete("/delete-relatorio/:id", deleteRelatorio);

    app.delete("/delete-cuidador/:id", deleteCuidador);

    app.post("/criar-relatorio", criarRelatorio);

    app.get("/paciente/:id", getPaciente);

    app.get("/paciente/:id/relatorios", listRelatorios);

    app.post("/auth/forgot-password", requestPasswordReset);

    app.post("/auth/forgot-password/verify", verifyResetCode);
    
    app.post("/auth/forgot-password/reset", resetPassword);

}