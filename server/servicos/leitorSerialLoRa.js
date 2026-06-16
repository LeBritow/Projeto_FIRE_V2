const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const conexao = require('../infraestrutura/conexao');

const PORTA_SERIAL = 'COM3'; 
const BAUDRATE = 115200; 

let port; 

function iniciarLeitorSerial() {
    console.log(`--> Tentando abrir a porta serial: ${PORTA_SERIAL} a ${BAUDRATE} baud`);

    port = new SerialPort({ path: PORTA_SERIAL, baudRate: BAUDRATE }, (err) => {
        if (err) {
            console.error(`❌ Erro ao abrir a porta ${PORTA_SERIAL}:`, err.message);
            setTimeout(iniciarLeitorSerial, 5000);
        }
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
        console.log(`✅ Porta serial ${PORTA_SERIAL} aberta! Aguardando dados LoRa...`);
    });

    parser.on('data', (linha) => {
        linha = linha.trim();
        
        if (linha.length > 5) {
             console.log(`Bruto recebido: ${linha}`);
        }

        if (linha.startsWith("DADO:")) {
            try {
                let conteudo = linha.replace(/DADO:/g, "");
                
                let rssi = 0;
                if (conteudo.includes("|RSSI:")) {
                    const partes = conteudo.split("|RSSI:");
                    conteudo = partes[0];
                    rssi = parseInt(partes[1]);
                }

                const valores = conteudo.split(';');

                if (valores.length >= 5) {
                    const dados = {
                        temperatura: parseFloat(valores[0]),
                        umidade: parseFloat(valores[1]),
                        pressao: parseFloat(valores[2]),
                        co2: parseInt(valores[3]),
                        tvocs: parseInt(valores[4]),
                        rssi: rssi,
                        device_id: 'heltec_lora_01'
                    };

                    console.log(`📊 Dados processados: T:${dados.temperatura}°C | CO2:${dados.co2} PPM`);

                    const sql = `INSERT INTO leituras_sensores 
                        (device_id, temperatura, pressao, umidade, co2, tvocs, rssi) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    
                    const params = [dados.device_id, dados.temperatura, dados.pressao, dados.umidade, dados.co2, dados.tvocs, dados.rssi];

                    conexao.query(sql, params, (erro, resultados) => {
                        if (erro) {
                            console.error("❌ Erro ao salvar no MySQL:", erro.message);
                        } 
                    });
                }
            } catch (e) {
                console.error("Erro ao fazer parse da linha:", e.message);
            }
        }
    });

    port.on('error', (err) => {
        console.error('❌ Erro de Hardware na Serial:', err.message);
    });
}

module.exports = { iniciarLeitorSerial };