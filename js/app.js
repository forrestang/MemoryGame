
// Comment out BELOW to use fixed board -------------------------------------------------
// Create array of classNames from HTML

// const manualListTemp = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt","fa fa-cube","fa fa-leaf","fa fa-bomb","fab fa-react"]; 
const manualListTemp = ["fab fa-react", "fab fa-vuejs", "fab fa-python", "fab fa-php","fab fa-node-js","fab fa-laravel","fab fa-r-project","fab fa-npm"]; 

// function that will return a double sized version of this array. This way to change
// the icons in the array, I only need to add 8 items to array above instead of 16.
const manualList = doubleArray(manualListTemp);
console.log(manualList);


// Get shuffled array of Cards
let shuffledArray = shuffle(manualList);
console.log(shuffledArray);

// Add shuffled classes to the <i> elements
addShuffledClasses();

// Comment out ABOVE to use fixed board ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Temporary simple solve deck for testing. Comment OUT to not use.
// let shuffledArray = ["fa fa-diamond","fa fa-diamond", "fa fa-paper-plane-o","fa fa-paper-plane-o", "fa fa-anchor","fa fa-anchor", "fa fa-bolt","fa fa-bolt","fa fa-cube","fa fa-cube","fa fa-leaf","fa fa-leaf","fa fa-bomb","fa fa-bomb","fa fa-bicycle","fa fa-bicycle"];;
// addShuffledClasses();

//Initialize Stop Watch Values
let time = 0;           //time in mSec
let interval;           //
let offset;             //captures date.Now to capture start time
let isOn = false;       //captures state of watch
let firstMove = false;  //Will only be triggered once per game

// Initialize winning move count
let matchCount = 0;

// Scoring system, mostly for stars and removal
let myScore = 10;

// Setup for stars in the score panel
const myStars = document.querySelector('.stars');
// console.log(myStars);


// Add Event Listeners to cards via event delegation and 
const myDeck =document.querySelector('.deck');  //

// What to do when card is CLICKED
myDeck.addEventListener('click', applyListener);

// Create array for clicked cards
let clickedCards = [];

// Create move counter
let moveCount = 0;

// Add Reset Functionality
const myReset = document.querySelector('.restart');
myReset.addEventListener('click', function()  {
  resetBoard();
});

// |------------------------------------------------------------------------------------|
// |Functions BELOW---------------------------------------------------------------------|
// |                                                                                    |
// |                                                                                    |
// |Functions BELOW---------------------------------------------------------------------|
// |------------------------------------------------------------------------------------|

// Shuffle function from http://stackoverflow.com/a/2450976 -----------------------------
//---------------------------------------------------------------------------------------
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// If <li> is clicked, call toggle classe function---------------------------------------
//---------------------------------------------------------------------------------------
function applyListener(event) {  
  const myClickedCard = event.target;
  if (myClickedCard.nodeName==="LI") {
    toggleCardClass(myClickedCard);
    if (!firstMove) {   // Timer will only be started one time
      startTimer();     // start the timer on first click on board
      firstMove = true; // This will never be triggered again    
    }
  }
  // console.log(matchCount);
  
}

// Toggle the show/Open classes which turn card blue and show symbol---------------------
//---------------------------------------------------------------------------------------
function toggleCardClass(myClickedCard) {
  // Condition: If already matched or flipped don't allow user to interact with it
  if(!myClickedCard.classList.contains("match") && !myClickedCard.classList.contains("show")) { 
    event.target.classList.toggle("show");
    event.target.classList.toggle("open"); 
    addCardsOpened(myClickedCard);  //Add cards to array  
  }
}

// Add clicked cards to the clickedCards array (will only have TWO cards at most)--------
//---------------------------------------------------------------------------------------
function addCardsOpened(myClickedCard) {
  if (myClickedCard.classList.contains("open") ) { // Add card to array ONLY if card recently toggled/flipped over
    clickedCards.push(myClickedCard);
    // console.log(clickedCards);
    
    if(clickedCards.length === 2)  { // if we have two cards, compare theese two cards
      compareCards();
    }    
  }
}

// Compare two cards when the array has two cards added to it----------------------------
//---------------------------------------------------------------------------------------
function compareCards() {
  const item_0 = clickedCards[0].children[0].className;
  const item_1 = clickedCards[1].children[0].className;
  if(item_0 === item_1) {
    cardsMatchTrue();    
  } else  {
    cardsMatchFalse();  
  }
}

// If cards match remove show/open class, add match class--------------------------------
//---------------------------------------------------------------------------------------
function cardsMatchTrue() {
  clickedCards[0].classList.remove("show"); 
  clickedCards[0].classList.remove("open"); 
  clickedCards[0].classList.add("match");
  clickedCards[1].classList.remove("show"); 
  clickedCards[1].classList.remove("open"); 
  clickedCards[1].classList.add("match");
  clickedCards = [];    // Clear array as we only need to work with two cards at a time
  incrementMoveCount(); // Add a move each time cards are matched
  isGameOver();         // After a successfull move, check if game is won or not
}

