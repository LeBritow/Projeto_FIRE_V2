import  { useState } from 'react';
import { useAuth } from '../funcionalidades/AuthContext';
import styles from './AdminPage.module.css'; 


function AdminPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tipoDeDado, setTipoDeDado] = useState('historico_brasil');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const { token } = useAuth();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setFeedback({ message: 'Por favor, selecione um arquivo.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setFeedback({ message: '', type: '' });

        const formData = new FormData();
        formData.append('arquivo_csv', selectedFile);
        formData.append('tipoDeDado', tipoDeDado);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/upload-csv`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.mensagem || 'Falha no upload.');

            setFeedback({
                message: `${data.mensagem} | Lidos: ${data.dados.lidos}, Linhas Afetadas: ${data.dados.linhasAfetadas}`,
                type: 'success'
            });
            setSelectedFile(null);

        } catch (error) {
            setFeedback({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.adminContainer}>
         
            <div className={styles.uploadCard}>
                <h1>Painel de Administração</h1>
                <p className={styles.subtitle}>Upload de Dados de Queimadas (.csv)</p>

                {feedback.message && (
                    <p className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
                        {feedback.message}
                    </p>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="dataTypeSelect">1. Selecione o tipo de dado:</label>
                <select
                    id="dataTypeSelect"
                    className={styles.selectInput}
                    value={tipoDeDado}
                    onChange={(e) => setTipoDeDado(e.target.value)}
                >
                    <option value="historico_brasil">Histórico - Brasil (Geral)</option>
                    <option value="historico_ac">Histórico - Acre (AC)</option>
                    <option value="historico_al">Histórico - Alagoas (AL)</option>
                    <option value="historico_ap">Histórico - Amapá (AP)</option>
                    <option value="historico_am">Histórico - Amazonas (AM)</option>
                    <option value="historico_ba">Histórico - Bahia (BA)</option>
                    <option value="historico_ce">Histórico - Ceará (CE)</option>
                    <option value="historico_df">Histórico - Distrito Federal (DF)</option>
                    <option value="historico_es">Histórico - Espírito Santo (ES)</option>
                    <option value="historico_go">Histórico - Goiás (GO)</option>
                    <option value="historico_ma">Histórico - Maranhão (MA)</option>
                    <option value="historico_mt">Histórico - Mato Grosso (MT)</option>
                    <option value="historico_ms">Histórico - Mato Grosso do Sul (MS)</option>
                    <option value="historico_mg">Histórico - Minas Gerais (MG)</option>
                    <option value="historico_pa">Histórico - Pará (PA)</option>
                    <option value="historico_pb">Histórico - Paraíba (PB)</option>
                    <option value="historico_pr">Histórico - Paraná (PR)</option>
                    <option value="historico_pe">Histórico - Pernambuco (PE)</option>
                    <option value="historico_pi">Histórico - Piauí (PI)</option>
                    <option value="historico_rj">Histórico - Rio de Janeiro (RJ)</option>
                    <option value="historico_rn">Histórico - Rio Grande do Norte (RN)</option>
                    <option value="historico_rs">Histórico - Rio Grande do Sul (RS)</option>
                    <option value="historico_ro">Histórico - Rondônia (RO)</option>
                    <option value="historico_rr">Histórico - Roraima (RR)</option>
                    <option value="historico_sc">Histórico - Santa Catarina (SC)</option>
                    <option value="historico_sp">Histórico - São Paulo (SP)</option>
                    <option value="historico_se">Histórico - Sergipe (SE)</option>
                    <option value="historico_to">Histórico - Tocantins (TO)</option>
                </select>

                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="fileInput">2. Escolha o arquivo CSV:</label>
                    <label htmlFor="fileInput" className={styles.fileInputLabel}>
                        {selectedFile ? selectedFile.name : 'Procurar arquivo...'}
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".csv"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                    />
                </div>

                <button onClick={handleUpload} className={styles.uploadButton} disabled={isLoading || !selectedFile}>
                    {isLoading ? 'Enviando e Processando...' : 'Enviar Arquivo'}
                </button>
            </div>
        </div>
    );
}

export default AdminPage;