const fs = require('fs');
const csv = require('csv-parser');

const HistoricoAgregadoModel = require('../modelos/Historico_agregado'); // Importa o Model

const parseNumericValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') return 0;
    const number = parseInt(String(value).trim(), 10);
    return isNaN(number) ? 0 : number;
};

const headers = [
    'Ano', 'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Total'
];

async function processarHistoricoAgregado(caminhoArquivo, tipoDeDado) {
    let localidade;
    if (tipoDeDado === 'historico_brasil') {
        localidade = 'BRASIL';
    } else {
        localidade = tipoDeDado.split('_')[1].toUpperCase();
    }

    return new Promise((resolve, reject) => {
        const registrosParaSalvar = []; 
        let contadorLidos = 0;

        fs.createReadStream(caminhoArquivo)
            .pipe(csv({ headers: headers, skipLines: 1 }))
            .on('data', (linha) => {
                contadorLidos++;
                
                const registroObjeto = {
                    localidade: localidade,
                    ano: parseNumericValue(linha.Ano),
                    janeiro: parseNumericValue(linha.Janeiro),
                    fevereiro: parseNumericValue(linha.Fevereiro),
                    marco: parseNumericValue(linha.Marco),
                    abril: parseNumericValue(linha.Abril),
                    maio: parseNumericValue(linha.Maio),
                    junho: parseNumericValue(linha.Junho),
                    julho: parseNumericValue(linha.Julho),
                    agosto: parseNumericValue(linha.Agosto),
                    setembro: parseNumericValue(linha.Setembro),
                    outubro: parseNumericValue(linha.Outubro),
                    novembro: parseNumericValue(linha.Novembro),
                    dezembro: parseNumericValue(linha.Dezembro),
                    total: parseNumericValue(linha.Total)
                };
                registrosParaSalvar.push(registroObjeto);
            })
            .on('end', async () => {
                if (registrosParaSalvar.length === 0) {
                    return resolve({ lidos: contadorLidos, linhasAfetadas: 0 });
                }

                console.log(`Processando ${contadorLidos} registros para a localidade '${localidade}'...`);
                
                try {
                    const resultado = await HistoricoAgregadoModel.inserirOuAtualizarEmMassa(registrosParaSalvar);
                    resolve({ lidos: contadorLidos, linhasAfetadas: resultado.affectedRows });
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = { processarHistoricoAgregado };