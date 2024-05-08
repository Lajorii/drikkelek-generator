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

let submitPromptButton = document.getElementById("submitPromptButton")
let loadingIcon = document.getElementById("blurryBackground")
let noSelectedButtonPopup = document.getElementById("noSelectedButtonPopup")

noSelectedButtonPopup.addEventListener("click", function () {
    noSelectedButtonPopup.style.display = "none"
})

submitPromptButton.addEventListener("click", async function () {
    loadingIcon.style.display = "flex"
    let enteredCode = document.getElementById("codeInput").value

    console.log(enteredCode)

    if (await checkIfValidCode(enteredCode)) {
        loadingIcon.style.display = "none"
        window.location.href = "submit_prompt.html?code=" + enteredCode 
    } else {
        loadingIcon.style.display = "none"
        noSelectedButtonPopup.style.display = "block"
    }

})

async function checkIfValidCode(code) {
    let docSnap = await getDoc(doc(db, "sanger", code))
    if (docSnap.exists()) {
        return true
    } else {
        return false
    }
}