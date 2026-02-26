import { api } from './api';
import { RemotePoint } from '../types/RemotePoint';

export type { RemotePoint };

const mapToRemotePoint = (data: any): RemotePoint => {
    return {
        ...data,
        criadoPor: data.criado_por || data.criadoPor,
        criadoEm: data.criado_em || data.criadoEm,
        visitadoEm: data.visitado_em || data.visitadoEm || data.dataVisita || data.data_visita || data.data_hora_visita || data.dt_visita,
        dataVisita: data.dataVisita || data.data_visita || data.visitado_em || data.visitadoEm || data.data_hora_visita || data.dt_visita,
        endereco: data.endereco,
        abrigoNome: data.abrigo_nome || data.abrigoNome,
        abrigoImg: data.abrigo_img || data.abrigoImg,
        dscNome: data.dsc_nome || data.dscNome,
        dscBacia: data.dsc_bacia || data.dscBacia,
        linhaEscolar: data.linha_escolar || data.linhaEscolar,
        linhaStpc: data.linha_stpc || data.linhaStpc,
    };
};

export const RemotePointsService = {
    async getAll(): Promise<RemotePoint[]> {
        try {
            const response = await api.get('/pontos/novos/pontos');
            if (response.status === 200) {
                return response.data.map(mapToRemotePoint);;
            }
            return [];
        } catch (e) {
            console.error('Error fetching remote points', e);
            return [];
        }
    },

    async getByRa(ra: string): Promise<RemotePoint[]> {
        try {
            const response = await api.get(`/pontos/novos/pontos/ras/${encodeURIComponent(ra)}`);
            if (response.status === 200) {
                return response.data.map(mapToRemotePoint);;
            }
            return [];
        } catch (e) {
            console.error('Error fetching points by RA', e);
            return [];
        }
    },

    async getByBacia(bacia: string): Promise<RemotePoint[]> {
        try {
            const response = await api.get(`/pontos/novos/pontos/bacias/${encodeURIComponent(bacia)}`);
            if (response.status === 200) {
                return response.data.map(mapToRemotePoint);;
            }
            return [];
        } catch (e) {
            console.error('Error fetching points by Bacia', e);
            return [];
        }
    }
};
