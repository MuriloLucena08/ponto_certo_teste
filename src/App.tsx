import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Layout} from './components/Layout/Layout';
import {Login} from './pages/Login/Login';
import {MapPage} from './pages/Map/MapPage';
import {RegistrosPage} from './pages/Registros/RegistrosPage';
import {FormularioPage} from './pages/Formulario/FormularioPage';
import {ParadasBancoPage} from './pages/ParadasBanco/ParadasBancoPage';
import {SobrePage} from './pages/Sobre/SobrePage';
import { PontoProvider } from './context/PontoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafeArea } from 'react-safe-area-component';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Prevent redirect while checking auth
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PontoProvider>
                    <SafeArea top bottom left right>
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<MapPage />} />
                                <Route path="registros" element={<RegistrosPage />} />
                                <Route path="paradas-banco" element={<ParadasBancoPage />} />

                            </Route>

                            <Route path="/formulario" element={
                                <ProtectedRoute>
                                    <FormularioPage />
                                </ProtectedRoute>
                             } />

                            <Route path="/sobre" element={
                                <ProtectedRoute>
                                <SobrePage />
                                </ProtectedRoute>
                            } />

                        </Routes>
                    </SafeArea>
                </PontoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
