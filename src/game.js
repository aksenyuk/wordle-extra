import { realDictionary } from './dictionary.js';
const dictionary = realDictionary;

const state = {
  secret: 'iloveyou',
  grid: Array(6)
    .fill()
    .map(() => Array(8).fill('')),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {
  const grid = document.createElement('span');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 8; j++) { // here
      drawBox(grid, i, j);
    }
  }

  document.getElementById("game").appendChild(grid);
}


function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}


function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}


function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 8) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
        }
      }
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };

  document.getElementById("keyboard").addEventListener("click", (e) => {
    const target = e.target
    if (!(target.classList.contains("keyboard-button") || target.classList.contains("enter") || target.classList.contains("delete"))) {
      return
    }

    let key = target.textContent

    if (isLetter(key)) {
      addLetter(key);
    }
    if (key === 'Enter') {
      if (state.currentCol === 8) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
        }
      }
    }
    updateGrid();
  })

  let image = document.getElementById('image');

  image.addEventListener('click', function(){
    removeLetter();
    updateGrid();
  });


  var modal = document.getElementById("myModal");
  var question = document.getElementById('question');
  var span = document.getElementsByClassName("close")[0];
  question.addEventListener('click', function(){
    modal.style.display = "block";
  });
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor
      
      if (oldColor === 'green') {
        return
      }
      if (oldColor === 'yellow' && color !== 'green') {
        return
      }
      elem.style.backgroundColor = color
      break
    }
  }
}


function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}


function isWordValid(word) {
  return dictionary.includes(word);
}


function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}


function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500;

  for (let i = 0; i < 8; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
          shadeKeyBoard(letter, "#538d4e")
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
          shadeKeyBoard(letter, "#b59f3b")
        } else {
          box.classList.add('empty');
          shadeKeyBoard(letter, "#3a3a3c")  ## color does not get applied
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner || isGameOver) {
      var result = document.getElementById("result");
      var close = document.getElementsByClassName("result-close")[0];
      document.getElementById("result_text").textContent = state.secret;
      if (state.secret === "iloveyou") {
        document.getElementById("reset-text").textContent = "Happy Anniversary, bby ♥";
      }
      result.style.display = "block";

      close.onclick = function () {
        result.style.display = "none";
      }

      window.onclick = function (event) {
        if (event.target == result) {
          result.style.display = "none";
          // window.location.reload();
        }
      }
    }
  }, 5 * animation_duration);
}


function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}


function addLetter(letter) {
  if (state.currentCol === 8) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}


function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}


function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  registerKeyboardEvents();
}


startup();


