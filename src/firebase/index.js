/**
 * Firebase Login
 * Reactify comes with built in firebase login feature
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from 'firebase';

// Initialize Firebase 
{/* const config = {
    apiKey: "AIzaSyD_2FLh1f_BJyKdzeqMvF-oB9Av2cLG6ps", // Your Api key will be here
    authDomain: "reactify-61b82.firebaseapp.com", // Your auth domain
    databaseURL: "https://reactify-61b82.firebaseio.com", // data base url
    projectId: "reactify-61b82", // project id
    storageBucket: "", // storage bucket
    messagingSenderId: "598228895769" // messaging sender id
}; */}

const config = {
    apiKey: "AIzaSyAZzlZt6bnj5G10PCmMm6aHxjxPj9Whvhk",
    authDomain: "zacbrowser-59f15.firebaseapp.com",
    databaseURL: "https://zacbrowser-59f15.firebaseio.com",
    projectId: "zacbrowser-59f15",
    storageBucket: "zacbrowser-59f15.appspot.com",
    messagingSenderId: "535899886741"
  };

firebase.initializeApp(config);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();

export {
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    database
};
