// import * as firebase from 'firebase';
import firebase from 'firebase/app'
require('firebase/auth');



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDs6TpL9jLUjBIN0YtTfmVeQ9ltmXPWP4M",
    authDomain: "nile-ba048.firebaseapp.com",
    projectId: "nile-ba048",
    storageBucket: "nile-ba048.appspot.com",
    messagingSenderId: "371282740835",
    appId: "1:371282740835:web:aade9ba250bd8265219a56"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


export const auth=firebase.auth();
export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();