import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import cron from 'node-cron';
import { enviarLembreteMedicamento } from '../lib/email-service';

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

export function startMedicationReminderJob() {
    cron.schedule(
        '* * * * *',
        async () => {
            const now = dayjs().tz('America/Fortaleza');
            const hora = now.hour();
            const minuto = now.minute();

            try {
                const horarios = await prisma.horarioMedicamento.findMany({
                    where: {
                        hora,
                        minuto,
                    },
                    include: {
                        medicamento: {
                            include: {
                                paciente: {
                                    include: {
                                        cuidador: true,
                                    },
                                },
                            },
                        },
                    },
                });

                for (const h of horarios) {
                    const medicamento = h.medicamento;
                    const paciente = medicamento.paciente;
                    const cuidador = paciente.cuidador;

                    if (!cuidador?.email) continue;

                    await enviarLembreteMedicamento({
                        email: cuidador.email,
                        pacienteNome: paciente.nome,
                        medicamentoNome: medicamento.nome,
                        hora: h.hora,
                        minuto: h.minuto,
                    });

                    console.log(`[LEMBRETE ENVIADO] ${now.format('HH:mm')} → Cuidador: ${cuidador.email} | Paciente: ${paciente.nome} | Medicamento: ${medicamento.nome}`);
                }
            } catch (error) {
                console.error('[ERRO AO ENVIAR LEMBRETES]', error);
            }
        },
        {
            timezone: 'America/Fortaleza',
        }
    );

    console.log('Tarefa de lembretes de medicamentos agendada.');
}
