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
    addDoc,
    updateDoc,
    arrayUnion
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
// const code = testkode

let actionDataCellNl = []
let isFunctionActive = true
let intervalId = null

document.getElementById("code").innerHTML = "KODEN ER: " + code

let songTable = document.getElementById("finishedTable")
let finishedSongArr = []

getDoc(doc(db, "sanger", code)).then(function (docSnap) {
    if (docSnap.exists()) {

        finishedSongArr = docSnap.data().verselinjer

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

        actionDataCellNl = document.querySelectorAll(".actionDataCell")

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!")
    }
})

let actionCounter = document.getElementById("actionCounter")

function getActionData(finishedSongArr) {

    let actionsCol = collection(db, "actions")
    let q = query(actionsCol, where("sangid", "==", code))

    getDocs(q).then(function (actionSnapshot) {
        // console.log(sangerSnapshot)
        let n = 0
        actionSnapshot.docs.forEach((action) => {

            actionDataCellNl[n].innerHTML = action.data().action
            n += 1
            // console.log("action.id: " + action.id + " action: ", action.data().action)
            //addToHtml(verselinje)
        })

        if (n >= finishedSongArr.length) {
            document.getElementById("smallLoader").style.display = "none"
            actionCounter.innerHTML = n + "/" + finishedSongArr.length
        } else {
            actionCounter.innerHTML = n + "/" + finishedSongArr.length
            document.getElementById("smallLoader").style.display = "block"

        }
    })

    console.log("hei")

}

let finishedButton = document.getElementById("finishedButton")

finishedButton.addEventListener("click", function () {
    console.log("stopp")
    isFunctionActive = false // Toggle the state of active
    if (isFunctionActive) {
        // If active is set to true again, restart the interval
        setupInterval()
    } else {
        // If active is false, ensure the interval is cleared
        clearInterval(intervalId)
    }

    clearPage()
})

function setupInterval() {
    intervalId = setInterval(() => {
        if (isFunctionActive) {
            getActionData(finishedSongArr)
        } else {
            clearInterval(intervalId) // Stop the interval when active is false
        }
    }, 2000)
}

setupInterval()

function clearPage() {
    document.getElementById("codeContainer").style.display = "none"
    finishedButton.style.display = "none"
    document.getElementById("postProductionPopUp").style.display = "flex"
}

let sendOutButton = document.getElementById("sendOutButton")

sendOutButton.addEventListener("click", async function () {
    console.log(actionDataCellNl)

    const actionCol = doc(db, "sanger", code)

    let tempActionArr = []

    for (let elements of actionDataCellNl) {
        console.log(elements.innerHTML);

        tempActionArr.push(elements.innerHTML)
    }

    await updateDoc(actionCol, {
        actions: tempActionArr
    })

    postProductionPopUp.style.display = "none"

    // displayer sangen
    // copy paste
})

//Rediger rekkefølge

let editButton = document.getElementById("editButton")
let postProductionPopUp = document.getElementById("postProductionPopUp")

let actionDataCellArr
let isEditing = -1

editButton.addEventListener("click", function () {
    //postProductionPopUp.style.display = "none"

    if (isEditing < 0) {
        isEditing *= -1
        editButton.style.backgroundColor = 'greenyellow'
        sendOutButton.style.display = 'none'
        editButton.innerHTML = 'Ferdig?'
    } else {
        editButton.style.backgroundColor = 'var(--azure)'
        sendOutButton.style.display = 'block'
        editButton.innerHTML = 'Rediger rekkefølge   <i class="fa-solid fa-sort"></i>'
    }




    actionDataCellArr = Array.from(actionDataCellNl)

    makeDraggable()
})

let startRow

