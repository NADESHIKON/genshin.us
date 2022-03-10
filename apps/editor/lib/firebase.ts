import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            }),
            databaseURL: "https://genshin-us-realtime.firebaseio.com/"
        });
    } catch (error) {
        /*
         * We skip the "already exists" message which is
         * not an actual error when we're hot-reloading.
         */
        if (!/already exists/u.test(error.message)) {
            // eslint-disable-next-line no-console
            console.error("Firebase admin initialization error", error.stack);
        }
    }
}
export const firestore = admin.firestore();
export const firebase = admin.database();
