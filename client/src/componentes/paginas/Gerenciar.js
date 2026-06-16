import { useState, useEffect } from 'react';
import Container from "../layout/Container";
import styles from "./Gerenciar.module.css";
import Card from "../layout/Card";
import Menu from "../layout/Menu";

function Gerenciar() {
    const urlAPI = process.env.REACT_APP_API_URL;
    
    const [leitura, setLeitura] = useState({
        temperatura: 0,
        umidade: 0,
        pressao: 0,
        co2: 0,
        tvocs: 0,
        rssi: 0
    });

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const resposta = await fetch(`${urlAPI}/api/hardware/leitura-atual`);
                if (resposta.ok) {
                    const dados = await resposta.json();
                    if (dados && dados.id) {
                        setLeitura(dados);
                    }
                }
            } catch (erro) {
                console.error("Erro ao buscar dados:", erro);
            }
        };

        buscarDados();
        
        const intervalo = setInterval(() => {
            buscarDados();
        }, 2000);

        return () => clearInterval(intervalo);
    }, [urlAPI]);

    return (
        <div>
            <Menu />
            
            <Container customClass="column">
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#22574A' }}>
                    <h1>Monitoramento em Tempo Real</h1>
                    <p>Dispositivo: Heltec LoRa 01</p>
                </div>

                <div className={styles.containerCard}>
                    <Card 
                        nome="Sensor Principal" 
                        temperatura={leitura.temperatura}
                        umidade={leitura.umidade}
                        pressao={leitura.pressao}
                        co2={leitura.co2}
                        tvoc={leitura.tvocs}
                    />
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
                    <p><strong>Sinal (RSSI):</strong> {leitura.rssi ? `${leitura.rssi} dBm` : '--'}</p>
                    <p style={{ fontSize: '0.8em' }}>
                        Última atualização: {new Date().toLocaleTimeString()}
                    </p>
                </div>

            </Container>
        </div>
    )
}

export default Gerenciar;