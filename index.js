const {
    initializeApp,
} = require("firebase-admin/app");
const {
    getFirestore,
    Timestamp,
} = require("firebase-admin/firestore");

class app {

    db;
    app;

    init(credentials){
        this.app = initializeApp(credentials.app),
        this.db = getFirestore();
    }

    readyToRun() {
        return Boolean(this.db && this.app);
    }

    sendMessage(msg) {
        if (!this.readyToRun()) {
            console.error("Firebase not ready to run yet, please initialize first");
            return;
        }
        this.db.collection("messages").add({
            firebase_id: msg.firebase_id,
            data: {
                ...msg.data,
                datetime: Timestamp.now()

            }
        });
    }

    getMessages(user_id, limit = 10) {
        if (!this.readyToRun()) {
            console.error("Firebase not ready to run yet, please initialize first");
            return;
        }
        return this.db.collection("messages").where("firebase_id", "==", user_id).orderBy("datetime", "desc").limit(limit).get();
    }

}

const pedimeloChat = new app();
export default pedimeloChat;