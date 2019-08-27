import store from '../store'
import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: "AIzaSyDjPXpgjFJAZ2nnGTxqWkPvDdTOMzHqH7s",
    authDomain: "alinouskigitpages.firebaseapp.com",
    databaseURL: "https://alinouskigitpages.firebaseio.com",
    projectId: "alinouskigitpages",
    storageBucket: "alinouskigitpages.appspot.com",
    messagingSenderId: "1097467939204"
}


const app = firebase.initializeApp(config)
export const db = app.firestore()

/*firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const gamesCollection = db.collection('games')
export {
    db,
    auth,
    currentUser,
    gamesCollection
}*/