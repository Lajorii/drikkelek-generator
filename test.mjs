// Import the functions you need from the SDKs you need
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js"  // "firebase/app"
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    query,
    where,
    addDoc
} from  "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"  //  "firebase/firestore/lite"
 
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAe2WOCWcQphx_-0q9XWH2j58uZvoqR6ko",
    authDomain: "sang-generator.firebaseapp.com",
    projectId: "sang-generator",
    storageBucket: "sang-generator.appspot.com",
    messagingSenderId: "867178130907",
    appId: "1:867178130907:web:e49f56878e72db9c8e0bfe"
  };
 
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
 
const sangerCol = collection(db, "sanger")
getDocs(sangerCol).then(function (sangerSnapshot) {
    // console.log(sangerSnapshot)
    sangerSnapshot.docs.forEach((verselinje) => {
        console.log("verselinje.id: " + verselinje.id + " verselinje.data(): ", verselinje.data())
        //addToHtml(verselinje)
    })
})




const sangID = "2"
getDoc(doc(db, "sanger", sangID)).then(function (docSnap) {
    if (docSnap.exists()) {
        console.log('Sang med id "' + sangID + '" data: ', docSnap.data())
        console.log('Verselinjer length: ', docSnap.data().verselinjer.length)
        console.log('Verselinjer: ', docSnap.data().verselinjer)


        docSnap.data().verselinjer.push("Ekstra linje")
     
        console.log('Verselinjer: ', docSnap.data().verselinjer)


    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!")
    }
})


const actionsCol = collection(db, "actions")
const q = query(actionsCol, where("sangid", "==", "1"))
getDocs(q).then(function (actionSnapshot) {
    // console.log(sangerSnapshot)
    actionSnapshot.docs.forEach((action) => {
        console.log("action.id: " + action.id + " action: ", action.data().action)
        //addToHtml(verselinje)
    })
})
