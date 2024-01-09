import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCuwttjCuFbT25xJHfpQYgFYH4jCYDSkU4",
  authDomain: "instagram-54e01.firebaseapp.com",
  projectId: "instagram-54e01",
  storageBucket: "instagram-54e01.appspot.com",
  messagingSenderId: "815614966327",
  appId: "1:815614966327:web:77d609db2d833a21c4ddb2",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };
