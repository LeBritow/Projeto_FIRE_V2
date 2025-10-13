const express = require('express');
const router = express.Router();
const SincronizacaoService = require('../infraestrutura/SincronizacaoService'); 
// Futuramente, você terá um modelo para as leituras, ex: const LeiturasModel = require('../modelos/Leituras');

// Esta é a rota que receberá os dados do Servidor de Rede LoRaWAN
router.post('/uplink', async (req, res) => {
    // A primeira e mais importante coisa a fazer é inspecionar o que você está recebendo.
    // O corpo (body) da requisição contém todos os dados do dispositivo.
    console.log("Recebido uplink LoRaWAN:", JSON.stringify(req.body, null, 2));

    try {
        // A estrutura do payload pode variar, mas no The Things Network (TTN v3) é comum ser assim:
        const payloadBase64 = req.body?.uplink_message?.frm_payload;

        if (!payloadBase64) {
            console.warn("Payload não encontrado no corpo da requisição.");
            return res.status(400).json({ mensagem: "Payload 'frm_payload' não encontrado." });
        }

        // Os dados LoRa vêm em bytes, codificados como uma string base64. Precisamos decodificá-los.
        const dadosDecodificados = decodePayload(payloadBase64);
        console.log("Dados decodificados:", dadosDecodificados);

        // TODO: Salvar os 'dadosDecodificados' no banco de dados.
        // Exemplo: await LeiturasModel.salvarLeitura(dadosDecodificados);

        // Responde ao servidor de rede que os dados foram recebidos com sucesso.
        res.status(200).json({ mensagem: "Uplink recebido e processado com sucesso." });

    } catch (error) {
        console.error("Erro ao processar o uplink LoRaWAN:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});


/**
 * Decodifica o payload de bytes recebido do LoRaWAN.
 * !!! IMPORTANTE: A estrutura de bytes PRECISA ser a mesma que seu colega definiu no firmware do Arduino !!!
 * Este é um EXEMPLO. Você DEVE confirmar a ordem e o tamanho de cada dado com ele.
 */
function decodePayload(payloadBase64) {
    // Converte a string base64 para um Buffer de bytes
    const buffer = Buffer.from(payloadBase64, 'base64');
    
    // Supondo a seguinte estrutura de bytes enviada pelo Arduino (EXEMPLO):
    // - Temperatura: 2 bytes, inteiro com sinal, Little Endian, valor * 100 (ex: 25.50°C é enviado como 2550)
    // - Pressão:     4 bytes, inteiro sem sinal, Little Endian, valor em Pascals
    // - Umidade:     2 bytes, inteiro sem sinal, Little Endian, valor * 100 (ex: 60.25% é enviado como 6025)
    // - CO2:         2 bytes, inteiro sem sinal, Little Endian (ppm)
    // - TVOCs:       2 bytes, inteiro sem sinal, Little Endian (ppb)

    let offset = 0;
    const dados = {};

    // Lê 2 bytes para a temperatura e divide por 100
    dados.temperatura = buffer.readInt16LE(offset) / 100.0;
    offset += 2;

    // Lê 4 bytes para a pressão
    dados.pressao = buffer.readUInt32LE(offset);
    offset += 4;

    // Lê 2 bytes para a umidade e divide por 100
    dados.umidade = buffer.readUInt16LE(offset) / 100.0;
    offset += 2;

    // Lê 2 bytes para o CO2
    dados.co2 = buffer.readUInt16LE(offset);
    offset += 2;

    // Lê 2 bytes para o TVOCs
    dados.tvocs = buffer.readUInt16LE(offset);
    offset += 2;
    
    return dados;
}

module.exports = router;