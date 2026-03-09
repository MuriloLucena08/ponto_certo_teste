import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePonto } from '../context/PontoContext';
import { IPonto } from '../types/Ponto';
import { PointsService } from '../services/points';

export const useRegistros = () => {
    const { pontos, pendingCount, removePonto, updatePonto, setSyncMessage } = usePonto() as any;
    const [syncing, setSyncing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSync = async () => {
        const pontosParaSincronizar: IPonto[] = pontos.filter((p: IPonto) => p.syncStatus === 'pending');

        if (pontosParaSincronizar.length === 0) {
            setSyncMessage('Nenhuma parada pendente para sincronizar.');
            setTimeout(() => setSyncMessage(null), 3000);
            return;
        }

        setSyncing(true);
        let sucesso = 0;
        let falha = 0;

        for (const [index, ponto] of pontosParaSincronizar.entries()) {
            try {
                const enviado = await PointsService.createPoint(ponto);
                if (enviado) {
                    await updatePonto({ ...ponto, syncStatus: 'synced' });
                    sucesso++;
                } else {
                    throw new Error('A API não retornou sucesso (status != 201)');
                }
            } catch (error) {
                console.error(`Falha ao sincronizar a parada ${ponto.id}:`, error);
                falha++;
            }

            // Adiciona uma pausa de 3 segundos entre cada envio, exceto para o último
            if (index < pontosParaSincronizar.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        setSyncing(false);

        let finalMessage = '';
        if (falha === 0) {
            finalMessage = 'Todas as paradas foram sincronizadas com sucesso!';
        } else if (sucesso === 0) {
            finalMessage = 'Falha ao sincronizar todas as paradas.';
        } else {
            finalMessage = `${sucesso} parada(s) sincronizada(s). ${falha} falharam.`;
        }
        setSyncMessage(finalMessage);
        setTimeout(() => setSyncMessage(null), 5000);
     };

    const handleEdit = (ponto: any) => {
        navigate(`/formulario?edit=${ponto.id}&lat=${ponto.latitude}&lng=${ponto.longitude}`);
    };

    const handleDelete = (id: any) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            if (typeof removePonto === 'function') {
                await removePonto(deleteId);
                setMessage('Parada removida');
                setTimeout(() => setMessage(null), 5000);
            }
            setShowModal(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    return {
        pontos,
        syncing,
        showModal,
        message,
        pendingCount,
        handleSync,
        handleEdit,
        handleDelete,
        confirmDelete,
        cancelDelete,
    };
};
