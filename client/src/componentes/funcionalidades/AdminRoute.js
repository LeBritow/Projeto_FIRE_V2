
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AdminRoute({ element }) {
    const { usuario, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (usuario && usuario.cargo !== 'admin') {
        return <Navigate to="/" replace />;
    }

   
    return element;
}

export default AdminRoute;