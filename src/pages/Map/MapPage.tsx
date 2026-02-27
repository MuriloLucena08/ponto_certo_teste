import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polyline } from 'react-leaflet';
import { LatLng } from '../../utils/geoUtils';
import styles from './mapPage.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { IoMapSharp } from 'react-icons/io5';
import { MdSatellite, MdOutlinePlace, MdLocationPin } from 'react-icons/md';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { useMapPage } from '../../hooks/useMapPage';
import { useEffect } from 'react';
import userLocation from '@assets/images/user_location.png'
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const UserIcon = L.icon({
    iconUrl: userLocation,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const PinIcon = L.divIcon({
    html: renderToStaticMarkup(<MdLocationPin size={40} color='red' />),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const GreenPinIcon = L.divIcon({
    html: renderToStaticMarkup(<MdLocationPin size={40} color='green' />),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const OrangePinIcon = L.divIcon({
    html: renderToStaticMarkup(<MdLocationPin size={40} color='orange' />),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

// Component to handle map clicks
const MapEvents = ({ onMapClick, onMapMove }: any) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
        moveend(e) {
            onMapMove(e.target.getCenter());
        }
    });
    return null;
};

const MapController = ({ center, flyToCounter }: { center: LatLng | null; flyToCounter: number }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
        }
    }, [center, flyToCounter, map]);
    return null;
};

export const MapPage = () => {
    const {
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
    } = useMapPage();

    return (
        <div className={styles.container}>
            {loading && <div className={styles.loading}>Carregando mapa...</div>}

            <MapContainer
                center={userLocation ? [userLocation.lat, userLocation.lng] : [-15.7942, -47.8822]}
                zoom={17}
                minZoom={11}
                maxZoom={18}
                maxBounds={[[-16.15, -48.35], [-15.45, -47.25]]}
                maxBoundsViscosity={1.0}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <MapController center={mapCenter} flyToCounter={flyToCounter} />
                <MapEvents onMapClick={handleMapClick} onMapMove={handleMapMove} />

                <TileLayer
                    url={showSatellite
                        ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Polylines */}
                {polylines.map((line, idx) => (
                    <Polyline key={idx} positions={line.map(p => [p.lat, p.lng])} color="blue" weight={5} />
                ))}

                {/* User Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon} />
                )}

                {/* Confirmed Point (Green) */}
                {confirmedPoint && (
                    <Marker position={[confirmedPoint.lat, confirmedPoint.lng]} icon={GreenPinIcon} />
                )}

                {/* Interpolated Point (Orange) */}
                {interpolatedPoint && (
                    <Marker position={[interpolatedPoint.lat, interpolatedPoint.lng]} icon={OrangePinIcon} />
                )}

                {selectedPoint && (
                    <Marker
                        position={[selectedPoint.lat, selectedPoint.lng]}
                        icon={PinIcon}
                        draggable={true}
                        eventHandlers={{
                            dragend: handleMarkerDragEnd
                        }}
                        zIndexOffset={1000}
                    />
                )}

            </MapContainer>

            {/* UI Controls */}
            <div className={styles.controls}>
                <button
                    className={styles.fab}
                    onClick={() => setShowSatellite(!showSatellite)}
                    title="Alternar entre camadas de mapa"
                >
                    {showSatellite ? <IoMapSharp size={22} /> : <MdSatellite size={26} />}
                </button>

                <button
                    className={styles.fab}
                    onClick={handleGoToUserLocation}
                    title="Ir para minha localização"
                >
                    <MdOutlinePlace size={24} />
                </button>

                {confirmedPoint && (
                    <button
                        className={styles.fabRed}
                        onClick={handleClear}
                        title="Descartar seleção"
                    >
                        <BiSolidTrashAlt size={24} />
                    </button>
                )}
            </div>

            <div className={styles.bottomBar}>
                <button
                    className={styles.actionButton}
                    onClick={
                        viaConfirmada ? handleCadastrar :
                            confirmedPoint ? handleConfirmVia :
                                handleConfirmPonto
                    }
                    disabled={!selectedPoint && !viaConfirmada}
                >
                    {viaConfirmada ? 'Cadastrar Ponto' :
                        confirmedPoint ? 'Confirmar Via' :
                            'Confirmar Ponto'}
                </button>

                {confirmedPoint && !viaConfirmada && (
                    <button className={styles.secondaryButton} onClick={handleSkipVia}>
                        Não há Vias
                    </button>
                )}
            </div>
        </div>
    );
};
