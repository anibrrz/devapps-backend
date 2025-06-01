import { ObjectId } from "mongodb";

export interface Auto {
  _id: ObjectId;
  marca: string;
  modelo: string;
  año: number;
  patente: string;
  color: string;
  numeroChasis: string;
  motor: string;
  dueñoId: ObjectId;
}

export interface FirebaseAuto {
  _id: string;
  marca: string;
  modelo: string;
  año: number;
  patente: string;
  color: string;
  numeroChasis: string;
  motor: string;
}