function makeDraggable() {
    for (let action_td of actionDataCellArr) {
        action_td.setAttribute('draggable', true)

        action_td.addEventListener('dragstart', (e) => {
            startRow = e.target
        })


        action_td.addEventListener('dragover', (e) => {
            e.preventDefault()

            for (let action_td of actionDataCellArr) {
                action_td.style.border = '1px black solid'
            }

            if (actionDataCellArr.indexOf(startRow) > actionDataCellArr.indexOf(e.target)) {
                e.target.style.borderTop = "3px black solid"
            } else {
                e.target.style.borderBottom = "3px black solid"
            }

            scrollPageLaptop(e.screenY)

            // actionDataCellArr[actionDataCellArr.indexOf(e.target) + 1].style.border = '1px black solid'
            // actionDataCellArr[actionDataCellArr.indexOf(e.target) - 1].style.border = '1px black solid'
        })


        action_td.addEventListener('drop', (e) => {
            e.preventDefault()

            actionDataCellArr[actionDataCellArr.indexOf(e.target)].style.border = "1px black solid"

            rewriteTable(actionDataCellArr.indexOf(startRow), actionDataCellArr.indexOf(e.target))
        })


        //for mobil

        action_td.addEventListener('touchstart', (e) => {
            startRow = e.target
            console.log('start')
        })

        action_td.addEventListener('touchmove', (e) => {
            e.preventDefault()
            console.log('move')

            // Get the touch point under the touchmove event
            let touch = e.touches[0] || e.changedTouches[0]
            let targetElement = document.elementFromPoint(touch.clientX, touch.clientY)

            for (let action_td of actionDataCellArr) {
                action_td.style.border = '1px black solid'
            }

            if (actionDataCellArr.indexOf(startRow) > actionDataCellArr.indexOf(targetElement) && actionDataCellArr.includes(targetElement)) {
                targetElement.style.borderTop = "3px black solid"

            } else if (actionDataCellArr.includes(targetElement)) {
                targetElement.style.borderBottom = "3px black solid"
            }

            scrollPageMobile(touch.clientY)

            fakeMove(startRow, touch.clientX, touch.clientY)
        })

        action_td.addEventListener('touchend', (e) => {
            e.preventDefault()

            document.getElementById('fakeElm').remove()
            let fakeElm = document.createElement('div')
            fakeElm.setAttribute("id", "fakeElm")
            document.body.appendChild(fakeElm)

            console.log('end')

            // Get the touch point under the touchend event
            let touch = e.changedTouches[0]
            let targetElement = document.elementFromPoint(touch.clientX, touch.clientY)

            actionDataCellArr[actionDataCellArr.indexOf(targetElement)].style.border = "1px black solid"

            rewriteTable(actionDataCellArr.indexOf(startRow), actionDataCellArr.indexOf(targetElement))
        })
    }
}

function scrollPageLaptop(y) {
    let touchOfScreenFactor = y / window.screen.height

    if (touchOfScreenFactor > 0.8) {
        window.scrollBy({
            top: 2,
            behavior: "auto",
        })

    } else if (touchOfScreenFactor < 0.2) {
        //scroll up
        window.scrollBy({
            top: -2,
            behavior: "auto",
        })
    }
}

function scrollPageMobile(y) {
    let touchOfScreenFactor = y / window.screen.height

    if (touchOfScreenFactor > 0.91) {
        window.scrollBy({
            top: 20,
            behavior: "auto",
        })

    } else if (touchOfScreenFactor > 0.8) {
        window.scrollBy({
            top: 7,
            behavior: "auto",
        })

    } else if (touchOfScreenFactor < 0.1) {
        window.scrollBy({
            top: -20,
            behavior: "auto",
        })

    } else if (touchOfScreenFactor < 0.2) {
        //scroll up
        window.scrollBy({
            top: -7,
            behavior: "auto",
        })
    }
}

function fakeMove(elm, x, y) {
    document.getElementById('fakeElm').remove()

    let fakeElm = elm.cloneNode(true)
    // let style = window.getComputedStyle(elm)
    // let width = style.getPropertyValue('width')

    fakeElm.classList.add('fakeMove', 'td')
    fakeElm.setAttribute("id", "fakeElm")

    fakeElm.style.left = x + 2 + 'px'
    fakeElm.style.top = y - 15 + 'px'
    fakeElm.style.width = window.getComputedStyle(elm).getPropertyValue('width')
    fakeElm.style.height = window.getComputedStyle(elm).getPropertyValue('height')

    //console.log(window.getComputedStyle(elm).getPropertyValue('height'));

    document.body.appendChild(fakeElm)
}

let rowsText = []

function rewriteTable(startIndex, endIndex) {
    for (let action_td of actionDataCellArr) {
        rowsText.push(action_td.innerHTML)
    }

    let movingElm = rowsText[startIndex]

    rowsText.splice(startIndex, 1)
    rowsText.splice(endIndex, 0, movingElm)

    for (let i = 0; i < actionDataCellArr.length; i++) {
        actionDataCellArr[i].innerHTML = rowsText[i]
    }
}
// TO DO-LISTE
// flytte actions opp og ned
// legge til "alle" på refrenger?