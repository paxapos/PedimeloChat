const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

class app {
    db;
    app;

    init(credentials) {
        (this.app = initializeApp(credentials.app)), (this.db = getFirestore(this.app));
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
                this.noDataError();
                return false;
            }

            await this.db
                .collection("messages")
                .doc(msg.pedido_id)
                .update({
                    mensajes: [
                        ...data.mensajes,
                        {
                            event: msg.event,
                            datetime: Timestamp.now(),
                            payload: msg.payload,
                            origen: msg.origen,
                        },
                    ],
                });
            return true;
        }
        await this.db
            .collection("messages")
            .doc(msg.pedido_id)
            .set({
                mensajes: [
                    {
                        event: msg.event,
                        datetime: Timestamp.now(),
                        payload: msg.payload,
                        origen: msg.origen,
                    },
                ],
            });
        return true;
    }

    addUser(user_id, pedido_id) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }
        const user = await this.db.collection("users").doc(user_id).get();

        if (user.exists) {
            const userData = user.data();
            await this.db
                .collection("users")
                .doc(user_id)
                .update({
                    pedidos: [...userData.pedidos, pedido_id],
                });
            return true;
        }

        await this.db
            .collection("users")
            .doc(user_id)
            .set({
                pedidos: [pedido_id],
            });
        return true;
    }

    getPedidos(user_id) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }

        const user = await this.db.collection("users").doc(user_id).get();

        if (user.exists) {
            const userData = user.data();
            return userData.pedidos;
        }

        return false;
    }

    async getMessages(user_id) {
        if (!this.readyToRun()) {
            this.noInicializadoError();
            return false;
        }

        const user_pedidos = await this.getPedidos(user_id); // hacer que busque en la base de datos las id de los pedidos del usuario
        const mensajes = [];

        user_pedidos.forEach(async (pedido_id) => {

            const doc = await this.db
                .collection("messages")
                .doc(pedido_id)
                .get();
            if (doc.exists) {

                const data = doc.data();
                if (!data) {
                    this.noDataError();
                    return false;
                }
                mensajes.push(data.mensajes);

            }

        });
        
        return mensajes.flat();
    }
}

const pedimeloChat = new app();
exports.pedimeloChat = pedimeloChat;
