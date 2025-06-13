import { IAutoRepository } from "../IAutoRepository";
import { firestore } from "../../DB/Firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Auto } from "../../models/Auto";

export class AutoFirebaseRepository implements IAutoRepository {
    private readonly collection = firestore.collection("personas");

    async findAll(): Promise<Auto[]> {
        const snapshot = await this.collection.get();
        const autos: Auto[] = [];

        snapshot.forEach(doc => {
            const personaId = doc.id;
            const data = doc.data();

            if (Array.isArray(data.autos)) {
                data.autos.forEach(auto => {
                    autos.push({ ...auto, dueñoId: personaId });
                });
            }
        });

        return autos;
    }

    async findById(id: string): Promise<Auto | undefined> {
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            const personaId = doc.id;
            const autos = doc.data().autos ?? [];

            const match = autos?.find((auto: Auto) => auto._id === id);
            if (match) return { ...match, dueñoId: personaId };
        }

        return undefined;
    }

    async save(): Promise<void> {
        throw new Error("Usá saveWithOwner(idPersona, auto).");
    }

    async saveWithOwner(idPersona: string, auto: Auto): Promise<boolean> {
        const docRef = this.collection.doc(idPersona);
        const doc = await docRef.get();
        if (!doc.exists) return false;

        const persona = doc.data();
    const autos: Auto[] = Array.isArray(persona?.autos) ? persona.autos : [];

    const existe = autos.some(a =>
        a.marca === auto.marca &&
        a.modelo === auto.modelo &&
        a.año === auto.año &&
        a.patente === auto.patente &&
        a.color === auto.color &&
        a.numeroChasis === auto.numeroChasis &&
        a.motor === auto.motor
    );

    if (existe) return false;

    await docRef.update({
        autos: FieldValue.arrayUnion(auto)
    });

    return true;
    }

    async update(id: string, data: Partial<Auto>): Promise<boolean> {
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            const personaId = doc.id;
            const autos = doc.data().autos ?? [];

            const index = autos.findIndex((auto: Auto) => auto._id === id);
            if (index !== -1) {
                const updatedAuto = { ...autos[index], ...data };
                const newAutos = [...autos];
                newAutos[index] = updatedAuto;

                await this.collection.doc(personaId).update({ autos: newAutos });
                return true;
            }
        }

        return false;
    }

    async delete(id: string): Promise<boolean> {
        const snapshot = await this.collection.get();

        for (const doc of snapshot.docs) {
            const autos = doc.data().autos ?? [];

            const updatedAutos = autos.filter((auto: Auto) => auto._id !== id);
            if (updatedAutos.length !== autos.length) {
                await this.collection.doc(doc.id).update({ autos: updatedAutos });
                return true;
            }
        }

        return false;
    }
}
