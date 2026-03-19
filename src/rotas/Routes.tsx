import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';

// Lazy-loading das páginas para code-splitting.
// Isso garante que o código de uma página só seja baixado quando o usuário acessá-la.
const Login = lazy(() => import('../pages/Login/Login').then(module => ({ default: module.Login })));
const MapPage = lazy(() => import('../pages/Map/MapPage').then(module => ({ default: module.MapPage })));
const RegistrosPage = lazy(() => import('../pages/Registros/RegistrosPage').then(module => ({ default: module.RegistrosPage })));
const FormularioPage = lazy(() => import('../pages/Formulario/FormularioPage').then(module => ({ default: module.FormularioPage })));
const ParadasBancoPage = lazy(() => import('../pages/ParadasBanco/ParadasBancoPage').then(module => ({ default: module.ParadasBancoPage })));
const SobrePage = lazy(() => import('../pages/Sobre/SobrePage').then(module => ({ default: module.SobrePage })));


/**
 * Componente de ordem superior (HOC) para proteger rotas que exigem autenticação.
 * Redireciona para a página de login se o usuário não estiver autenticado.
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Carregando autenticação...</div>; // Exibe um loader enquanto verifica a sessão
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

/**
 * Componente que centraliza a configuração de rotas da aplicação.
 * Utiliza `React.lazy` e `Suspense` para carregar páginas sob demanda.
 */
export const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Carregando página...</div>}>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MapPage />} />
                    <Route path="registros" element={<RegistrosPage />} />
                    <Route path="paradas-banco" element={<ParadasBancoPage />} />
                </Route>

                <Route path="/formulario" element={<ProtectedRoute><FormularioPage /></ProtectedRoute>} />
                <Route path="/sobre" element={<ProtectedRoute><SobrePage /></ProtectedRoute>} />

                {/* Rota de fallback para redirecionar para a home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
