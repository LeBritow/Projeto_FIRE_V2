
const verificarAdmin = (req, res, next) => {


    if (req.usuarioLogado && req.usuarioLogado.cargo === 'admin') {
        
        next();
    } else {
        res.status(403).json({ mensagem: 'Acesso negado. Requer privilégios de administrador.' });
    
    }
};

module.exports = verificarAdmin;