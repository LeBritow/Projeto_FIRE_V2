import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './GraficosHistoricos.module.css';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficosHistoricos({ localidade, ano }) {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/historico?localidade=${localidade}&ano=${ano}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensagem || 'Falha ao buscar dados da API.');
                }
                const data = await response.json();

                if (data.length === 0) {
                    throw new Error(`Nenhum dado encontrado para ${localidade} no ano de ${ano}.`);
                }

                const dadosDoAno = data[0];
                const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
                const valores = meses.map(mes => dadosDoAno[mes]);

                setChartData({
                    labels: meses.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                    datasets: [{
                        label: `Focos de Queimada em ${localidade} - ${ano}`,
                        data: valores,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)', 
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderRadius: 4,
                        borderWidth: 1,
                    }],
                });
            } catch (err) {
                console.error("Erro no gráfico:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [localidade, ano]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Histórico de Queimadas - ${localidade} (${ano})`,
                font: {
                    size: 18
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Focos'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mês'
                }
            }
        }
    };

    if (loading) return <p className={styles.feedbackText}>Carregando gráfico...</p>;
    if (error) return <p className={styles.errorText}>{error}</p>;

    return (
        <div className={styles.chartContainer}>
            <Bar options={options} data={chartData} />
        </div>
    );
}

export default GraficosHistoricos;