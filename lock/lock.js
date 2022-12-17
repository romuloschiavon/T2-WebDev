const ReconnectingWebSocket = require('reconnecting-websocket');
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
const options = {
    WebSocket: WebSocket, // custom WebSocket constructor
    connectionTimeout: 1000,
    maxRetries: 10
};
const rws = new ReconnectingWebSocket('ws://localhost:3000', [], options);

function handleLogin(data) {
    if (data.autorizado) {
        console.log('Login realizado com sucesso!');
    } else {
        console.log('Falha no login. Verifique o id da sala e a senha.');
        // Fecha a conexão
        rws.close();
        process.exit(1);
    }
}

rws.addEventListener('open', () => {
    console.log("Conectado ao servidor");
    // Quando a conexão é estabelecida, envia os parâmetros id_sala e senha_sala para o servidor
    rws.send(JSON.stringify({ type: 'login', data: { id_sala: id_sala, senha_sala: senha_sala } }));

   
});

rws.addEventListener('message', (message) => {
    // Quando recebe uma mensagem do servidor, verifica se foi autorizado ou não
    //console.log(message);
    const rsp = JSON.parse(message.data);
    console.log('Mensagem recebida do servidor: ' + rsp);
    if (rsp.type == 'login') {
        const data = rsp.data;
        handleLogin(data);
    }

    if (rsp.type == 'open') {
        console.log('Abrindo a fechadura...');
        is_open = true;
    }
    if (rsp.type == 'close') {
        console.log('Fechando a fechadura...');
        is_open = false;
    }
    if(rsp.type == 'status'){
        console.log('Status da fechadura: ' + is_open);
        rws.send(JSON.stringify({ type: 'status', data: { status: is_open } }));
    }

});

rws.addEventListener('error', (error) => {
    console.log('Erro na conexão com o servidor. Tentando novamente em 10 segundos...');
    
});
rws.addEventListener('close', () => {
    console.log('Conexão fechada. Tentando novamente em 10 segundos...');
    
});
