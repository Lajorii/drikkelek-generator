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
// const code = "2"

let actionDataCellArr = []

document.getElementById("code").innerHTML = "KODEN ER: " + code

let songTable = document.getElementById("finishedTable")

getDoc(doc(db, "sanger", code)).then(function (docSnap) {
    if (docSnap.exists()) {

        const finishedSongArr = docSnap.data().verselinjer

        // for (const elm in finishedSongArr) {
        //     if (elm == "" || elm == "\n") {
        //         let index = finishedSongArr.indexOf(elm)
        //         finishedSongArr.splice(index, 1)
        //     }
        // }

        console.log(finishedSongArr)

        for (let i = 0; i < finishedSongArr.length; i++) {
            let newRow = document.createElement("tr")
            let lyricDataCell = document.createElement("td")
            let actionDataCell = document.createElement("td")

            lyricDataCell.innerHTML = finishedSongArr[i].replaceAll("\n", "<br>")
            actionDataCell.innerHTML = "Alle"
            actionDataCell.className = "actionDataCell"

            newRow.appendChild(lyricDataCell)
            newRow.appendChild(actionDataCell)

            songTable.appendChild(newRow)

        }

        actionDataCellArr = document.querySelectorAll(".actionDataCell")
        //console.log(actionDataCellArr)
        setInterval(getActionData, 2000)

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!")
    }
})

function getActionData() {

    let actionsCol = collection(db, "actions")
    let q = query(actionsCol, where("sangid", "==", code))

    getDocs(q).then(function (actionSnapshot) {
        // console.log(sangerSnapshot)
        let n = 0
        actionSnapshot.docs.forEach((action) => {

            actionDataCellArr[n].innerHTML = action.data().action
            n += 1
            // console.log("action.id: " + action.id + " action: ", action.data().action)
            //addToHtml(verselinje)
        })
    })

}

// TO DO-LISTE

// lag en counter som teller hvor mange linjer som mangler
// load-ikon
// send ut til alle-knapp
// flytte actions opp og ned
// legge til "alle" på refrenger?