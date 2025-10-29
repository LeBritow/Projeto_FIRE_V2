const bcrypt = require('bcrypt');

class Tabelas {
    init(conexao){
        this.conexao = conexao;
        this.criandoTabelaUsuario(() => {
            this.criaUsuarioPadrao();
        });
        this.criandoTabelaHistoricoAgregado()
        this.criandoTabelaLeitura_Sensores()

    }
    criandoTabelaUsuario(callback){
        const sql = `CREATE TABLE if not exists Usuario(idUsuario int auto_increment, nome varchar(255),email varchar(255), senha varchar(255), cargo varchar(255), PRIMARY KEY(idUsuario))`
        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("A tabela usuario criada com sucesso");
                if (callback) {
                    callback();
                }
            }
        })
    }
    criaUsuarioPadrao() {
        const emailPadrao = 'root@root.com';
        const senhaPadrao = 'rootAdmin';
        const saltRounds = 10;
        
        // Primeiro, verifica se o usuário padrão já existe
        const sqlVerifica = `SELECT * FROM Usuario WHERE email = ?`;
        this.conexao.query(sqlVerifica, [emailPadrao], async (erro, resultados) => {
            if (erro) {
                console.error("Erro ao verificar usuário padrão:", erro);
                return;
            }

            if (resultados.length === 0) {
                // Se o usuário não existe, procede com a criação
                try {
                    const senhaHash = await bcrypt.hash(senhaPadrao, saltRounds);
                    const sqlInsere = `INSERT INTO Usuario (nome, email, senha, cargo) VALUES (?, ?, ?, ?)`;
                    const params = ['root', emailPadrao, senhaHash, 'admin'];

                    this.conexao.query(sqlInsere, params, erroInsercao => {
                        if (erroInsercao) {
                            console.error("Erro ao inserir usuário padrão:", erroInsercao);
                        } else {
                            console.log("Usuário 'root' criado com sucesso!");
                        }
                    });
                } catch (hashError) {
                    console.error("Erro ao gerar hash da senha do usuário padrão:", hashError);
                }
            } else {
                console.log("O usuário 'root' já existe, não é necessário criar.");
            }
        });
    }
    criandoTabelaHistoricoAgregado(){
        const sql = `
                CREATE TABLE if not exists historico_agregado (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    localidade VARCHAR(50) NOT NULL, 
                    ano INT NOT NULL,
                    janeiro INT DEFAULT 0,
                    fevereiro INT DEFAULT 0,
                    marco INT DEFAULT 0,
                    abril INT DEFAULT 0,
                    maio INT DEFAULT 0,
                    junho INT DEFAULT 0,
                    julho INT DEFAULT 0,
                    agosto INT DEFAULT 0,
                    setembro INT DEFAULT 0,
                    outubro INT DEFAULT 0,
                    novembro INT DEFAULT 0,
                    dezembro INT DEFAULT 0,
                    total INT DEFAULT 0,
                    UNIQUE KEY idx_localidade_ano (localidade, ano) 
                );`

        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("A tabela historico_agregado criada com sucesso");
                
            }
        })
    }
    criandoTabelaLeitura_Sensores(){
        // device -- Para identificar qual dispositivo enviou o dado
        const sql = `
            CREATE TABLE IF NOT EXISTS leituras_sensores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                device_id VARCHAR(255) NOT NULL, 
                temperatura DECIMAL(5, 2),
                pressao INT,
                umidade DECIMAL(5, 2),
                co2 INT,
                tvocs INT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `
        this.conexao.query(sql,erro=>{
            if(erro){
                console.log(erro);
                
            }else{
                console.log("A tabela leituras_sensores criada com sucesso");
                
            }
        })
    }
}

module.exports = new Tabelas;