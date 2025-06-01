import { ObjectId } from "mongodb";
import { Auto, FirebaseAuto } from "../../models/Auto";
import { FirebasePersona, Genero, Persona } from "../../models/Persona";

export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id) && new ObjectId(id).toHexString() === id;
};

// Auto Mongo a Firebase
export const autoToFirebase = (auto: Auto): FirebaseAuto => ({
  _id: auto._id.toHexString(),
  marca: auto.marca,
  modelo: auto.modelo,
  año: auto.año,
  patente: auto.patente,
  color: auto.color,
  numeroChasis: auto.numeroChasis,
  motor: auto.motor,
});

// Auto Firebase a Mongo
export const firebaseToAuto = (firebaseAuto: FirebaseAuto, dueñoId: ObjectId): Auto => ({
  _id: new ObjectId(firebaseAuto._id),
  marca: firebaseAuto.marca,
  modelo: firebaseAuto.modelo,
  año: firebaseAuto.año,
  patente: firebaseAuto.patente,
  color: firebaseAuto.color,
  numeroChasis: firebaseAuto.numeroChasis,
  motor: firebaseAuto.motor,
  dueñoId,
});

// Persona Mongo a Firebase
export const personaToFirebase = (persona: Persona): FirebasePersona => ({
  nombre: persona.nombre,
  apellido: persona.apellido,
  dni: persona.dni,
  fechaNacimiento: new Date(persona.fechaNacimiento).toISOString(),
  genero: persona.genero,
  donante: persona.donante,
  autos: persona.autos.map(autoToFirebase),
});

// Persona Firebase a Mongo
export const firebaseToPersona = (firebasePersona: FirebasePersona, id: string): Persona => {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }

  const _id = new ObjectId(id);

  if (typeof firebasePersona.fechaNacimiento !== "string") {
    throw new Error("fechaNacimiento debe ser un string");
  }

  return {
    _id,
    nombre: firebasePersona.nombre,
    apellido: firebasePersona.apellido,
    dni: firebasePersona.dni,
    fechaNacimiento: firebasePersona.fechaNacimiento,
    genero: firebasePersona.genero as Genero,
    donante: firebasePersona.donante,
    autos: firebasePersona.autos.map(auto => firebaseToAuto(auto, _id)),
  };
};
