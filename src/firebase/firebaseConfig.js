import store from '../store'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/analytics'

// firebase init goes here
const config = {
    apiKey: "AIzaSyDjPXpgjFJAZ2nnGTxqWkPvDdTOMzHqH7s",
    authDomain: "alinouskigitpages.firebaseapp.com",
    databaseURL: "https://alinouskigitpages.firebaseio.com",
    projectId: "alinouskigitpages",
    storageBucket: "alinouskigitpages.appspot.com",
    messagingSenderId: "1097467939204",
    appId: "1:1097467939204:web:565d4e6ce213ea2f",
    measurementId: "G-CMCVQFCJ87"
}


const app = firebase.initializeApp(config)
export const db = app.firestore()

let analytics = null
let analyticsReady = Promise.resolve(null)

if (config.appId && config.measurementId && firebase.analytics && firebase.analytics.isSupported) {
    analyticsReady = firebase.analytics.isSupported().then((isSupported) => {
        if (isSupported) {
            analytics = app.analytics()
        }

        return analytics
    })
}

export const logPageView = (route) => {
    if (!config.appId || !config.measurementId) {
        return
    }

    analyticsReady.then((analyticsInstance) => {
        if (!analyticsInstance) {
            return
        }

        analyticsInstance.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: route.fullPath
        })
    })
}

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
