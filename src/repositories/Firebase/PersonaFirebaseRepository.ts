import { IPersonaRepository } from "../IPersonaRepository";
import { Persona } from "../../models/Persona";
import { firestore } from "../../DB/Firebase";

function normalizePersona(doc: FirebaseFirestore.DocumentSnapshot): Persona {
    const data = doc.data();

    if (!data) {
        throw new Error("Documento vacío o no encontrado");
    }

    const fecha = data.fechaNacimiento;

    return {
        _id: doc.id,
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        genero: data.genero,
        donante: data.donante,
        autos: data.autos ?? [],
        fechaNacimiento: typeof fecha === "string"
            ? fecha
            : fecha.toDate().toISOString().split("T")[0]
    };
}

export class PersonaFirebaseRepository implements IPersonaRepository {
    private readonly collection = firestore.collection("personas");

    async findAll(): Promise<Persona[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(normalizePersona);
    }

    async findById(id: string): Promise<Persona | undefined> {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return undefined;
        return normalizePersona(doc);
    }

    async save(persona: Persona): Promise<void> {
        await this.collection.doc(persona._id).set({
            ...persona,
            fechaNacimiento: typeof persona.fechaNacimiento === "string"
                ? persona.fechaNacimiento
                : new Date(persona.fechaNacimiento).toISOString().split("T")[0]
        });
    }

    async update(id: string, entity: Partial<Persona>): Promise<boolean> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return false;
        await docRef.update({
            ...entity,
            fechaNacimiento: entity.fechaNacimiento && typeof entity.fechaNacimiento !== "string"
                ? new Date(entity.fechaNacimiento).toISOString().split("T")[0]
                : entity.fechaNacimiento
        });

        return true;
    }

    async delete(id: string): Promise<boolean> {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return false;
        await docRef.delete();
        return true;
    }

    async findByFullMatch(data: Omit<Persona, "_id" | "autos">): Promise<Persona | undefined> {
        const snapshot = await this.collection
            .where("nombre", "==", data.nombre)
            .where("apellido", "==", data.apellido)
            .where("dni", "==", data.dni)
            .where("genero", "==", data.genero)
            .where("donante", "==", data.donante)
            .where("fechaNacimiento", "==", data.fechaNacimiento)
            .limit(1)
            .get();

        if (snapshot.empty) return undefined;

        const doc = snapshot.docs[0];
        return {
            _id: doc.id,
            ...doc.data()
        } as Persona;
    }
}
