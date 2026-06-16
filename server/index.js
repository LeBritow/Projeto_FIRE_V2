const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const conexao = require("./infraestrutura/conexao")
const Tabelas = require("./infraestrutura/Tabelas")

const rotaUsuario = require("./rotas/rotaUsuario")
const rotaAdmin = require("./rotas/rotaAdmin")
const rotaHistorico = require("./rotas/rotaHistorico")
const rotaHardware = require("./rotas/rotaHardware");

const { iniciarLeitorSerial } = require("./servicos/leitorSerialLoRa");

app.use("/",rotaUsuario)
app.use("/admin", rotaAdmin) 
app.use("/api",rotaHistorico)
app.use("/api/hardware", rotaHardware);

conexao.connect(connectionError => {

    if (connectionError) {
        console.error('Falha ao conectar ao banco de dados:', connectionError);
        return;
    }
    console.log('Conexão com o banco de dados bem-sucedida!');

    try {
        Tabelas.init(conexao);
        console.log('Tabelas inicializadas com sucesso.');

        iniciarLeitorSerial();

        server.listen(PORT, () => {
            console.log(`Servidor backend rodando na porta ${PORT}`);
        });
        
        server.on('error', (serverError) => {
            console.error('Erro no servidor HTTP:', serverError);
            if (serverError.code === 'EADDRINUSE') {
                console.error(`A porta ${PORT} já está em uso.`);
                process.exit(1);
            }
        });

    } catch (initError) {
        console.error('Erro ao inicializar tabelas:', initError);
    }
})