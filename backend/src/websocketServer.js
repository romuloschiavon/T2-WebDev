
function handleWSLogin(ws, data) {
    console.log("Login: " + data.id_sala + " " + data.senha_sala);
    
    // envia msg de login para o cliente
    ws.send(JSON.stringify({
        type: 'login',
        autorizado: true
    }));
}