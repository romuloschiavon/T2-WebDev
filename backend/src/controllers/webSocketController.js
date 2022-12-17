
const lockModel = require('../models/Lock');
const lockController = require('./lockController');


const bcrypt = require("bcryptjs"); // Import the bcrypt library

async function handleWSLogin(ws, data) {
    console.log("Login: " + data.id_sala + " " + data.senha_sala);

    // verifica se a sala existe
    const lock = lockModel.findOne({
        name: data.id_sala
    });
    console.log(lock);
    if (lock) {
        // verifica se a senha está correta
        const passHash = await bcrypt.hash(data.senha_sala, 10);
        console.log(passHash);
        if (passHash === lock.password) {
            // se a senha está correta, retorna o sucesso
            ws.send(JSON.stringify({
                type: 'login',
                data: {
                    autorizado: true
                }
            }));
            return
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