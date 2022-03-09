const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

class app {
    db;
    app;

    init(credentials) {
        (this.app = initializeApp(credentials.app)), (this.db = getFirestore());
    }

    readyToRun() {
        return Boolean(this.db && this.app);
    }

    noInicializadoError() {
        console.error(
            "PedimeloChat no fue inicializado todavia, por favor inicializalo primero"
        );
    }

    async sendMessage(msg) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }

        let ref = this.db.collection("messages").doc(msg.firebase_id);
        if (!ref) return false;

        const doc = await ref.get();
        if (doc.exists) {
            const data = doc.data();
            if (!data) {
                console.error(`Checkea personalmente el documento ${msg.firebase_id} porque no cuenta con datos, probablemente convenga borrarlo y volver a intentarlo`);
                return false;
            }

            await this.db
                .collection("messages")
                .doc(msg.firebase_id)
                .update({
                    mensajes: [
                        ...data.mensajes,
                        {
                            event: msg.event,
                            datetime: Timestamp.now(),
                            payload: msg.payload,
                        },
                    ],
                });
            return true;
        }
        await this.db
            .collection("messages")
            .doc(msg.firebase_id)
            .set({
                mensajes: [
                    {
                        event: msg.event,
                        datetime: Timestamp.now(),
                        payload: msg.payload,
                    },
                ],
            });
        return true;
    }

    async getMessages(user_id) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }
        const data = await this.db.collection("messages").doc(user_id).get();
        return data;
    }
}

const pedimeloChat = new app();
exports.pedimeloChat = pedimeloChat;
