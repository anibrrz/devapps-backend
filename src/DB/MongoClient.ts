import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// URI y nombre de la base de datos desde .env, con valores por defecto
const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const dbName = process.env.DB_NAME ?? "mi_basededatos";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Conecta a MongoDB y devuelve la instancia de base de datos
 */
export const connectToMongo = async (): Promise<Db> => {
  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log(`Conectado a MongoDB: ${dbName}`);
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
      throw error;
    }
  }
  return db!;
};

/**
 * Devuelve la instancia actual de la base de datos, si ya se conectó
 */
export const getMongoDb = (): Db => {
  if (!db) {
    throw new Error("Debes conectar primero a MongoDB con connectToMongo()");
  }
  return db;
};
