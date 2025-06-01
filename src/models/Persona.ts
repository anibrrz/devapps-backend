import { ObjectId } from "mongodb";
import { Auto, FirebaseAuto } from "./Auto";

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
    fechaNacimiento: string;
    genero: Genero;
    donante: boolean;
    autos: Auto[];

}

export interface FirebasePersona {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  genero: "Masculino" | "Femenino" | "NoBinario";
  donante: boolean;
  autos: FirebaseAuto[];
}
