import { api } from './api';
import { transformCoordinates } from '../utils/projection';

let raCache: any = null;

export const RAService = {
    async getAll() {
        if (raCache) return raCache;

        try {
            const response = await api.get('/ras/');

            if (response.status === 200) {
                const data = response.data;

                // Verifica se é a estrutura de lista de objetos RA
                if (Array.isArray(data) && data.length > 0 && data[0].descNome) {
                    raCache = data
                        .map((item: any) => {
                            // Garante que geoRas seja um objeto, mesmo se vier como string
                            let geometry = item.geoRas;
                            if (typeof geometry === 'string') {
                                try { geometry = JSON.parse(geometry); } catch { geometry = null; }
                            }

                            // Converte as coordenadas de UTM para Lat/Lng se a geometria existir
                            if (geometry && geometry.coordinates) {
                                geometry.coordinates = transformCoordinates(geometry.coordinates);
                            }

                            return {
                                type: "Feature",
                                properties: {
                                    name: item.descNome,
                                    idBacia: item.idBacia,
                                    prefixo: item.descPrefixoRa
                                },
                                geometry: geometry
                            };
                        })
                        .filter((f: any) => f.geometry && typeof f.geometry === 'object');

                    return raCache;
                }

                // Access the "features" within "geojson"
                if (Array.isArray(data) && data.length > 0 && data[0].geojson && data[0].geojson.features) {
                    raCache = data[0].geojson.features;
                    return raCache;
                }
            }
            return [];
        } catch (e) {
            console.error('Error fetching RAs', e);
            return [];
        }
    },

    async getByName(name: string) {
        try {
            // Codifica o nome para garantir que caracteres especiais e espaços sejam aceitos na URL
            const response = await api.get(`/ras/${encodeURIComponent(name)}`);

            if (response.status === 200) {
                const item = response.data;

                // Garante que geoRas seja um objeto, mesmo se vier como string
                let geometry = item.geoRas;
                if (typeof geometry === 'string') {
                    try { geometry = JSON.parse(geometry); } catch { geometry = null; }
                }

                // Converte as coordenadas de UTM para Lat/Lng se a geometria existir
                if (geometry && geometry.coordinates) {
                    geometry.coordinates = transformCoordinates(geometry.coordinates);
                }

                if (geometry) {
                    return {
                        type: "Feature",
                        properties: {
                            name: item.descNome,
                            idBacia: item.idBacia,
                            prefixo: item.descPrefixoRa
                        },
                        geometry: geometry
                    };
                }
            }
            return null;
        } catch (e) {
            console.error(`Error fetching RA ${name}`, e);
            return null;
        }
    }
};