// Importamos nuestras dependencias
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import process from 'process';
import { personas } from './Data';
import { Auto } from './models/Auto';
import { v4 as uuidv4 } from 'uuid';

// Creamos nuestra app express
const app = express();
// Leemos el puerto de las variables de entorno, si no está, usamos uno por default
const port = process.env.PORT || 9000;

// Configuramos los plugins
// Más adelante intentaremos entender mejor cómo funcionan estos plugins
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Mis endpoints van acá
app.get('/', (req, res) => {
    console.log(req.body);

    res.json('Hello world');
});

// Browse personas
app.get('/personas', (req, res) => {
    res.status(200).json(
        personas.map((p) => ({ ID: p.id, Nombre: p.nombre, Apellido: p.apellido, DNI: p.dni })));
});

// Browse autos
app.get('/autos', (req, res) => {
    const idPersona = req.query.id ? req.query.id : null;

    if (idPersona) {
        const persona = personas.find(p => p.id === idPersona);

        if (!persona) {
            res.status(404).json({ mensaje: 'Persona no encontrada' });
            return;
        }

        const listaDeAutos = persona.autos.map(({ id, marca, modelo, año, patente }) => ({
            id,
            marca,
            modelo,
            año,
            patente
        }));

        res.status(200).json({ listaDeAutos });
        return;
    }

    const todosLosAutos = personas.flatMap(p =>
        p.autos.map(({ id, marca, modelo, año, patente }) => ({
            id,
            marca,
            modelo,
            año,
            patente
        }))
    );

    res.status(200).json({ todosLosAutos });
});

// Read entidad
app.get('/:entidad/:id', (req, res) => {
    const { entidad, id } = req.params;

    if (!['personas', 'autos'].includes(entidad)) {
        res.status(400).json({ mensaje: 'Entidad inválida' });
        return;
    }

    if (entidad === 'personas') {
        const persona = personas.find(p => p.id === id);
        if (!persona) {
            res.status(404).json({ mensaje: 'Persona no encontrada' });
            return;
        }
        res.status(200).json(persona);
        return;
    }

    if (entidad === 'autos') {
        const autoEncontrado = personas.flatMap(p => p.autos.map(auto => ({ ...auto, propietario: p.nombre })))
            .find(a => a.id === id);

        if (!autoEncontrado) {
            res.status(404).json({ mensaje: 'Auto no encontrado' });
            return;
        }

        res.status(200).json(autoEncontrado);
        return;
    }
});

// Edit entidad
app.put('/:entidad/:id', (req, res) => {
    const { entidad, id } = req.params;
    const datos = req.body;
  
    if (!['personas', 'autos'].includes(entidad)) {
      res.status(400).json({ mensaje: "Entidad inválida" });
      return;
    }
  
    if (entidad === 'personas') {
      const persona = personas.find(p => p.id === id);
      if (!persona) {
        res.status(404).json({ mensaje: "Persona no encontrada" });
        return;
      }
  
      const { nombre, apellido, dni, fechaNacimiento, genero, donante } = datos;
  
      if ('nombre' in datos && typeof nombre !== 'string') {
        res.status(400).json({ mensaje: "Nombre inválido" });
        return;
      }
  
      if ('apellido' in datos && typeof apellido !== 'string') {
        res.status(400).json({ mensaje: "Apellido inválido" });
        return;
      }
  
      if ('dni' in datos && (typeof dni !== 'string' || !/^\d+$/.test(dni))) {
        res.status(400).json({ mensaje: "DNI inválido" });
        return;
      }
  
      if ('fechaNacimiento' in datos && isNaN(Date.parse(fechaNacimiento))) {
        res.status(400).json({ mensaje: "Fecha de nacimiento inválida" });
        return;
      }
  
      if ('genero' in datos && typeof genero !== 'string') {
        res.status(400).json({ mensaje: "Género inválido" });
        return;
      }
  
      if ('donante' in datos && typeof donante !== 'boolean') {
        res.status(400).json({ mensaje: "Donante debe ser booleano" });
        return;
      }
  
      if ('nombre' in datos) persona.nombre = nombre;
      if ('apellido' in datos) persona.apellido = apellido;
      if ('dni' in datos) persona.dni = dni;
      if ('fechaNacimiento' in datos) persona.fechaNacimiento = new Date(fechaNacimiento);
      if ('genero' in datos) persona.genero = genero;
      if ('donante' in datos) persona.donante = donante;
  
      res.sendStatus(201);
      return;
    }

    if (entidad === 'autos') {
      const { marca, modelo, año, patente, color, numeroChasis, motor } = datos;
  
      for (const persona of personas) {
        const auto = persona.autos.find(a => a.id === id);
        if (auto) {
          if ('marca' in datos && typeof marca !== 'string') {
            res.status(400).json({ mensaje: "Marca inválida" });
            return;
          }
  
          if ('modelo' in datos && typeof modelo !== 'string') {
            res.status(400).json({ mensaje: "Modelo inválido" });
            return;
          }
  
          if ('año' in datos && (typeof año !== 'number')) {
            res.status(400).json({ mensaje: "Año inválido" });
            return;
          }
  
          if ('patente' in datos && typeof patente !== 'string') {
            res.status(400).json({ mensaje: "Patente inválida" });
            return;
          }
  
          if ('color' in datos && typeof color !== 'string') {
            res.status(400).json({ mensaje: "Color inválido" });
            return;
          }
  
          if ('numeroChasis' in datos && typeof numeroChasis !== 'string') {
            res.status(400).json({ mensaje: "Número de chasis inválido" });
            return;
          }
  
          if ('motor' in datos && typeof motor !== 'string') {
            res.status(400).json({ mensaje: "Motor inválido" });
            return;
          }
  
          if ('marca' in datos) auto.marca = marca;
          if ('modelo' in datos) auto.modelo = modelo;
          if ('año' in datos) auto.año = año;
          if ('patente' in datos) auto.patente = patente;
          if ('color' in datos) auto.color = color;
          if ('numeroChasis' in datos) auto.numeroChasis = numeroChasis;
          if ('motor' in datos) auto.motor = motor;
  
          res.sendStatus(201);
          return;
        }
      }
  
      res.status(404).json({ mensaje: "Auto no encontrado" });
      return;
    }
  });

