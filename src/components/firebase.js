import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyD5qhmThEfnHuFqDZ472RGJiwaq-r9bCos",
    authDomain: "drinks-app-c5338.firebaseapp.com",
    databaseURL: "https://drinks-app-c5338.firebaseio.com",
    projectId: "drinks-app-c5338",
    storageBucket: "drinks-app-c5338.appspot.com",
    messagingSenderId: "925541766596"
  };
  firebase.initializeApp(config);

  export default firebase;