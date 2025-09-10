import { Link } from "react-router-dom";
import styles from "./Menu.module.css";
import arvore from "../../imagens/icone_arvore_sem_fundo.png";
import logoutIcon from "../../imagens/botao-de-logout-delineado.png"; 
import { useAuth } from '../funcionalidades/AuthContext';

function Menu() {
    const { usuario, logoutAuth } = useAuth();

    return (
        <nav className={styles.containerMenu}>
            <div className={styles.logoContainer}>
                <Link to="/">
                    <img src={arvore} className={styles.icone_site} alt="Logo do Site" />
                </Link>
            </div>

            <ul className={styles.listaLinks}>
                <li><Link to="/">Home</Link></li>
                
                
                {usuario ? (
                    // Seção do usuário logado DENTRO de um <li>
                    <>
                        <li><Link to="/gerenciar">Gerenciar</Link></li>
                        {usuario.cargo === 'admin' ?  [
                            <li><Link to="/adminPage">Admin</Link></li>, <li><Link to="/cadastro">Cadastro</Link></li>]
                         : ''}

                        <li className={styles.itemUsuario}> 
                            <span className={styles.textoSaudacao}>Olá, {usuario.nome}!</span>
                            <button onClick={logoutAuth} className={styles.botaoLogout} title="Sair">
                                <img src={logoutIcon} className={styles.imgLogout} alt="Logout" />
                            </button>
                        </li>
                    </>
                ) : (
                    // Links de Login e Cadastro deslogado 
                    <>
                        <li><Link to="/login">Login</Link></li>
                        
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Menu;