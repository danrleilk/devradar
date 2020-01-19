const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');

const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack10@cluster0-a1m6i.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// Usar cors dessa maneira libera acesso do banco para o app na porta 3000
// app.use(cors({ origin: 'http://localhost:3000'}));

// Usar cors dessa maneira lbiera acesso do banco para todas origens.
app.use(cors());

app.use(express.json());
app.use(routes);

// MongoDB => Não relacional.

// Métodos HTTP: GET, POST, PUT, DELETE
// Tipos de parâmetros: 
// Query Params: request.query (filtros,ordenação, paginação,...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

server.listen(3333);