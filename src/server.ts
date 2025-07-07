// responsável por iniciar o servidor HTTP

import { app } from './app';
import { env } from './env';


app.listen({
    host: '0.0.0.0',
    port: env.PORT,
}).then(() => {
    console.log(`Server HTTP está rodando em http://localhost:${env.PORT}`)
});


// npx tsx watch src/server.ts comando pra rodar o servidor no terminal