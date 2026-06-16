import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cadastro.module.css';
import Feedback from '../funcionalidades/Feedback';

function Cadastro() {
    const urlAPI = process.env.REACT_APP_API_URL;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cargo, setCargo] = useState('');

    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [carregando, setCarregando] = useState(false);

    const navegar = useNavigate();

    const fecharMensagem = () => {
        setMensagem({ texto: '', tipo: '' });
    };

    const enviarFormulario = async (evento) => {
        evento.preventDefault();
        setCarregando(true);
        fecharMensagem();

        if (!nome || !email || !senha || !cargo) {
            setMensagem({ texto: 'Todos os campos são obrigatórios.', tipo: 'error' });
            setCarregando(false);
            return;
        }

        try {
            const resposta = await fetch(`${urlAPI}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, cargo }),
            });

            const dados = await resposta.json();

        if (!resposta.ok) {
            return setMensagem({ texto: dados.mensagem || 'Erro ao cadastrar.', tipo: 'error' });
        }


            setMensagem({ texto: 'Cadastro realizado com sucesso! Redirecionando...', tipo: 'success' });

            setNome('');
            setEmail('');
            setSenha('');
            setCargo('');

            setTimeout(() => {
                navegar('/');
            }, 2000);

        } catch (erro) {
            setMensagem({ texto: erro.message, tipo: 'error' });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <Feedback 
                mensagem={mensagem.texto}
                tipo={mensagem.tipo}
                aoFechar={fecharMensagem}
            />

            <div className={styles.container}>
                <form onSubmit={enviarFormulario} className={styles.cadastroForm}>
                    <h2>Criar Conta</h2>

                    <div className={styles.formGroup}>
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Crie uma senha"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="cargo">Cargo:</label>
                        <input
                            type="text"
                            id="cargo"
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            placeholder="Seu cargo na empresa"
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={carregando}>
                        {carregando ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default Cadastro;
