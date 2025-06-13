import { Genero, Persona } from "../models/Persona";

export const personas: Persona[] = [
  {
    _id: "1",
    nombre: "Jungkook",
    apellido: "Jeon",
    dni: "12345678",
    fechaNacimiento: "1997-09-01",
    genero: Genero.Masculino,
    donante: true,
    autos: [
      {
        _id: "1",
        marca: "Toyota",
        modelo: "Corolla",
        año: 2020,
        patente: "ABC123",
        color: "Rojo",
        numeroChasis: "CHS123456",
        motor: "MTR654321",
        dueñoId: "1"
      },
      {
        _id: "2",
        marca: "Ford",
        modelo: "Fiesta",
        año: 2018,
        patente: "XYZ789",
        color: "Azul",
        numeroChasis: "CHS987654",
        motor: "MTR321654",
        dueñoId: "1",
      },
    ],
  },
  {
    _id: "2",
    nombre: "Namjoon",
    apellido: "Kim",
    dni: "87654321",
    fechaNacimiento: "1994-09-12",
    genero: Genero.Masculino,
    donante: true,
    autos: [],
  },
  {
    _id:"3",
    nombre: "Hoseok",
    apellido: "Jung",
    dni: "11223344",
    fechaNacimiento: "1994-02-18",
    genero: Genero.Masculino,
    donante: true,
    autos: [
      {
        _id: "3",
        marca: "Chevrolet",
        modelo: "Onix",
        año: 2022,
        patente: "LMN456",
        color: "Negro",
        numeroChasis: "CHS456123",
        motor: "MTR789654",
        dueñoId: "3",
      },
    ],
  },
];
