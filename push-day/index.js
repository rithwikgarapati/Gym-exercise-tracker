// The essential use of this database is so the items are stored it
// and can be retrieved when the page is refreshed.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://gymsession-905f9-default-rtdb.firebaseio.com/"
}

// Connects our program with the Database
const app = initializeApp(appSettings)
// Gives access to the database
const database = getDatabase(app)
// Reference helps push data to the database.
const pushExercisesInDB = ref(database, "pushExercisesList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const exerciseListEl  = document.getElementById("exercise-list")
const dayCountEl = document.getElementById("count")
const resetEl = document.getElementById("reset")

let day_count = 0;



addButtonEl.addEventListener("click", function() {
    /*
        Here, we take the value from input, push it to database
        and clear the input field.
     */

    let inputValue = inputFieldEl.value
    push(pushExercisesInDB, inputValue)
    clearingInput();
    
})

// onValue() is called every time data is changed at the specified database reference, including changes to children.
onValue(pushExercisesInDB, function(snapshot){
    let itemsArray = Object.entries(snapshot.val())
    clearExerciseListEl()

    for(let i = 0; i < itemsArray.length; i++)
    {
        let currentItem = itemsArray[i];
        appendItemsToExerciseList(currentItem);
    }

})

dayCountEl.addEventListener("click", function(){
    day_count++;
    dayCountEl.textContent = `Day count: ${day_count}`
})

resetEl.addEventListener("click", function(){
    day_count = 0;
    dayCountEl.textContent = `Day Count: 0`
})

function appendItemsToExerciseList(item)
{
    let itemID = item[0];
    let itemValue = item[1];

    // I want to create a list element that can be responsive.
    let newEl = document.createElement("li")
    newEl.textContent = itemValue;

    newEl.addEventListener("click", function(){
        newEl.style.textDecoration = "line-through";
        
    })

    newEl.addEventListener("dblclick", function(){
        let exactLocationOfItem = ref(database, `pushExercisesList/${itemID}`)
        remove(exactLocationOfItem)
    })

    exerciseListEl.append(newEl);
}

function clearExerciseListEl(){
    exerciseListEl.innerHTML = ""
}

function clearingInput(){
    inputFieldEl.value = ""
}