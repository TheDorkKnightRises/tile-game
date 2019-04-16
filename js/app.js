/*
 * Create a list that holds all of your cards
 */
const Symbol = {
    ANCHOR : 'fa-anchor',
    BICYCLE : 'fa-bicycle',
    BOLT : 'fa-bolt',
    BOMB : 'fa-bomb',
    CUBE : 'fa-cube',
    DIAMOND : 'fa-diamond',
    LEAF : 'fa-leaf',
    PLANE : 'fa-paper-plane-o',
};

const State = {
    CLOSE : 'card',
    OPEN : 'card open show',
    MATCH : 'card open match',
};

let deck = [Symbol.ANCHOR, Symbol.ANCHOR, Symbol.BICYCLE, Symbol.BICYCLE, Symbol.BOLT, Symbol.BOLT, Symbol.BOMB, Symbol.BOMB, Symbol.CUBE, Symbol.CUBE, Symbol.DIAMOND, Symbol.DIAMOND, Symbol.LEAF, Symbol.LEAF, Symbol.PLANE, Symbol.PLANE];
let open = [];
let matched = 0;
let moves = 0;
let time = 0;
let stars = 3;
let timer = false;

init();

function init() {
	resetGame();

  	$('.restart').click(handleRestartClick);

}

function resetGame() {
	$('.banner').addClass('invisible');

	deck = shuffle(deck);
	matched = 0;

	stopTimer();
	time = 0;
	$('.time').text(time);

	resetStars();
	resetMoves();

	$('.deck').empty();

	deck.forEach(function(card, index) {
   		$('.deck-'+index%4).append(`<li class="card" card-id=${index} symbol=${card}><i class="fa ${card}" ></i></li>`);
  	});

  	$('.card').bind('click', handleCardClick);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function handleCardClick(e) {
	console.log('Card clicked');

	// Start the timer if it is not already started
	if (!timer) {
		startTimer();
	}

	// Reset previous 2 open cards to closed position
	if (open.length == 2) {
		resetOpenCards();
	}

	// Selecting the correct target
	if ($(e.target).hasClass('card')) {
		card = e.target;
	} else {
		// If the icon was clicked, select the parent card
		card = $(e.target).parent();
	}

	// Ignore clicks on already open cards
	if ($(card).hasClass('open')) {
		return;
	}

	incrementMoves();

	openCard(card);

	// If two cards are open, check for a match
	if (open.length == 2) {
		checkMatch();
	}
}

function openCard(card) {
	// Set card state to open and add to list of open cards
	$(card).attr('class', State.OPEN)
	open.push(card);
}

function checkMatch() {
	// Check if symbols match
	if ($(open[0]).attr('symbol') === $(open[1]).attr('symbol')) {
		console.log('Cards matched');
		matchOpenCards();
	}
}

function matchOpenCards() {
	// Set the cards to matched state and empty 'open' list
	$(open[0]).attr('class', State.MATCH);
	$(open[1]).attr('class', State.MATCH);
	open = [];

	matched += 2;
	// Check winning condition
	if (matched == deck.length) {
		win();
	}
}

function resetOpenCards() {
	// Set the cards to closed state and empty 'open' list
	$(open[0]).attr('class', State.CLOSE);
	$(open[1]).attr('class', State.CLOSE);
	open = [];
}

function handleRestartClick(e) {
	console.log('Restart clicked');
	resetGame();
}

function incrementMoves() {
	moves += 1;
	console.log('Moves: ' + moves);
	$('.moves').text(moves);

	// Update star rating based on number of moves
	if (moves == 30) {
		$('.stars').empty();
		stars--;
		$('.star-rating').text(stars);
		console.log('Stars: ' + stars);
		for (var i = stars; i > 0; i--) {
			$('.stars').append('<li><i class="fa fa-star"></i></li>');
		}
	} else if (moves == 40) {
		stars--;
		$('.star-rating').text(stars);
		console.log('Stars: ' + stars);
		$('.stars').empty();
		$('.stars').append('<li><i class="fa fa-star"></i></li>');
	} else if (moves == 50) {
		stars--;
		$('.star-rating').text(stars);
		console.log('Stars: ' + stars);
		$('.stars').empty();
	}
}

function resetMoves() {
	console.log('Reset moves to 0');
	moves = 0;
	$('.moves').text(moves);
}

function resetStars() {
	console.log('Reset stars to 3');
	stars = 3;
	$('.star-rating').text(stars);
	$('.stars').empty();
	for (var i = stars; i > 0; i--) {
		$('.stars').append('<li><i class="fa fa-star"></i></li>');
	}
}

function startTimer() {
	timer = setInterval(function() { time +=1; $('.time').text(time); }, 1000);
}

function stopTimer() {
	clearInterval(timer);
	timer = false;
}

function win() {
	console.log('You Won!');
	$('.banner').removeClass('invisible');
	stopTimer();
	$('.card').unbind('click');
}
