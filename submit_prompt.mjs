// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js"  // "firebase/app"
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
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"  //  "firebase/firestore/lite" //  "firebase/firestore/lite"let generateSongButton = document.getElementById("generateSongButton")


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


const queryString = window.location.search
console.log(queryString);

const urlParams = new URLSearchParams(queryString)

const code = urlParams.get("code")

document.getElementById("localCode").innerHTML = "KODE: " + code

let submitPromptButton = document.getElementById("submitPromptButton")

submitPromptButton.addEventListener("click", async function() {
    let prompt = document.getElementById("textInput").value

    let docRef = await addDoc(collection(db, "actions"), {
        action: prompt,
        sangid: code
      })

    successfullySent()
})

function successfullySent() {
    
}