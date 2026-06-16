import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2'; 
import styles from './GraficoTotalAnual.module.css'; 
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function GraficoTotalAnual({ localidade, tipoGrafico }) {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localidade) {
            setLoading(false);
            setError("Nenhuma localidade selecionada.");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/historico-anual?localidade=${localidade}`);
                if (!response.ok) throw new Error('Falha ao buscar dados anuais da API.');
                
                const data = await response.json();
                if (data.length === 0) throw new Error(`Nenhum dado anual encontrado para ${localidade}.`);

                const labels = data.map(item => item.ano);
                const valores = data.map(item => item.total);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `Total de Focos de Queimada por Ano em ${localidade}`,
                        data: valores,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        tension: tipoGrafico === 'line' ? 0.1 : 0,
                    }],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [localidade, tipoGrafico]);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Evolução Anual dos Focos de Queimada - ${localidade}`,
                font: { size: 18 }
            },
        },
        scales: {
            y: { title: { display: true, text: 'Número Total de Focos' } },
            x: { title: { display: true, text: 'Ano' } }
        }
    };

    if (loading) return <p className={styles.feedbackText}>Carregando gráfico...</p>;
    if (error) return <p className={styles.errorText}>{error}</p>;

    const renderChart = () => {
        if (tipoGrafico === 'line') {
            return <Line options={options} data={chartData} />;
        }
        return <Bar options={options} data={chartData} />;
    };

    return (
        <div className={styles.chartContainer}>
            {renderChart()}
        </div>
    );
}

export default GraficoTotalAnual;