
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [usuario, setUsuario] = useState(null); 

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            try {

                const storedUser = localStorage.getItem('authUser');
                if (storedUser) {
                    setUsuario(JSON.parse(storedUser));
                }

            } catch (error) {
                console.error("Erro ao decodificar token ou buscar usuário:", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setToken(null);
                setUsuario(null);
            }
        }
    }, []);

    const loginAuth = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setToken(newToken);
        setUsuario(userData);
    };

    const logoutAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ token, usuario, loginAuth, logoutAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};