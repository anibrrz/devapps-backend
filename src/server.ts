// Importamos nuestras dependencias
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import process from 'process';
import { personas } from './Data';

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

//Browse personas
app.get('/personas', (req, res) => {
  res.status(200).json(
    personas.map((p) => ({ ID: p.id, Nombre: p.nombre, Apellido: p.apellido, DNI: p.dni })));
});

//Browse autos
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

//Read entidad
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

//Add entidad TO DO
app.post('/:entidad', req, res) => {
    const { entidad } = req.params;
    const datos = req.body;

    if (!['personas', 'autos'].includes(entidad)) {
        res.status(400).json({ mensaje: 'Tipo de entidad inválido' });
        return;
    }
    if (entidad === 'personas') {
        const { nombre, apellido, dni, fechaNacimiento, genero, donante } = datos;
        if (!nombre || !apellido || !dni || !fechaNacimiento || !genero || donante === undefined) {
            res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
            return;
        }
    const nuevaPersona = {
        id: (personas.length + 1).toString(),
        nombre,
        apellido,
        dni,
        fechaNacimiento: new Date(fechaNacimiento),
        genero,
        donante,
        autos: []
    }

    personas.push(nuevaPersona);

    res.status(200).json({ mensaje: 'Persona creada', id: nuevaPersona.id });

};

// Levantamos el servidor en el puerto que configuramos
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
