import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
    Title, Tooltip, Legend, Filler 
} from 'chart.js';
import Menu from '../layout/Menu';
import styles from './DetalhesSensor.module.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function DetalhesSensor() {
    const [historico, setHistorico] = useState([]);
    const [pausado, setPausado] = useState(false);

    const commonOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            x: { grid: { display: false } },
            y: { border: { dash: [4, 4] } }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (pausado) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hardware/historico-recente`);
                const data = await response.json();
                
                if (data.length > 0) {
                    setHistorico(data);
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [pausado]);

    const labels = historico.map(d => 
        new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    const dataTemperatura = {
        labels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: historico.map(d => d.temperatura),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const dataUmidade = {
        labels,
        datasets: [{
            label: 'Umidade (%)',
            data: historico.map(d => d.umidade),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const dataAr = {
        labels,
        datasets: [
            {
                label: 'CO2 (ppm)',
                data: historico.map(d => d.co2),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.3,
                yAxisID: 'y'
            },
            {
                label: 'TVOCs (ppb)',
                data: historico.map(d => d.tvocs),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.3,
                yAxisID: 'y'
            }
        ]
    };

    return (
        <div style={{backgroundColor: '#F9F7F3', minHeight: '100vh'}}>
            <Menu />
            
            <div className={styles.dashboardContainer}>
                
                <div className={styles.header}>
                    <Link to="/gerenciar" className={styles.voltarBtn}>← Voltar</Link>
                    
                    <div className={styles.controls}>
                        <button 
                            className={`${styles.pauseBtn} ${pausado ? styles.paused : ''}`} 
                            onClick={() => setPausado(!pausado)}
                        >
                            {pausado ? '▶ Retomar Atualização' : '⏸ Pausar Atualização'}
                        </button>
                    </div>
                </div>

                <h1 style={{textAlign: 'center', color: '#22574A', marginBottom: '30px'}}>
                    Análise Detalhada: Heltec LoRa
                </h1>

                {historico.length > 0 ? (
                    <div className={styles.chartsGrid}>
                        
                        <div className={styles.chartCard}>
                            <h3 className={styles.chartTitle}>🌡️ Variação de Temperatura</h3>
                            <Line data={dataTemperatura} options={commonOptions} />
                        </div>

                        <div className={styles.chartCard}>
                            <h3 className={styles.chartTitle}>💧 Variação de Umidade</h3>
                            <Line data={dataUmidade} options={commonOptions} />
                        </div>

                        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                            <h3 className={styles.chartTitle}>🍃 Qualidade do Ar (CO₂ e Compostos)</h3>
                            <p style={{fontSize: '0.9em', color: '#666'}}>
                                *Clique na legenda acima para ocultar/mostrar sensores individualmente.
                            </p>
                            <Line data={dataAr} options={commonOptions} />
                        </div>

                    </div>
                ) : (
                    <p style={{textAlign: 'center', fontSize: '1.2rem', marginTop: '50px'}}>
                        Carregando dados do sensor...
                    </p>
                )}
            </div>
        </div>
    );
}

export default DetalhesSensor;