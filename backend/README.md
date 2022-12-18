# T2-WebDev

## Instruções para rodar
Para a execução do código acima, recomendo primeiramente utilizar o comando abaixo para instalar todas as dependências necessárias.

```bash
npm init
```

Além disso, é possível utilizar o script abaixo para rodar o servidor com o nodemon.
```bash
npm start
```

---

## Rotas

No momento estou utilizando o Insomnia para testes nas seguintes rotas
- http://localhost:3000/users/register              -> Para registrar usuários
- http://localhost:3000/users/login                 -> Para logar
- http://localhost:3000/locks/create                -> Para criar fechaduras
- http://localhost:3000/usersLocks/updateLock       -> Para reservar um horário da Lock

---
## Diagrama
![diagrama](https://github.com/romuloschiavon/T2-WebDev/blob/master/backend/Diagrama.jpg?raw=true)

---

## Progresso Backend
- [x] Rota de criar usuários
- [x] Rota de autenticar usuários (COM JWT)
- [x] Rota que adiciona fechaduras
- [x] Rota que relaciona fechadura ao usuário por meio do tempo
- [x] Middleware para verificar token JWT
- [x] Rota de abrir/fechar fechaduras websocket
- [ ] Rota que remove usuários
- [ ] Rota que remove fechaduras e todas as suas referencias
- [x] Rota que remove relação usuario fechadura dependendo do tempo

## Progresso Frontend
- [ ] ??????
- [ ] ??????
- [ ] ??????
- [ ] ??????
- [ ] ??????
- [ ] ??????