// If cards DO NOT match, remove show/open class(I.e., put face down)--------------------
//---------------------------------------------------------------------------------------
function cardsMatchFalse() {
  clickedCards[0].classList.remove("show"); 
  clickedCards[0].classList.remove("open"); 
  clickedCards[1].classList.remove("show"); 
  clickedCards[1].classList.remove("open"); 
  clickedCards = []; // Clear array as we only need to work with two cards at a time
  incrementMoveCount(); //Add a move each time cards are NOT matched
  keepingScore();       //function to reduce score on incorrect guess
  removeStar();         //function to remove stars from score panel
}

// Increment move Counter----------------------------------------------------------------
//---------------------------------------------------------------------------------------
function incrementMoveCount() {
  moveCount++;
  const movesOnPage = document.querySelector(".moves");
  if (moveCount == 1) { // Added this condition to check for 'one MOVE' vs 'two MOVES'
    movesOnPage.textContent = `${moveCount} Move`;
  } else {
    movesOnPage.textContent = `${moveCount} Moves`;
  }
}

// Modify the stars on the page ---------------------------------------------------------
//---------------------------------------------------------------------------------------
function removeStar() {
  // myStars.children[myScore].children[0].className = "fas fa-star";
  if (myScore > 0) {
    // console.log(myScore);
    // console.log(myStars.children[myScore-1].children[0].className);
    // console.log(myStars.children[5]);
    myStars.children[myScore-1].children[0].className = 'far fa-star';    
  }

}

// Check if game is won or not, returns bool---------------------------------------------
//---------------------------------------------------------------------------------------
function isGameOver() {
  matchCount++;
  if(matchCount === 8) {
    console.log(`${matchCount} moves and Game is Over`);
    stopTimer();  //Stop timer on end game condition
  }
}

// Function that returns a double sized array of whatever is passed into it--------------
//---------------------------------------------------------------------------------------
function doubleArray(myArr) {
  tempArray = myArr;
  myArr = myArr.concat(tempArray);
  return myArr;
}

// Function that adds shuffled cards to the deck-----------------------------------------
//---------------------------------------------------------------------------------------
function addShuffledClasses() {
  const deckOfCards =document.querySelector('.deck');

  for (let i = 0; i < shuffledArray.length; i++) {
    deckOfCards.children[i].children[0].className = shuffledArray[i];
  }
}

// Function to reduce score on an incorrrect guess---------------------------------------
//---------------------------------------------------------------------------------------
function keepingScore() { //Make sure lowest score is only as low as 0
  if(myScore > 0) {
    myScore--;
  }
}

// Functions for stop watch--------------------------------------------------------------
//---------------------------------------------------------------------------------------
function update() { //add time passed to previous time
  time += delta();
  let formattedTime = timeFormatter(time);
  // console.log(formattedTime); 
  document.querySelector('.myTimer').textContent = formattedTime;
}

function delta() {  //Function to get amount of time passed
  let now = Date.now();
  let timePassed = now - offset;
  offset = now;
  return timePassed;
}

function timeFormatter(timeInMsecs) {
  let time = new Date(timeInMsecs);

  let hours = Math.floor(((new Date().getTime() - offset) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = time.getMinutes().toString();
  let seconds = time.getSeconds().toString();
  let milliseconds = time.getMilliseconds().toString(); //Not in use at the moment

  if (minutes.length < 2) { //Formatting to keep minutes at 2 decimals
    minutes = '0' + minutes;
  }

  if (seconds.length < 2) { //Formatting to keep seconds at 2 decimals
    seconds = '0' + seconds;
  }

  return `${hours} : ${minutes} : ${seconds}`;
}

function startTimer() {
  if(!isOn) {
    interval = setInterval(update, 500);
    offset = Date.now();
    isOn = true;
  }
}

function stopTimer() {
  if (isOn) {
    clearInterval(interval);
    interval = null;
    isOn = false;
  }
}

function resetTimer() {
  time = 0;
}

// Function call to reset the game-------------------------------------------------------
//---------------------------------------------------------------------------------------
function resetBoard() {

  // Reshuffle Array
  shuffledArray = shuffle(manualList);
  console.log(shuffledArray);
  
  // Add shuffled classes to the <i> elements
  addShuffledClasses();

  //Re-Initialize Stop Watch Values and update HTML
  stopTimer();
  resetTimer();
  update();
  document.querySelector('.myTimer').textContent = `0 : 00 : 00`;
  time = 0;           //time in mSec
  interval;           //
  offset;             //captures date.Now to capture start time
  isOn = false;       //captures state of watch
  firstMove = false;  //Will only be triggered once per game

  // Re-Initialize winning move count
  matchCount = 0;

  // Re-Initialize Score
  myScore = 10;

  // Reset clicked cards array
  clickedCards = [];

  // Reset Move Counter and update HTML
  moveCount = 0;
  const movesOnPage = document.querySelector(".moves");
  movesOnPage.textContent = `${moveCount} Move`;

  // Reset all classes on cards(flip them over)
  const deckOfCards =document.querySelector('.deck');

  for (let i = 0; i < 16; i++) {
    deckOfCards.children[i].className = 'card';
  }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
