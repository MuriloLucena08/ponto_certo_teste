import proj4 from 'proj4';

// Definição da projeção de origem (SIRGAS 2000 / UTM zone 23S - Comum no DF/Brasil)
export const SOURCE_PROJ = "+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
export const DEST_PROJ = "EPSG:4326"; // WGS84 (Latitude/Longitude) usado pelo Leaflet

export const transformCoordinates = (coords: any): any => {
    // Se for um par de coordenadas [x, y], converte
    if (Array.isArray(coords) && coords.length === 2 && typeof coords[0] === 'number') {
        return proj4(SOURCE_PROJ, DEST_PROJ, coords);
    } else if (Array.isArray(coords)) {
        // Se for um array de arrays (Polygon, MultiPolygon), desce o nível recursivamente
        return coords.map(transformCoordinates);
    }
    return coords;
};
