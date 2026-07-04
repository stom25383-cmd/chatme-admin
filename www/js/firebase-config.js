/* ============================================================
   FIREBASE CONFIG (Admin APK)
   MUST point to the SAME Firebase project as chatme-app so it
   reads the same /accounts, /adminAlerts, /blacklist nodes.

   >>> Sufiyan: paste the identical config values from
   >>> chatme-app/www/js/firebase-config.js here. <<<
   ============================================================ */

const CM_FIREBASE_CONFIG = {
    apiKey: "REPLACE_ME",
    authDomain: "REPLACE_ME.firebaseapp.com",
    databaseURL: "https://REPLACE_ME-default-rtdb.firebaseio.com",
    projectId: "REPLACE_ME",
    storageBucket: "REPLACE_ME.appspot.com",
    messagingSenderId: "REPLACE_ME",
    appId: "REPLACE_ME"
};

firebase.initializeApp(CM_FIREBASE_CONFIG);
const cmDb = firebase.database();
