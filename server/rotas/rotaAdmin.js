const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const SincronizacaoService = require('../infraestrutura/SincronizacaoService');
const verificarToken = require('../infraestrutura/verificacaoJWT');
const verificarAdmin = require('../middlewares/verificarAdmin');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

router.post('/upload-csv', [verificarToken, verificarAdmin], upload.single('arquivo_csv'), async (req, res) => {
    
    const tipoDeDado = req.body.tipoDeDado;
    const arquivo = req.file;

    if (!arquivo) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo foi enviado.' });
    }
    if (!tipoDeDado) {
        fs.unlinkSync(arquivo.path);
        return res.status(400).json({ mensagem: 'O tipo de dado para o arquivo não foi especificado.' });
    }

    try {
        console.log(`Recebido arquivo '${arquivo.originalname}' para o tipo '${tipoDeDado}'.`);
        
        const resultado = await SincronizacaoService.processarHistoricoAgregado(arquivo.path, tipoDeDado);

        res.json({
            mensagem: `Arquivo '${arquivo.originalname}' processado com sucesso!`,
            dados: resultado
        });

    } catch (error) {
        console.error("Erro ao processar o arquivo CSV na rota:", error);
        res.status(500).json({ mensagem: 'Falha ao processar o arquivo.', erro: error.message });
    } finally {
        if (arquivo && fs.existsSync(arquivo.path)) {
            fs.unlinkSync(arquivo.path);
            console.log(`Arquivo temporário deletado: ${arquivo.path}`);
        }
    }
});

module.exports = router;