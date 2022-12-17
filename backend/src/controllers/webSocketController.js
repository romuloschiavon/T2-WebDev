
const Lock = require('../models/Lock');
const lockController = require('./lockController');
const WebSocket = require('ws');

const bcrypt = require("bcryptjs"); // Import the bcrypt library


// [[ws, nome_sala]]
let activeWebSockets = [];

setInterval(() => {
    // iterate through the list of active websockets
    for (let i = 0; i < activeWebSockets.length; i++) {
        const ws = activeWebSockets[i][0];
        // check if the websocket is still open
        if (ws.readyState !== WebSocket.OPEN) {
            // if the websocket is closed, remove it from the list of active websockets
            console.log("removendo a sala " + activeWebSockets[i][1] + " da lista de salas ativas");
            activeWebSockets.splice(i, 1);
        }
    }
}, 10000); // run the check every 10000 milliseconds (10 seconds)

async function handleWSLogin(ws, data) {
    console.log("Login: " + data.id_sala + " " + data.senha_sala);

    // verifica se a sala existe
    const lock = await Lock.findOne({
        name: data.id_sala
    });
    // console.log("lock: " + lock);
    if (lock) {
        // verifica se a senha está correta
        // console.log("lock.password: " + lock.password);
        // console.log("data.senha_sala: " + data.senha_sala);
        const checkPass = await bcrypt.compare(data.senha_sala, lock.password);
        if (checkPass) {
            // verifique se já não tem uma conexão ativa para a sala
            let achou = false;
            for (let i = 0; i < activeWebSockets.length; i++) {
                if (activeWebSockets[i][1] === data.id_sala) {
                    achou = true;
                    break;
                }
            }
            if (!achou) {
                // se não tiver, adiciona a sala à lista de salas ativas
                // se a senha está correta, retorna o sucesso
                ws.send(JSON.stringify({
                    type: 'login',
                    data: {
                        autorizado: true
                    }
                }));
                activeWebSockets.push([ws, data.id_sala]);
                return;
            }
        }
    }
    // se a senha está errada, retorna o erro
    ws.send(JSON.stringify({
        type: 'login',
        data: {
            autorizado: false
        }
    }));

}

module.exports = { handleWSLogin };