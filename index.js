const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

class app {
    db;
    app;
    logger;

    init(logger) {
        
        if (logger) this.logger = logger;

        try {
            this.app = initializeApp({
                credentials: applicationDefault(),
            });
            this.db = getFirestore(this.app);
        }
        catch (e){
            console.error("No se pudo inicializar el servicio de Firebase", e);
            if (this.logger) this.logger.error(`No se pudo inicializar el servicio de Firebase ${e}`);
        }
    }

    readyToRun() {
        return Boolean(this.db && this.app);
    }

    noInicializadoError() {
        console.error(
            "PedimeloChat no fue inicializado todavia, por favor inicializalo primero"
        );
        if (this.logger) this.logger.error(`PedimeloChat no fue inicializado todavia, por favor inicializalo primero`);
    }

    noDataError() {
        console.error(
            "Checkea personalmente el documento porque no cuenta con datos, probablemente convenga borrarlo y volver a intentarlo"
        );
        if (this.logger) this.logger.error(`Checkea personalmente el documento porque no cuenta con datos, probablemente convenga borrarlo y volver a intentarlo`);
    }

    async sendMessage(msg, origen) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }
        const docID = msg.tenant;
        const colID = msg.firebase_id;

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

        const doc = await this.db.collection(user_id).doc(tenant).get();
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
