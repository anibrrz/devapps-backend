import { IAutoRepository } from "../IAutoRepository";
import { firestore } from "../../DB/Firebase";
import { ObjectId } from "mongodb";
import { FieldValue } from "firebase-admin/firestore";
import { Auto } from "../../models/Auto";
import { FirebasePersona } from "../../models/Persona";
import { autoToFirebase, firebaseToAuto, isValidObjectId } from "./firebaseMappers";

export class AutoFirebaseRepository implements IAutoRepository {
    private readonly collection = firestore.collection("personas");

    async findAll(): Promise<Auto[]> {
        const snapshot = await this.collection.get();
        const autos: Auto[] = [];

        snapshot.forEach(doc => {
            if (!isValidObjectId(doc.id)) return;

            const personaId = new ObjectId(doc.id);
            const data = doc.data() as FirebasePersona;

            if (Array.isArray(data.autos)) {
                data.autos.forEach(auto => {
                    autos.push(firebaseToAuto(auto, personaId));
                });
            }
        });

        return autos;
    }

    async findById(id: string): Promise<Auto | undefined> {
        const autoIdStr = new ObjectId(id).toHexString();
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            if (!isValidObjectId(doc.id)) continue;

            const personaId = new ObjectId(doc.id);
            const data = doc.data() as FirebasePersona;

            const match = data.autos.find(auto => auto._id === autoIdStr);
            if (match) return firebaseToAuto(match, personaId);
        }

        return undefined;
    }

    async save(): Promise<void> {
        throw new Error("Usá saveWithOwner(idPersona, auto).");
    }

    async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
        if (!isValidObjectId(idPersona)) return false;

        const docRef = this.collection.doc(idPersona);
        const doc = await docRef.get();
        if (!doc.exists) return false;

        const autoFirebase = autoToFirebase(auto);
        await docRef.update({
            autos: FieldValue.arrayUnion(autoFirebase),
        });

        return true;
    }

    async update(id: string, data: Partial<Auto>): Promise<boolean> {
        const autoIdStr = new ObjectId(id).toHexString();
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            if (!isValidObjectId(doc.id)) continue;

            const personaId = new ObjectId(doc.id);
            const persona = doc.data() as FirebasePersona;
            const autos = persona.autos ?? [];

            const index = autos.findIndex(auto => auto._id === autoIdStr);
            if (index !== -1) {
                const originalAuto = firebaseToAuto(autos[index], personaId);

                const mergedAuto: Auto = {
                    ...originalAuto,
                    ...data,
                    _id: new ObjectId(autoIdStr),
                    dueñoId: personaId,
                };

                const updatedAuto = autoToFirebase(mergedAuto);

                const updatedAutos = [...autos];
                updatedAutos[index] = updatedAuto;

                await this.collection.doc(doc.id).update({ autos: updatedAutos });
                return true;
            }
        }

        return false;
    }

    async delete(id: string): Promise<boolean> {
        const autoIdStr = new ObjectId(id).toHexString();
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            if (!isValidObjectId(doc.id)) continue;

            const persona = doc.data() as FirebasePersona;
            const autos = persona.autos ?? [];

            const updatedAutos = autos.filter(auto => auto._id !== autoIdStr);

            if (updatedAutos.length !== autos.length) {
                await this.collection.doc(doc.id).update({ autos: updatedAutos });
                return true;
            }
        }

        return false;
    }

    async findByFullMatch(idPersona: string, data: Omit<Auto, "_id" | "dueñoId">): Promise<Auto | undefined> {
        if (!isValidObjectId(idPersona)) return undefined;

        const doc = await this.collection.doc(idPersona).get();
        if (!doc.exists) return undefined;

        const persona = doc.data() as FirebasePersona;
        const match = persona.autos?.find(auto =>
            auto.marca === data.marca &&
            auto.modelo === data.modelo &&
            auto.año === data.año &&
            auto.patente === data.patente &&
            auto.color === data.color &&
            auto.numeroChasis === data.numeroChasis &&
            auto.motor === data.motor
        );

        return match ? firebaseToAuto(match, new ObjectId(idPersona)) : undefined;
    }
}
