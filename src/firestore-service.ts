import { Firestore, Settings } from "@google-cloud/firestore";
import type { IFirestoreEvent } from "./types/protos.js";

export class FirestoreService {

    private db: Firestore;


    /**
     * Initializes the FirestoreService with optional settings.
    * @param settings - Optional Firestore settings.
    */
    constructor(settings?: Settings) {
        this.db = new Firestore(settings);
    }

    async readDocument(document: IFirestoreEvent): Promise<any> {
        const { id, type, database, collection, document: doc } = document;

        try {
            const docRef = this.db.collection(collection).doc(doc);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                console.log(`Documento lido com sucesso`);
                return docSnapshot.data();
            } else {
                console.log(`Documento não encontrado com ID: ${doc}`);
            }
        } catch (error) {
            console.error('Erro ao ler documento do Firestore:', error);
        }
    }
}