((document) => {
  // parts of the game board
  let movesDisplay = document.querySelector('.moves');
  let board = document.querySelector('#board');
  let colors = document.querySelector('#colors');
  let gameover = document.querySelector('#game-over');
  let timerDisplay = document.querySelector('#timer');

  // control variables 
  let colorArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  let running = false;
  let cell = '-x';
  let skill = 5;
  let maxMoves = 20; // Maximum number of moves
  let tally = 0;
  let color;
  let timerInterval;
  let gameDuration = 90; // 1.5 minutes in seconds

  // Timer variables
  let seconds = 0;
  let minutes = 0;

  //  game play methods
  // ----------------------------
  let shuffle = (collection) => {
    for (let i = collection.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [collection[i - 1], collection[j]] = [collection[j], collection[i - 1]];
    }
    return collection;
  };

  let setColors = (collection, n) => {
    return n < 10 ? shuffle(collection).slice(0, n) : collection;
  };

  let checkWin = () => {
    let n = 0;
    let msg = '';
    let tiles = board.childNodes;
    for (var i = 0; i < 100; i++) {
      if (tiles[i].className.indexOf(cell) > -1) {
        n++;
      }
    }
    if (n === 100) {
      msg = '<span class="message">You Win!</span>';
    } else if (tally >= maxMoves) {
      msg = '<span class="message">Oops! Try Again...</span>';
    } else if (seconds + (minutes * 60) >= gameDuration) {
      msg = '<span class="message">Oops! Time\'s up!...</span>'; 
      stopTimer();
      running = false;
      gameover.innerHTML = msg;
    }
    if (msg) {
      running = false;
      gameover.innerHTML = msg;
    }
  };

  let checkColor = (color) => {
    let tiles = board.childNodes;
    for (var x = 0; x < 100; x++) {
      if (tiles[x].className.indexOf(cell) > -1) {
        tiles[x].className = color + cell;
        if (x + 1 < 100 && tiles[x + 1].className === color) {
          tiles[x + 1].className += cell;
          playMatchSound();
        }
        if (x + 10 < 100 && tiles[x + 10].className === color) {
          tiles[x + 10].className += cell;
          playMatchSound();
        }
        if (x - 1 >= 0 && x % 10 > 0 && tiles[x - 1].className === color) {
          tiles[x - 1].className += cell;
          playMatchSound();
        }
        if (x - 10 >= 0 && x % 10 > 0 && tiles[x - 10].className === color) {
          tiles[x - 10].className += cell;
          playMatchSound();
        }
      }
    }
  };

  let builder = (container, element, collection, count, randomize) => {
    container.innerHTML = '';
    count = count || collection.length;
    randomize = randomize || false;
    for (let i = 0; i < count; i++) {
      let child = document.createElement(element);
      child.className = randomize ? collection[Math.floor((Math.random() * collection.length))] : collection[i];
      container.appendChild(child);
    }
  };

  let newGame = () => {
    clearInterval(timerInterval); // Stop the timer if it's running
    seconds = 0; // Reset seconds
    minutes = 0; // Reset minutes
    updateTimerDisplay(); // Update timer display
    let options = setColors(colorArray.slice(), skill);
    tally = 0;
    movesDisplay.innerText = tally;
    gameover.innerHTML = '';
    running = true;
    builder(colors, 'chip', options);
    builder(board, 'tile', options, 100, true);
    color = board.childNodes[0].className;
    board.className = '';
    board.childNodes[0].className = color + cell;
    checkColor(color);
    startTimer(); // Start the timer when a new game starts
  };

  let play = (chip) => {
    if (running && color !== chip && board.querySelector('.started') === null) {
      color = chip;
      board.classList.add('started'); // Add 'started' class to indicate the game has started
      tally++;
      movesDisplay.innerText = tally; // Update moves display
      checkColor(chip);
      checkWin();
    } else if (running && color !== chip) {
      color = chip;
      tally++;
      movesDisplay.innerText = tally; // Update moves display
      checkColor(chip);
      checkWin();
    } else {
      playErrorSound();
    }
  };

  let startTimer = () => {
    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      updateTimerDisplay();
      if (seconds + (minutes * 60) >= gameDuration) {
        checkWin(); // Check if time's up
      }
    }, 1000);
  };

  let updateTimerDisplay = () => {
    timerDisplay.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  let stopTimer = () => {
    clearInterval(timerInterval);
    updateTimerDisplay(); // Update the timer display one last time when stopping the timer
  };

  // Function to play match sound
  function playMatchSound() {
    let matchSound = new Audio('./music/match-sound.wav');
    matchSound.play();
  }

  // Function to play error sound
  function playErrorSound() {
    let errorSound = new Audio('./music/error-sound.wav');
    errorSound.play();
  }

  // Function to toggle music
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);

  function toggleMusic() {
    let bgMusic = document.getElementById('bg-music');
    let musicIcon = document.getElementById('music-icon');
    if (bgMusic.paused) {
      bgMusic.play();
      musicIcon.classList.remove('fa-play'); // remove play icon
      musicIcon.classList.add('fa-volume-xmark'); // add stop icon
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0; // rewind to the beginning
      musicIcon.classList.remove('fa-volume-xmark'); // remove stop icon
      musicIcon.classList.add('fa-play'); // add play icon
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    newGame();
  }, false);

  document.addEventListener('click', (event) => {
    let css = Array.from(event.target.classList);
    if (event.target.tagName === 'CHIP') {
      play(event.target.className);
    }
    else if (css.includes('new-game')) {
      newGame(); // Start a new game
    }
  });
})(document);
