
import Container from "../layout/Container";
import styles from "./Gerenciar.module.css";
import Card from "../layout/Card";
import Menu from "../layout/Menu";
function Gerenciar() {
    return(
        <div >
            <Menu/>
            <div className="alertaCards">
                <div className={styles.containerCard}>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                </div>

            </div>
            <div className="alertaStatus">
                <div className={styles.containerCard}>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei" customClass="grave"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei" customClass="alerta"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                </div>

            </div>
        </div>
    )
}

export default Gerenciar;