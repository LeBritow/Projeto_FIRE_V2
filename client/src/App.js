import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./componentes/paginas/Home.js";
import Gerenciar from "./componentes/paginas/Gerenciar.js";
import Login from "./componentes/paginas/Login.js";
import Cadastro from "./componentes/paginas/Cadastro.js";
import AdminPage from "./componentes/paginas/AdminPage.js";
import DetalhesSensor from "./componentes/paginas/DetalhesSensor.js";

import { AuthProvider } from './componentes/funcionalidades/AuthContext.js';
import AdminRoute from './componentes/funcionalidades/AdminRoute.js'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gerenciar" element={<Gerenciar />} />
          <Route path="/sensor/detalhes" element={<DetalhesSensor />} /> 
          
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route 
            path="/adminPage" 
            element={
              <AdminRoute element={<AdminPage />} />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;