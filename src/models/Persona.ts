import { Auto } from "./Auto";

export enum Genero {
    Masculino = 'Masculino',
    Femenino = 'Femenino',
    NoBinario = 'NoBinario'
}

export interface Persona {
    _id: string;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    genero: Genero;
    donante: boolean;
    autos: Auto[];
}
