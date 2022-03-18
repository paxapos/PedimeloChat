const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

class app {
    db;
    app;

    init() {
        this.app = initializeApp({
            credentials: applicationDefault(),
        });
        this.db = getFirestore(this.app);
    }

    readyToRun() {
        return Boolean(this.db && this.app);
    }

    noInicializadoError() {
        console.error(
            "PedimeloChat no fue inicializado todavia, por favor inicializalo primero"
        );
    }

    noDataError() {
        console.error(
            "Checkea personalmente el documento porque no cuenta con datos, probablemente convenga borrarlo y volver a intentarlo"
        );
    }

    async sendMessage(msg, origen) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }
        const colID = msg.tenant;
        const docID = msg.firebase_id;

        let ref = this.db.collection(colID).doc(docID);
        if (!ref) return false;

        const doc = await ref.get();
        if (doc.exists) {
            const data = doc.data();
            if (!data) {
                this.noDataError();
                return false;
            }

            await this.db
                .collection(colID)
                .doc(docID)
                .update({
                    mensajes: [
                        ...data.mensajes,
                        {
                            event: msg.event,
                            datetime: Timestamp.now(),
                            payload: msg.payload,
                            origen: origen,
                        },
                    ],
                });
            return true;
        }
        await this.db
            .collection(colID)
            .doc(docID)
            .set({
                mensajes: [
                    {
                        event: msg.event,
                        datetime: Timestamp.now(),
                        payload: msg.payload,
                        origen: origen,
                    },
                ],
            });
        return true;
    }

    async getMessages(user_id, tenant) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }

        const doc = await this.db.collection(tenant).doc(user_id).get();
        if (doc.exists) {
            const data = doc.data();
            if (!data) {
                this.noDataError();
                return false;
            }
            return data.mensajes;
        }

        return false;
    }
}

const pedimeloChat = new app();
exports.pedimeloChat = pedimeloChat;
