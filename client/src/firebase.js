import firebase from 'firebase/app'
// import firebase from 'firebase'
require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCoi-6jZdg56SXgkZts9WYqtCOS-hBEsjA",
  authDomain: "spare-sales.firebaseapp.com",
  projectId: "spare-sales",
  storageBucket: "spare-sales.appspot.com",
  messagingSenderId: "282896711565",
  appId: "1:282896711565:web:c031bb2cb7cee07a2207c4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//exports
export const auth=firebase.auth();
// export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();
export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();