import { BrowserRouter } from 'react-router-dom';
import { PontoProvider } from './context/PontoContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './rotas/Routes';
import * as SafeAreaModule from 'react-safe-area-component';

const SafeArea = (SafeAreaModule as any).SafeArea || (SafeAreaModule as any).default || SafeAreaModule;

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PontoProvider>
                    <SafeArea top bottom>
                        <AppRoutes />
                    </SafeArea>
                </PontoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
