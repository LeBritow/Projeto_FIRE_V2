import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';

function Card(props) {
    const navigate = useNavigate();

    const getStatusClass = (tipo, valor) => {
        const val = parseFloat(valor);
        if (isNaN(val)) return '';

        switch (tipo) {
            case 'temperatura':
                if (val > 40) return styles.grave;
                if (val > 30) return styles.alerta;
                break;
            case 'umidade':
                if (val < 20) return styles.grave;
                if (val < 40) return styles.alerta;
                break;
            case 'co2':
                if (val > 1000) return styles.grave;
                if (val > 800) return styles.alerta;
                break;
            case 'tvoc':
                if (val > 500) return styles.alerta;
                break;
            default:
                return '';
        }
        return '';
    };

    const handleClick = () => {
        navigate('/sensor/detalhes');
    };

    return (
        <div 
            className={styles.containerCard} 
            onClick={handleClick} 
            title="Clique para ver gráficos detalhados"
        >
            <div className={styles.divCard}>
                <h3>{props.nome}</h3> 
                <span style={{fontSize: '0.8em', opacity: 0.8}}>Clique para ver histórico</span>
            </div>

            <div className={styles.gridDados}>
                <div className={`${styles.itemDado} ${getStatusClass('temperatura', props.temperatura)}`}>
                    <span className={styles.label}>Temp</span>
                    <span className={styles.valor}>{props.temperatura ?? '--'} °C</span>
                </div>

                <div className={`${styles.itemDado} ${getStatusClass('umidade', props.umidade)}`}>
                    <span className={styles.label}>Umid</span>
                    <span className={styles.valor}>{props.umidade ?? '--'} %</span>
                </div>
                
                <div className={styles.itemDado}>
                    <span className={styles.label}>Pressão</span>
                    <span className={styles.valor}>{props.pressao ?? '--'} hPa</span>
                </div>
            </div>

            <div className={styles.gridDados}>
                <div className={`${styles.itemDado} ${getStatusClass('co2', props.co2)}`}>
                    <span className={styles.label}>CO₂</span>
                    <span className={styles.valor}>{props.co2 ?? '--'} ppm</span>
                </div>

                <div className={`${styles.itemDado} ${getStatusClass('tvoc', props.tvoc)}`}>
                    <span className={styles.label}>TVOCs</span>
                    <span className={styles.valor}>{props.tvoc ?? '--'} ppb</span>
                </div>
            </div>
        </div>
    )
}

export default Card;