// Add entidad
app.post('/:entidad', (req, res) => {
    const { entidad } = req.params;
    const datos = req.body;

    if (!['personas', 'autos'].includes(entidad)) {
        res.status(400).json({ mensaje: "Entidad inválida" });
        return;
    }

    if (entidad === 'personas') {
        const { nombre, apellido, dni, fechaNacimiento, genero, donante } = datos;
        if (!nombre || !apellido || !dni || !fechaNacimiento || !genero || donante === undefined) {
            res.status(400).json({ mensaje: "Faltan datos obligatorios" });
            return;
        }

        const nuevaPersona = {
            id: uuidv4(),
            nombre,
            apellido,
            dni,
            fechaNacimiento: new Date(fechaNacimiento),
            genero,
            donante,
            autos: []
        };

        personas.push(nuevaPersona);

        res.status(200).json({ mensaje: "Persona creada", id: nuevaPersona.id });
        return;
    }

    if (entidad === 'autos') {
        const { idPersona, marca, modelo, año, patente, color, numeroChasis, motor } = datos;

        if (!idPersona || !marca || !modelo || !año || !patente || !color || !numeroChasis || !motor) {
            res.status(400).json({ mensaje: "Faltan datos obligatorios" });
            return;
        }

        const propietario = personas.find(p => p.id === idPersona);
        if (!propietario) {
            res.status(404).json({ mensaje: "Persona no encontrada para asignar el auto" });
            return;
        }

        const nuevoAuto: Auto = {
            id: uuidv4(),
            marca,
            modelo,
            año,
            patente,
            color,
            numeroChasis,
            motor
        };

        propietario.autos.push(nuevoAuto);

        res.status(200).json({ mensaje: "Auto creado", id: nuevoAuto.id });
        return;
    }
});

// Delete entidad
app.delete('/:entidad/:id', (req, res) => {
    const { entidad, id } = req.params;

    if (!['personas', 'autos'].includes(entidad)) {
        res.status(400).json({ mensaje: "Entidad inválida" });
        return;
    }

    if (entidad === 'personas') {
        const index = personas.findIndex(p => p.id === id);
        if (index === -1) {
            res.status(404).json({ mensaje: "Persona no encontrada" });
            return;
        }

        personas.splice(index, 1);
        res.sendStatus(201);
        return;
    }

    if (entidad === 'autos') {
        for (const persona of personas) {
            const indexAuto = persona.autos.findIndex(a => a.id === id);
            if (indexAuto !== -1) {
                persona.autos.splice(indexAuto, 1);
                res.sendStatus(201);
                return;
            }
        }

        res.status(404).json({ mensaje: "Auto no encontrado" });
        return;
    }
});

// Levantamos el servidor en el puerto que configuramos
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
