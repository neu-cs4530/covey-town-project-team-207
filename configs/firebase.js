import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configure and initialize firebase
const firebaseConfig = {
    apiKey: "AIzaSyAmWNt6lQLN61lwKGJCtR5x8mIHJz8CVoU",
    authDomain: "covey-town-207.firebaseapp.com",
    projectId: "covey-town-207",
    storageBucket: "covey-town-207.appspot.com",
    messagingSenderId: "81906889675",
    appId: "1:81906889675:web:1e019a298518a00f777c4e",
};

firebase.initializeApp(firebaseConfig);

export default firebase;