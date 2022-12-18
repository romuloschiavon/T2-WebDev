const Lock = require("../models/Lock");
const lockController = require("./lockController");
const WebSocket = require("ws");

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
            console.log(
                "removendo a sala " +
                activeWebSockets[i][1] +
                " da lista de salas ativas"
            );
            activeWebSockets.splice(i, 1);
        } else {
            // pede o status da porta e atualiza no banco de dados
            ws.send(
                JSON.stringify({
                    type: "status",
                    data: {},
                })
            );
        }
    }
}, 10000); // run the check every 10000 milliseconds (10 seconds)




module.exports = {
    async removeLockFromActiveList(lockName) {
        // fecha a conexão websockt e remove da lista de salas ativas
        for (let i = 0; i < activeWebSockets.length; i++) {
            if (activeWebSockets[i][1] == lockName) {
                console.log("removendo a sala " + lockName + " da lista de salas ativas");
                activeWebSockets[i][0].close();
                activeWebSockets.splice(i, 1);
                return;
            }
        }
        return
    },
    async updateActiveLockName(oldLockName, newLockName) {
        for (let i = 0; i < activeWebSockets.length; i++) {
            if (activeWebSockets[i][1] == oldLockName) {
                console.log("Atualizando o nome da sala " + oldLockName + " para " + newLockName);
                activeWebSockets[i][1] = newLockName;
                return;
            }
        }
        return;
    },

    async handleAskLockTo(req, res) {
        const status = req.status;
        const id_sala = req.lockName;

        if (status !== "open" && status !== "close") {
            return res.status(402).json({ message: "Bad Request" });
        }
        console.log(activeWebSockets.length);
        for (let i = 0; i < activeWebSockets.length; i++) {
            const ws = activeWebSockets[i][0];
            if (activeWebSockets[i][1] === id_sala) {
                ws.send(
                    JSON.stringify({
                        type: status,
                        data: {},
                    })
                );
                if (status === "open") {
                    return res.status(200).json({ message: "Lock opened!" });
                } else {
                    return res.status(200).json({ message: "Lock closed!" });
                }
            }
        }
        return res.status(404).json({ message: "Lock not found on active locks list!" });
    },

    async handleWSStatus(ws, data) {
        console.log("Status: " + data.id_sala + " " + data.status);

        // verifica se a sala existe
        const lock = await Lock.findOne({
            name: data.id_sala,
        });
        // console.log("lock: " + lock);
        if (lock) {
            // atualiza o status da porta no banco de dados
            lock.isLocked = data.status;
            lock.save();
        }
    },

    async handleWSLogin(ws, data) {
        console.log("Login: " + data.id_sala + " " + data.senha_sala);

        // verifica se a sala existe
        const lock = await Lock.findOne({
            name: data.id_sala,
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
                    ws.send(
                        JSON.stringify({
                            type: "login",
                            data: {
                                autorizado: true,
                            },
                        })
                    );
                    activeWebSockets.push([ws, data.id_sala]);
                    return;
                }
            }
        }
        // se a senha está errada, retorna o erro
        ws.send(
            JSON.stringify({
                type: "login",
                data: {
                    autorizado: false,
                },
            })
        );
    }
};
