

import { useEffect } from 'react';
import styles from './Feedback.module.css';


function Feedback({mensagem,tipo,  aoFechar }) {

    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                aoFechar(); 
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [mensagem, aoFechar]);

    if (!mensagem) {
        return null;
    }

    const containerClasses = `${styles.feedbackContainer} ${styles[tipo]}`;

    return (
        <div className={containerClasses}>
            <span>{mensagem}</span>
            <button onClick={aoFechar} className={styles.closeButton}>
                &times;
            </button>
        </div>
    );
}

export default Feedback;