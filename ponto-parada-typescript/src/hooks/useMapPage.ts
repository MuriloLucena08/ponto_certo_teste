import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LatLng, findInterpolatedPoint } from '../utils/geoUtils';
import { AddressService } from '../services/address';
import { ViaService } from '../services/via';

export const useMapPage = () => {
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);
    const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
    const [confirmedPoint, setConfirmedPoint] = useState<LatLng | null>(null);
    const [interpolatedPoint, setInterpolatedPoint] = useState<LatLng | null>(null);
    const [polylines, setPolylines] = useState<LatLng[][]>([]);
    const [viaConfirmada, setViaConfirmada] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flyToCounter, setFlyToCounter] = useState(0);

    const navigate = useNavigate();

    const loadVias = async (loc: LatLng) => {
        const vias = await ViaService.getNearbyVias(loc);
        setPolylines(vias);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setUserLocation(loc);
                    setMapCenter(loc);
                    if (!confirmedPoint) setSelectedPoint(loc);
                    setLoading(false);
                    loadVias(loc);
                },
                (error) => {
                    console.error('Error getting location', error);
                    setLoading(false);
                    setUserLocation({ lat: -15.7942, lng: -47.8822 });
                    setMapCenter({ lat: -15.7942, lng: -47.8822 });
                    if (!confirmedPoint) setSelectedPoint({ lat: -15.7942, lng: -47.8822 });
                    setUserLocation({ lat: -15.799831, lng: -47.877598 });
                    setMapCenter({ lat: -15.799831, lng: -47.877598 });
                    if (!confirmedPoint) setSelectedPoint({ lat: -15.799831, lng: -47.877598 });
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const handleMapMove = (center: LatLng) => {
        if (!viaConfirmada) {
            setSelectedPoint(center);
        }
    };

    const handleMapClick = (latlng: any) => {
        if (viaConfirmada) return;

        const clickedPoint = { lat: latlng.lat, lng: latlng.lng };

        if (!confirmedPoint) {
            setMapCenter(clickedPoint);
        } else {
            const interpolated = findInterpolatedPoint(clickedPoint, polylines);
            setInterpolatedPoint(interpolated || clickedPoint);
        }
    };

    const handleMarkerDragEnd = (e: any) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setMapCenter({ lat: position.lat, lng: position.lng });
    };

    const handleConfirmPonto = async () => {
        if (!selectedPoint) return;
        setConfirmedPoint(selectedPoint);

        try {
            const addr = await AddressService.getAddress(selectedPoint.lat, selectedPoint.lng);
            console.log('Endereço', addr);
        } catch (e) {
            console.error('Addr error', e);
        }
    };

    const handleConfirmVia = () => {
        if ((!selectedPoint && !interpolatedPoint) || !polylines.length) return;

        const target = interpolatedPoint || (selectedPoint ? findInterpolatedPoint(selectedPoint, polylines) : null);
        if (target) {
            setInterpolatedPoint(target);
            setViaConfirmada(true);
            setSelectedPoint(null);
        } else {
            alert('Não foi possível interpolar o ponto na via selecionada.');
        }
    };

    const handleClear = () => {
        setSelectedPoint(null);
        setConfirmedPoint(null);
        setInterpolatedPoint(null);
        setViaConfirmada(false);
    };

    const handleCadastrar = () => {
        if (!confirmedPoint) return;
        navigate(`/formulario?lat=${confirmedPoint.lat}&lng=${confirmedPoint.lng}&ilat=${interpolatedPoint?.lat || 0}&ilng=${interpolatedPoint?.lng || 0}`);
    };

    const handleGoToUserLocation = () => {
        if (!navigator.geolocation) {
            // Fallback: usa última localização conhecida
            if (userLocation) {
                setMapCenter({ ...userLocation });
                setFlyToCounter(c => c + 1);
                loadVias(userLocation);
            }
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (p) => {
                const loc = { lat: p.coords.latitude, lng: p.coords.longitude };
                setUserLocation(loc);
                setMapCenter(loc);
                setFlyToCounter(c => c + 1);
                loadVias(loc);
            },
            () => {
                // Permissão negada — usa última localização conhecida
                if (userLocation) {
                    setMapCenter({ ...userLocation });
                    setFlyToCounter(c => c + 1);
                    loadVias(userLocation);
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSkipVia = () => {
        setInterpolatedPoint({ lat: 0, lng: 0 });
        setViaConfirmada(true);
        setSelectedPoint(null);
    };

    return {
        userLocation,
        mapCenter,
        flyToCounter,
        selectedPoint,
        confirmedPoint,
        interpolatedPoint,
        polylines,
        viaConfirmada,
        showSatellite,
        setShowSatellite,
        loading,
        handleMapMove,
        handleMapClick,
        handleMarkerDragEnd,
        handleConfirmPonto,
        handleConfirmVia,
        handleClear,
        handleCadastrar,
        handleGoToUserLocation,
        handleSkipVia,
    };
};
