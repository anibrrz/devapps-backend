import { ObjectId } from "mongodb";
import { Auto } from "./Auto";

export enum Genero {
    Masculino = 'Masculino',
    Femenino = 'Femenino',
    NoBinario = 'NoBinario'
}

export interface Persona {
    _id: ObjectId
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: Date;
    genero: Genero;
    donante: boolean;
    autos: Auto[];

}
