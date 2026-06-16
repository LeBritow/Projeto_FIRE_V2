const express = require("express");
const router = express.Router();
const Historico_agregado = require('../modelos/Historico_agregado');


router.get('/historico', async (req, res) => {
    try {
        const { localidade, ano } = req.query;

        if (!localidade || !ano) {
            return res.status(400).json({ mensagem: "Os parâmetros 'localidade' e 'ano' são obrigatórios." });
        }

        const dados = await Historico_agregado.buscarPorLocalidadeEAno(localidade, parseInt(ano, 10));
        
        res.json(dados);

    } catch (error) {
        console.error("Erro na rota /historico:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

router.get('/historico-anual', async (req, res) => {
    try {
        const { localidade } = req.query;

        if (!localidade) {
            return res.status(400).json({ mensagem: "O parâmetro 'localidade' é obrigatório." });
        }

        const dados = await Historico_agregado.buscarTotalAnualPorLocalidade(localidade.toUpperCase());
        res.json(dados);

    } catch (error) {
        console.error("Erro na rota /historico-anual:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

module.exports = router;