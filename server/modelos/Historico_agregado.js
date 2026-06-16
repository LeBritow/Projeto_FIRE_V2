const conexao = require("../infraestrutura/conexao");

class Historico_agregado {
    executarQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            conexao.query(sql, params, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    async buscarPorLocalidadeEAno(localidade, ano) {
        const sql = `SELECT * FROM historico_agregado WHERE localidade = ? AND ano = ?`;
        return this.executarQuery(sql, [localidade, ano]);
    }

    async inserirOuAtualizarEmMassa(registros) {
        if (!registros || registros.length === 0) {
            return { linhasAfetadas: 0 };
        }
        
        const sql = `
            INSERT INTO historico_agregado (localidade, ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, total)
            VALUES ?
            ON DUPLICATE KEY UPDATE
                janeiro = VALUES(janeiro), fevereiro = VALUES(fevereiro), marco = VALUES(marco),
                abril = VALUES(abril), maio = VALUES(maio), junho = VALUES(junho),
                julho = VALUES(julho), agosto = VALUES(agosto), setembro = VALUES(setembro),
                outubro = VALUES(outubro), novembro = VALUES(novembro), dezembro = VALUES(dezembro),
                total = VALUES(total);
        `;

        const valores = registros.map(r => [
            r.localidade, r.ano, r.janeiro, r.fevereiro, r.marco, r.abril, r.maio,
            r.junho, r.julho, r.agosto, r.setembro, r.outubro, r.novembro, r.dezembro, r.total
        ]);

        return this.executarQuery(sql, [valores]);
    }

    async buscarTotalAnualPorLocalidade(localidade) {
        const sql = `
            SELECT ano, total 
            FROM historico_agregado 
            WHERE localidade = ? 
            ORDER BY ano ASC;
        `;
        
        try {
            const resultados = await this.executarQuery(sql, [localidade]);
            return resultados;
        } catch (error) {
            console.error(`Erro ao buscar o total anual para ${localidade}:`, error);
            throw error;
        }
    }
}

module.exports = new Historico_agregado();