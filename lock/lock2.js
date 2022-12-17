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
        // deleta a conexão anterior
        delete ws;
        ws = new WebSocket('ws://localhost:3000');
        start(ws);
    } catch (e) {
        // espera 10 segundos e tenta novamente
        console.log("Erro ao conectar. Tentando novamente em 10 segundos...");
        setTimeout(tryConnection, 10000); // wait 10 seconds before trying again
    }
}



function start() {
    try {
        
        });


       
    } catch (e) {
        console.log("Erro na conexão com o servidor. Tentando novamente em 10 segundos...");
        setTimeout(tryConnection, 10000);
    }

}
tryConnection();



