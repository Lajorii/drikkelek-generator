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

const loadingIcon = document.getElementById("blurryBackground")

generateSongButton.addEventListener("click", async function () {
    if (radioButtonChecked()) {
        loadingIcon.style.display = "flex"

        const fullSong = document.getElementById("pastedSong").value

        const finishedSongArr = splitSong(fullSong)
        const actualCode = await createCode()
        
        await createDoc(actualCode, finishedSongArr)

        // createTable()

        window.location.href = "finishedSong.html?code=" + actualCode 
    }

    // console.log(amountOfLines)
})

let noSelectedButtonPopup = document.getElementById("noSelectedButtonPopup")

noSelectedButtonPopup.addEventListener("click", function () {
    noSelectedButtonPopup.style.display = "none"
})

var amountOfLines = 0

function radioButtonChecked() {
    let inputAmountOfLines = document.getElementsByName("speed")

    console.log(inputAmountOfLines);

    for (let i = 0; i < inputAmountOfLines.length; i++) {
        if (inputAmountOfLines[i].checked) {
            amountOfLines = inputAmountOfLines[i].value
        }
    }

    if (amountOfLines > 0) {
        return true
    } else {
        noSelectedButtonPopup.style.display = "block"
        return false
    }

}

function splitSong(song) {
    let songArray = song.split(/\r?\n|\r|\n/g)
    let finishedSongArr = []

    for (let i = 1; i < songArray.length + 1; i++) {
        if (i % amountOfLines == 0) {
            let newString = ""
            for (let j = amountOfLines; j > 0; j--) {
                newString += songArray[i - j] + "\n"
            }
            finishedSongArr.push(newString)
        }
    }

    //console.log(finishedSongArr)
    
    
    return finishedSongArr
}


async function createCode() {
    let temporaryCode = (Math.floor(Math.random() * 90000) + 10000).toString()

    // let temporaryCode = "2"

    let docSnap = await getDoc(doc(db, "sanger", temporaryCode))
    // .then(function (docSnap) {
    if (docSnap.exists()) {
        return createCode()
    } else {
        console.log("fant ikke");
        return temporaryCode
    }
} 

async function createDoc(actualCode, finishedSongArr) {
    let docData = {
        actions: [],
        verselinjer: finishedSongArr
    }
    await setDoc(doc(db, "sanger", actualCode.toString()), docData)
}
