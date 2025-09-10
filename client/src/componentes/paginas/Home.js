import React, { useState } from 'react';
import styles from "./Home.module.css";
import Container from "../layout/Container";
import Menu from "../layout/Menu";
import GraficosHistoricos from '../graficos/GraficosHistoricos'; // Gráfico de barras MENSAL
import GraficoTotalAnual from '../graficos/GraficoTotalAnual'; // Gráfico de linha/barras ANUAL

function Home() {
    // --- Estados para a seção "Visão Geral do Brasil" ---
    const [anoMensal, setAnoMensal] = useState(new Date().getFullYear());
    const [tipoGraficoAnual, setTipoGraficoAnual] = useState('line');

    // --- Dados para os seletores e para o mapeamento das regiões ---
    const anosDisponiveis = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998];
    
    const regioes = {
        'Sudeste': [
            { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'RJ', nome: 'Rio de Janeiro' },
            { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'ES', nome: 'Espírito Santo' },
        ],
        'Sul': [
            { sigla: 'PR', nome: 'Paraná' }, { sigla: 'SC', nome: 'Santa Catarina' },
            { sigla: 'RS', nome: 'Rio Grande do Sul' },
        ],
        'Centro-Oeste': [
            { sigla: 'GO', nome: 'Goiás' }, { sigla: 'MT', nome: 'Mato Grosso' },
            { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        ],
        'Nordeste': [
            { sigla: 'BA', nome: 'Bahia' }, { sigla: 'PE', nome: 'Pernambuco' },
            { sigla: 'CE', nome: 'Ceará' }, // Adicione outros estados
        ],
        'Norte': [
            { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'PA', nome: 'Pará' },
            { sigla: 'AC', nome: 'Acre' }, { sigla: 'RO', nome: 'Rondônia' },
            { sigla: 'RR', nome: 'Roraima' }, { sigla: 'AP', nome: 'Amapá' },
            { sigla: 'TO', nome: 'Tocantins' },
        ]
    };

    return (
        <div>
            <Menu />
            <Container>
                <h1>Dashboard de Monitoramento de Queimadas</h1>
                <p>Análise dos dados históricos fornecidos pelo INPE, com base na tabela `historico_agregado`.</p>

                {/* --- SEÇÃO VISÃO GERAL BRASIL --- */}
                <section className={styles.geralSection}>
                    <h2 className={styles.geralTitle}>Visão Geral - Brasil</h2>

                    {/* Gráfico 1: Evolução Anual Total */}
                    <GraficoTotalAnual localidade="BRASIL" tipoGrafico={tipoGraficoAnual} />
                    
                    {/* Gráfico 2: Detalhes Mensais por Ano */}
                    <div className={styles.seletorContainer}>
                        <div className={styles.seletorItem}>
                            <label htmlFor="ano-select-mensal">Ver detalhes por mês do ano:</label>
                            <select id="ano-select-mensal" className={styles.anoSelect} value={anoMensal} onChange={(e) => setAnoMensal(e.target.value)}>
                                {anosDisponiveis.map(ano => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                    </div>
                    <GraficosHistoricos localidade="BRASIL" ano={anoMensal} />
                </section>
                
                <hr className={styles.divisor} />

                {/* --- SEÇÃO ANÁLISE POR REGIÕES --- */}
                {Object.entries(regioes).map(([nomeRegiao, estados]) => {
                    const ePrimeiroDaNovaLinha = (index) => index % 3 === 0;
                    const eUltimoItem = (index) => index === estados.length - 1;

                    return (
                        <section key={nomeRegiao} className={styles.regionSection}>
                            <h2 className={styles.regionTitle}>{nomeRegiao}</h2>
                            <div className={styles.chartsGrid}>
                                {estados.map((estado, index) => {
                                    const deveOcuparLinhaToda = eUltimoItem(index) && ePrimeiroDaNovaLinha(index);
                                    const classNames = `${styles.chartItem} ${deveOcuparLinhaToda ? styles.fullWidth : ''}`;

                                    return (
                                        <div key={estado.sigla} className={classNames.trim()}>
                                            {/* Reutilizando o componente GraficoTotalAnual para os estados */}
                                            <GraficoTotalAnual
                                                localidade={estado.sigla}
                                                tipoGrafico="bar" // Fixo como barras
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </Container>
        </div>
    );
}

export default Home;