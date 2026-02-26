export interface IViaGeoJSON {
    type: string;
    features: {
        type: string;
        properties: {
            Name: string;
        };
        geometry: {
            type: string;
            coordinates: [number, number][];
        };
    }[];
}
