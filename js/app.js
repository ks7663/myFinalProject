var cards = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];
var tempCards = [];
var matchedCards = [];
var firstClick = '';
var secondClick = '';
var moveCount = 0;
var gameStarted = false;
var seconds = 0;
var countSeconds;
var starResult = 4;
const starChart4 = 9;
const starChart3 = 13;
const starChart2 = 17;



// Shuffle function from http://stackoverflow.com/a/2450976
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

/*
* When the page loads it automatically sets the page to being ready and runs the reset function.
* the reset function pulls in the shuffled function and then puts the "cards" on the page.
*/
$(document).ready(function() {
  reset();
});
/*
* When the user clicks the restart icon where the restart class is assigned on the index.html page,
* the confirmReset will pop up an alert asking to confirm.
* If the user confirms/clicks OK, it empties the deck and moves information and then runs the reset function.
* The time is reset within the reset function.
*/
$('.restart').on('click', function() {
  var confirmReset = confirm('Are you sure you want to reset the game?');
  if (confirmReset === true) {
    $('.deck, .moves').empty();
    firstClick = '';
    reset();
  }
});
/*
* This function adds the show and open classes to the "card" the user clicked
*/
function clickedCards(card) {
  $(card).addClass('show open');
}
/*
* This function takes the children of the "cards" the user clicked, which in this case was the <i class="fa fa-card>"
* removes the first 6 characters (fa fa-)
* and pushes the rest (the card name) into the tempCards array.
* if there are 2 cards in that array it'll run the compareCards funtion. (WHAT IS IT DOING WHEN THERE IS ONLY 1, JUST WAITING FOR THE NEXT MOVEMENT?)
*/
function openCards(card) {
  tempCards.push($(card).children()[0].className.slice(6));
  if (tempCards.length === 2){
    compareCards();
  }
}
/*
* This function sets the firstClick and secondClick variables back to emptry strings and clears the tempCards array.
* This function is ran in the compareCards function whether it's a match or not to allow the next set of card information to be input
*/
function clearTempCards() {
  firstClick = '';
  secondClick = '';
  tempCards = []; // sets openArray back to being empty
}
/*
* This function compares the cards that were put in the tempCards array.
* firstClick and secondClick are assigned in the click function below.
* If the cards in the tempCards array match, the first card is sent to a matchedCards array and the winGame function will run
* If the cards do not match the show and open classes are removed from the clicked cards and the clearTempCards function is ran after 750 milliseconds.
*/
function compareCards() {
  if (tempCards[0] === tempCards[1]) { // takes and compares the two cards from the openCards array.
    $(firstClick).removeClass('show open').addClass('match'); // if matched the open and how are removed and match is added to both cards.
    $(secondClick).removeClass('show open').addClass('match');
    matchedCards.push(tempCards[0]);
    clearTempCards();
    winGame();
  } else {
      setTimeout(function() {
        $(firstClick).removeClass('show open');
        $(secondClick).removeClass('show open');
        clearTempCards();
      }, 750);
    }
  }

/*
* This function checks the length of the matchedCards array. When it is equal to 8 the user has matched all cards and the swal function will run.
* The swal code was taken from sweetalert.js.org/guides
*/
function winGame() {
  if(matchedCards.length === 8) {
    swal({
      closeOnClickOutside: false,
      closeOnEsc: false,
      title: "You win!",
      text: "You matched all 8 pairs in " + seconds + " seconds, " + moveCount + " moves, and with " + starResult + " stars remaining.",
      icon: "success",
      button: "Play again!"
    }).then(function(isConfirm) {
      if (isConfirm) {
        $('.deck, .moves').empty();
        reset();
      }
    });
    clearInterval(countSeconds);
  }
}

/*
* Set the star rating based on the number of moves the user has taken.
*/
function starCount() {
  if (moveCount >= starChart4 && moveCount < starChart3) {
    $('.star4').hide();
    starResult = 3;
	}
  else if (moveCount >= starChart3 && moveCount < starChart2) {
    $('.star3').hide();
    starResult = 2;
  }
  else if (moveCount >= starChart2) {
    $('.star2').hide();
    starResult = 1;
  }
}

/*
* gameStarted is set to False in the global variables.
* When the "card" class is clicked that's under the "deck" class, the function starts with changing gameStarted to true. (WHY??)
* The startTimer function begins and time starts counting once the user clicks their first "card".
* if it is not their "first click" firstClick will equal whatever they clicked on (hence "this").
*/
$('.deck').delegate('.card', 'click', function(){
  if (gameStarted === false){
    gameStarted = true; // if a card is clicked, set gameStarted to true and then start the timer.
    startTimer();
  }
  if (!firstClick){ // if the click is not the firstClick
    firstClick = $(this); // firstClick variable is updated to be whatever "card" was clicked.
    clickedCards(this); // the clickedCards function runs, adding the open show classes to the card.
    openCards(this); // and the openCards function is run, pushing the card into the tempCards array.
  } else if (!$(this).hasClass('show open')){ // whatever was clicked doesn't have
      secondClick = $(this); // changes the empty string in the secondClick variable to be what the user clicked.
      moveCount ++; // this will increase the move counter by 1
      $('.moves').text(moveCount); // this calls the moves class and updates the number of moves from the moveCount. Placed her so that after two selections (one full turn) it'll update.
      starCount();
      clickedCards(this); // the clickedCards function runs, adding the open show classes to the card.
      openCards(this); // and the openCards function is run, pushing the card into the tempCards array.
  }
});
/*
* The startTimer function takes the countSeconds global variable and sets it to track 1 second.
* The incrementSeconds functions will increase the second from the startTimer function by 1 and then that continues.
* The time is displayed where the seconds class is on the index file - the text shows seconds which is the accumulating
* time/seconds followed by the string/text "seconds".
*/
// startTimer function
function startTimer() {
  countSeconds = setInterval(incrementSeconds, 1000); // this sets the timer to count in 1 second increments and calls the incrementSeconds function
}

function incrementSeconds() {
    seconds ++; // this increases the seconds by 1
    $('.seconds').text(seconds + " seconds"); // this puts the text on the html page to show the seconds.
}

/*
* The reset function pulls in the shuffled function and then puts the "cards" on the page.
* It loops through each card in the cards variable and after the deck class adds/appends the li and i html.
* Upon page loading or when the game is reset, the move count is set back to zero.
* The clearInterva and seconds resets the timer, and the jquery removes the text from index.html
* gameStarted returns to false.
*/
function reset(){
  var shuffled = shuffle(cards);
  $.each(shuffled, function(index, card) {
    $('.deck').append('<li class="card"><i class="fa fa-' + card + '"></i></li>');
  });
  moveCount = 0;
  matchedCards = [];
  tempCards = [];
  clearInterval(countSeconds);
  seconds = 0;
  $('.seconds').text("");
  for (var i = starResult; i < 4; i++) {
    $('.star' + (i + 1)).show();
  }
  starResult = 4;
  gameStarted = false;
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
