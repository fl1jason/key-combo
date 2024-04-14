const gameProps = {};

const resetGame = () => {
  console.log("Game reset");
  gameProps.time = 0;
  gameProps.isPlaying = false;
  gameProps.isPaused = false;
  gameProps.isGameOver = false;
  gameProps.wins = 0;
  gameProps.difficulty = 4;
  gameProps.combo = [];
  gameProps.currentLetter = 0;
  gameProps.challengeTime = 5;
};

let timer;

const startGame = () => {
  // Reset the game
  resetGame();

  // Generate a combo to start the game
  gameProps.combo = generateCombo();

  // Display the combo to the user
  displayCombo(gameProps.combo);

  startGameTimer();
};

const startGameTimer = () => {
  // Start the Game timer
  timer = setInterval(() => {
    const countdownEl = document.getElementById("countdown");
    countdownEl.textContent = `${gameProps.time}s`;
    gameProps.time--;
    if (gameProps.time <= 0) {
      endGame();
    }
  }, 1000);
};

const pauseGame = () => {
  clearInterval(timer);
};

const resumeGame = () => {
  startGameTimer();
};

const endGame = () => {
  clearInterval(timer);

  document.getElementById("countdown").textContent = "";
  document.getElementById("combo").innerHTML = "Game Over";
  document.getElementById(
    "status"
  ).textContent = `Final Score: ${gameProps.wins}`;
};

const generateCombo = () => {
  const combo = [];
  for (let i = 0; i < gameProps.difficulty; i++) {
    combo.push(Math.floor(Math.random() * gameProps.difficulty));
  }

  if (gameProps.wins > 0 && gameProps.wins % 5 === 0) {
    gameProps.difficulty++;
    console.log(
      `Difficulty increased to ${gameProps.difficulty} ${gameProps.wins}`
    );
  }

  gameProps.time = gameProps.challengeTime;

  return combo;
};

const displayCombo = (combo) => {
  const comboEl = document.getElementById("combo");

  let icon = "";
  let comboHtml = "";
  combo.forEach((letter) => {
    switch (letter) {
      case 0:
        icon = "keyboard_arrow_left";
        break;
      case 1:
        icon = "keyboard_arrow_right";
        break;
      case 2:
        icon = "keyboard_arrow_up";
        break;
      case 3:
        icon = "keyboard_arrow_down";
        break;
    }

    comboHtml += `<span class="material-symbols-outlined">${icon}</span>`;
  });

  comboEl.innerHTML = comboHtml;
};

const checkLetter = (letter) => {
  if (gameProps.isGameOver) {
    return;
  }

  if (gameProps.combo[gameProps.currentLetter] === letter) {
    gameProps.currentLetter++;
    indicatorClass = "correct";

    // If we've got to the last letter in the combo, the user has won, generate a new combo
    if (gameProps.currentLetter === gameProps.combo.length) {
      gameProps.wins++;
      gameProps.currentLetter = 0;
      gameProps.combo = generateCombo();
      displayCombo(gameProps.combo);
    }
  } else {
    // deduct time for incorrect input
    //gameProps.time -= 1;
    //gameProps.wins--;

    console.log("Incorrect input");
    console.log(gameProps, letter, gameProps.combo[gameProps.currentLetter]);

    // If the user has gone into negative wins, end the game
    if (gameProps.wins < 0) {
      endGame();
    }

    //document.getElementById("false").play();
    const mainEl = document.querySelector("main");
    mainEl.classList.add("shake");
    setTimeout(function () {
      mainEl.classList.remove("shake");
    }, 1000);
  }
  const status = document.getElementById("status");
  status.textContent = `Score: ${gameProps.wins}`;
};

const onKeyPress = (e) => {
  switch (e.key) {
    case "ArrowLeft":
      checkLetter(0);
      break;
    case "ArrowRight":
      checkLetter(1);
      break;
    case "ArrowUp":
      checkLetter(2);
      break;
    case "ArrowDown":
      checkLetter(3);
      break;
    case " ":
      if (gameProps.isPlaying) {
        if (gameProps.isPaused) {
          resumeGame();
          gameProps.isPaused = false;
        } else {
          pauseGame();
          gameProps.isPaused = true;
        }
      } else {
        gameProps.isPlaying = true;
        startGame();
      }
      break;
  }
};

// only load once the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  this.documentElement.addEventListener("keydown", onKeyPress);
});
