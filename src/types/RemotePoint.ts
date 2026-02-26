import { IParada } from './Parada';

export interface RemotePoint extends Partial<IParada> {
    id: number;
    latitude: number;
    longitude: number;
    endereco?: string;
    bacia?: string;
    ra?: string;
    codigo?: string;
    dataVisita?: string;
}
