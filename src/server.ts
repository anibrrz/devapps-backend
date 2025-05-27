// Importamos nuestras dependencias
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import process from 'process';
import router from './routes';
import { connectToMongo } from './DB/MongoClient';

// Creamos nuestra app express
const app = express();
// Leemos el puerto de las variables de entorno, si no está, usamos uno por default
const port = process.env.PORT || 9000;

// Configuramos los plugins
// Más adelante intentaremos entender mejor cómo funcionan estos plugins
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/', router);

// Levantamos el servidor en el puerto que configuramos
connectToMongo()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar el servidor por un error de conexión a MongoDB:", error);
    process.exit(1); // termina la app si no se puede conectar
  });
