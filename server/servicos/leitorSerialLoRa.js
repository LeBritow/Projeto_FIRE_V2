

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
// const LeiturasModel = require('../modelos/Leituras'); // Seu modelo para salvar no banco

// --- CONFIGURAÇÃO ---
const PORTA_SERIAL = 'COM3'; 
// const PORTA_SERIAL = '/dev/ttyACM0'; // para Linux

// A taxa de comunicação (baud rate) DEVE ser a mesma configurada no Arduino Receptor
const BAUDRATE = 9600; 


let port; 

function iniciarLeitorSerial() {
    console.log(`Tentando abrir a porta serial: ${PORTA_SERIAL} a ${BAUDRATE} baud`);

    port = new SerialPort({ path: PORTA_SERIAL, baudRate: BAUDRATE }, (err) => {
        if (err) {
            console.error(`Erro ao abrir a porta ${PORTA_SERIAL}:`, err.message);
            console.error("Verifique se a porta está correta, se o dispositivo está conectado e se você tem permissão.");
            
            setTimeout(iniciarLeitorSerial, 5000); // Tenta novamente em 5 segundos
        }
    });

    // Usa um parser para ler os dados linha por linha (terminadas com '\n')
    // Isso assume que o Arduino Receptor enviará os dados usando Serial.println()
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
        console.log(`Porta serial ${PORTA_SERIAL} aberta com sucesso.`);
    });

    // Evento disparado quando uma linha completa é recebida
    parser.on('data', async (linha) => {
        console.log(`Dado recebido via serial: ${linha}`);
        
        try {
          
            const valores = linha.split(','); 
            
            if (valores.length !== 5) { // Verifica se temos os 5 valores esperados
                console.warn("Formato de linha inesperado:", linha);
                return; 
            }

            const dadosDecodificados = {
                temperatura: parseFloat(valores[0]),
                pressao: parseInt(valores[1], 10),
                umidade: parseFloat(valores[2]),
                co2: parseInt(valores[3], 10),
                tvocs: parseInt(valores[4], 10),
            };

            // Verifica se os valores são números válidos após o parse
            if (Object.values(dadosDecodificados).some(isNaN)) {
                console.warn("Erro ao converter valores para número:", linha);
                return;
            }
            
            console.log("Dados processados:", dadosDecodificados);

            // TODO: Salvar os 'dadosDecodificados' no banco de dados.
            // Presumindo que você tenha um ID para este dispositivo receptor específico.
            const deviceId = 'receptor_local_01'; // Defina um ID
            // await LeiturasModel.salvarLeitura(deviceId, dadosDecodificados);
            // console.log("Dados salvos no banco.");

        } catch (error) {
            console.error("Erro ao processar linha de dados:", linha, error);
        }
    });

    port.on('error', (err) => {
        console.error('Erro na porta serial:', err.message);
    });

    port.on('close', () => {
        console.log(`Porta serial ${PORTA_SERIAL} fechada.`);
        // Tenta reabrir se fechar inesperadamente
        setTimeout(iniciarLeitorSerial, 5000); 
    });
}

module.exports = { iniciarLeitorSerial };