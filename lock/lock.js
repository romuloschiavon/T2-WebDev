// node lock.js id_sala senha_sala


const WebSocket = require('ws');

if (process.argv.length != 4) {
    console.log("PARAMETROS INCORRETOS");
    console.log("node lock.js id_sala senha_sala");
    process.exit(1);
}
let id_sala = process.argv[2];
let senha_sala = process.argv[3];
let is_open = false;
console.log("room " + id_sala + " with password " + senha_sala);

// Cria uma nova conexão websocket com o servidor


let ws = {}
function tryConnection() {
    try {
        ws = new WebSocket('ws://localhost:8080');
        start(ws);
    } catch (e) {
        // espera 10 segundos e tenta novamente
        console.log("Erro ao conectar. Tentando novamente em 10 segundos...");
        setTimeout(tryConnection, 10000); // wait 10 seconds before trying again
    }
}

function start() {
    ws.on('open', () => {
        // Quando a conexão é estabelecida, envia os parâmetros id_sala e senha_sala para o servidor
        ws.send(JSON.stringify({ type: 'login', data: { id_sala: id_sala, senha_sala: senha_sala } }));
    });

    ws.on('message', (message) => {
        // Quando recebe uma mensagem do servidor, verifica se foi autorizado ou não
        const rsp = JSON.parse(message);
        if (rsp.type == 'login') {
            const data = rsp.data;
            if (data.autorizado) {
                console.log('Login realizado com sucesso!');
                // Aguarda novas mensagens para abrir ou fechar a fechadura
                ws.on('message', (message) => {
                    const data = JSON.parse(message);
                    if (data.acao === 'abrir') {
                        console.log('Abrindo a fechadura...');
                    } else if (data.acao === 'fechar') {
                        console.log('Fechando a fechadura...');
                    }
                });
            } else {
                console.log('Falha no login. Verifique o id da sala e a senha.');
                // Fecha a conexão
                ws.close();
                process.exit(1);
            }
        }
        if (rsp.type == 'open') {
            console.log('Abrindo a fechadura...');
        }
        if (rsp.type == 'close') {
            console.log('Fechando a fechadura...');
        }

    });
    ws.on('error', (error) => {
        console.log('Erro na conexão com o servidor. Tentando novamente em 10 segundos...');
        setTimeout(tryConnection, 10000);
    });

}
tryConnection();



