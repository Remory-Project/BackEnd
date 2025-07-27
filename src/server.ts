import { app } from './app';
import { startMedicationReminderJob } from './jobs/medication-reminder';


startMedicationReminderJob();

app.listen({ port: 3333, host: '127.0.0.1' }, (err, address) => {
    if (err) {
        console.error("Erro ao iniciar o servidor:", err);
        process.exit(1);
    }

    console.log(`Servidor rodando em: ${address}`);
});