import admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// Ruta absoluta al archivo de credenciales
const serviceAccountPath = path.resolve(
  __dirname,
  "../../",
  process.env.FIREBASE_CREDENTIALS as string
);

// Cargar y parsear el archivo JSON
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = admin.firestore();
