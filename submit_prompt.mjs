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

let isFunctionActive = true
let intervalId = null

let songTable = document.getElementById("finishedTable")


const queryString = window.location.search
console.log(queryString);

const urlParams = new URLSearchParams(queryString)

const code = urlParams.get("code")

document.getElementById("code").innerHTML = "KODE: " + code
let actionCounter = document.getElementById("actionCounter")

let finishedSongArr = []

getDoc(doc(db, "sanger", code)).then(function (docSnap) {
    if (docSnap.exists()) {

        finishedSongArr = docSnap.data().verselinjer

        //console.log(finishedSongArr)

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!")
    }
})


let submitPromptButton = document.getElementById("submitPromptButton")

submitPromptButton.addEventListener("click", async function () {
    let prompt = document.getElementById("textInput")

    if (prompt.value === "") {
        emptyMessasgeDisplay()
        return

    } else {
        let docRef = await addDoc(collection(db, "actions"), {
            action: prompt.value,
            sangid: code
        })
    }

    await successfullySent(prompt.value)
    prompt.value = ""
})

async function successfullySent(actionString) {
    // faktisk sjekk om det funka, kan hende at det ikke gjør det
    let actionsCol = collection(db, "actions")
    console.log(actionString);
    let q = query(actionsCol, where("action", "==", actionString))

    //console.log(q)

    try {
        let actionSnapshot = await getDocs(q)
        if (!actionSnapshot.empty) {
            actionSnapshot.forEach(doc => {
                // Access the document data
                let data = doc.data()
                console.log('Dette gikk, her er snapshot:', data.action)

                var element = document.getElementById('successfullySentPopUp')
                element.classList.remove('fade-effect')
                void element.offsetWidth
                element.classList.add('fade-effect')

                setTimeout(() => {
                    element.classList.remove('fade-effect')
                }, 2000)
            });
        } else {
            console.log('Ingen dokumenter funnet.')
        }
    } catch (error) {
        console.error('Feil ved henting av dokumenter:', error)
    }


    var element = document.getElementById('successfullySentPopUp')
    element.classList.remove('fade-effect')
    void element.offsetWidth
    element.classList.add('fade-effect')

    setTimeout(() => {
        element.classList.remove('fade-effect')
    }, 2000)
}

function emptyMessasgeDisplay() {
    var element = document.getElementById('emptyMessasgePopUp')
    element.classList.remove('fade-effect')
    void element.offsetWidth
    element.classList.add('fade-effect')

    setTimeout(() => {
        element.classList.remove('fade-effect')
    }, 2000)
}

async function chechIfFinished() {
    await getDoc(doc(db, "sanger", code)).then(function (docSnap) {
        if (docSnap.exists()) {
            let allActions = docSnap.data().actions
            let allVerselinjer = docSnap.data().verselinjer

            if (allActions.length == allVerselinjer.length) {
                console.log("ferdig")

                console.log(allVerselinjer)
                console.log(allActions)

                isFunctionActive = false

                displaySong(allVerselinjer, allActions)

                document.body.style.overflowY = "auto"

                return true
            } else {

                console.log("ikke ferdig")
                return false
            }
        } else {
            console.log("Noe har gått galt")

            return false
        }
    })

    let actionsCol = collection(db, "actions");
    let q = query(actionsCol, where("sangid", "==", code));

    getDocs(q).then(function (actionSnapshot) {
        let n = actionSnapshot.size; // Get the number of documents directly

        // Update the action counter
        actionCounter.innerHTML = n + "/" + finishedSongArr.length

        // Show or hide the loader based on the number of actions
    });
}



function setupInterval() {
    intervalId = setInterval(() => {
        if (isFunctionActive) {
            chechIfFinished()
        } else {
            clearInterval(intervalId) // Stop the interval when active is false
        }
    }, 2000)
}

setupInterval()

function displaySong(verselinjer, actions) {
    document.getElementById("submitPrompt").style.display = "none"
    document.getElementById("submitLoaderContainer").style.display = "none"


    for (let i = 0; i < verselinjer.length; i++) {
        let newRow = document.createElement("tr")
        let lyricDataCell = document.createElement("td")
        let actionDataCell = document.createElement("td")

        lyricDataCell.innerHTML = verselinjer[i].replaceAll("\n", "<br>")
        actionDataCell.innerHTML = actions[i]

        newRow.appendChild(lyricDataCell)
        newRow.appendChild(actionDataCell)

        songTable.appendChild(newRow)

    }
}


// lag funksjon som sjekker om lengden på actions er større enn 0, funksjonen kjører hvert sekund