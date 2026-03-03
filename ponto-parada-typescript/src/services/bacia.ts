import { api } from './api';
import { transformCoordinates } from '../utils/projection';

const baciaCache: { [key: string]: any } = {};

export const BaciaService = {
    async getByName(name: string) {
        if (baciaCache[name]) {
            return baciaCache[name];
        }

        try {
            const response = await api.get(`/bacias/${encodeURIComponent(name)}`);

            if (response.status === 200) {
                const item = response.data;

                // Tenta obter a geometria de geoBacia ou geoJson
                let geometry = item.geoBacia || item.geoJson;
                if (typeof geometry === 'string') {
                    try { geometry = JSON.parse(geometry); } catch { geometry = null; }
                }

                // Converte as coordenadas de UTM para Lat/Lng se a geometria existir
                if (geometry && geometry.coordinates) {
                    geometry.coordinates = transformCoordinates(geometry.coordinates);
                }

                if (geometry) {
                    const feature = {
                        type: "Feature",
                        properties: {
                            name: item.descBacia || item.nome,
                            id: item.id
                        },
                        geometry: geometry
                    };
                    baciaCache[name] = feature;
                    return feature;
                }
            }
            return null;
        } catch (e) {
            console.error(`Error fetching Bacia ${name}`, e);
            return null;
        }
    }
};