import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RemotePointsService, RemotePoint } from '../services/remotePoints';
import { RAService } from '../services/ra';
import { BaciaService } from '../services/bacia';

export const useParadasBanco = () => {
    const [points, setPoints] = useState<RemotePoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [raFeature, setRaFeature] = useState<any>(null);
    const [baciaFeature, setBaciaFeature] = useState<any>(null);
    const [showSatellite, setShowSatellite] = useState(false);
    const navigate = useNavigate();

    const ras = [
        "ÁGUAS CLARAS", "BRASÍLIA", "BRAZLÂNDIA", "CANDANGOLÂNDIA", "CEILÂNDIA", "CRUZEIRO",
        "GAMA", "GUARÁ", "ITAPOÃ", "JARDIM BOTÂNICO", "LAGO NORTE", "LAGO SUL",
        "NÚCLEO BANDEIRANTE", "PARANOÁ", "PARK WAY", "PLANALTINA", "RECANTO DAS EMAS",
        "RIACHO FUNDO", "RIACHO FUNDO II", "SAMAMBAIA", "SANTA MARIA", "SÃO SEBASTIÃO",
        "SCIA", "SIA", "SOBRADINHO", "SOBRADINHO II", "SUDOESTE/OCTOGONAL", "TAGUATINGA",
        "VARJÃO", "VICENTE PIRES"
    ];

    const bacias = [
        'Sem Bacia', 'Norte', 'Sudeste', 'Sudoeste', 'Centro-Oeste', 'Noroeste'
    ];

    const [filterType, setFilterType] = useState<'RA' | 'Bacia' | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setRaFeature(null);
            setBaciaFeature(null);
            let data: RemotePoint[] = [];

            if (navigator.geolocation && !userLocation) {
                navigator.geolocation.getCurrentPosition(p => {
                    setUserLocation([p.coords.latitude, p.coords.longitude]);
                });
            }

            if (filterType === 'RA' && selectedFilter) {
                data = await RemotePointsService.getByRa(selectedFilter);
                try {
                    const feature = await RAService.getByName(selectedFilter);
                    if (feature) {
                        setRaFeature(feature);
                    }
                } catch (error) {
                    console.log("Erro ao carregar poligono da RA", error);
                }
            } else if (filterType === 'Bacia' && selectedFilter) {
                data = await RemotePointsService.getByBacia(selectedFilter);
                try {
                    const feature = await BaciaService.getByName(selectedFilter);
                    if (feature) {
                        setBaciaFeature(feature);
                    }
                } catch (error) {
                    console.log("Erro ao carregar poligono da Bacia", error);
                }
            } else {
                data = await RemotePointsService.getAll();
            }

            setPoints(data);
            setLoading(false);
        };
        load();
    }, [filterType, selectedFilter]);

    return {
        points,
        loading,
        userLocation,
        raFeature,
        baciaFeature,
        showSatellite,
        setShowSatellite,
        ras,
        bacias,
        filterType,
        setFilterType,
        selectedFilter,
        setSelectedFilter,
        navigate,
    };
};
