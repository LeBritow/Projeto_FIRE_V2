const express = require('express');
const router = express.Router();
const conexao = require('../infraestrutura/conexao');

router.post('/uplink', async (req, res) => {
    console.log("Recebido uplink LoRaWAN:", JSON.stringify(req.body, null, 2));
    try {
        const payloadBase64 = req.body?.uplink_message?.frm_payload;
        if (!payloadBase64) {
            return res.status(400).json({ mensagem: "Payload 'frm_payload' não encontrado." });
        }
        res.status(200).json({ mensagem: "Uplink recebido." });
    } catch (error) {
        console.error("Erro ao processar uplink:", error);
        res.status(500).json({ mensagem: "Erro interno." });
    }
});

router.get('/leitura-atual', async (req, res) => {
    const sql = `SELECT * FROM leituras_sensores ORDER BY id DESC LIMIT 1`;

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar leitura:", erro);
            return res.status(500).json({ error: "Erro no banco de dados" });
        }

        if (resultados.length > 0) {
            res.json(resultados[0]);
        } else {
            res.json({});
        }
    });
});

router.get('/historico-recente', async (req, res) => {
    const sql = `SELECT * FROM (
        SELECT * FROM leituras_sensores ORDER BY id DESC LIMIT 20
    ) sub ORDER BY id ASC`;

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar histórico:", erro);
            return res.status(500).json({ error: "Erro no banco de dados" });
        }
        res.json(resultados);
    });
});

module.exports = router;