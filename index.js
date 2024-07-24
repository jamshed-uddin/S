// registering service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(() => {
        // console.log("Registered", reg.scope)
      })
      .catch((err) => console.log(err));
  });
}

//defining html element

const board = document.getElementById("game-board");
const score = document.getElementById("score");
const highScoreElem = document.getElementById("high-score");

const instructionText = document.getElementById("instruction-text-desktop");

const restart = document.getElementById("restart");
const moveUp = document.getElementById("move-up");
const moveDown = document.getElementById("move-down");
const moveLeft = document.getElementById("move-left");
const moveRight = document.getElementById("move-right");
const pauseResume = document.getElementById("pause-resume");

// game variables
const gridSize = 18;
let snake = [{ x: 9, y: 9 }];
let food = generateFood();
let direction = "up";
let gameInterval;
let gameSpeedDelay = 400;
let gameStarted = false;
let highScore = localStorage.getItem("highScore") || 0;
let collided = false;
let gamePaused = false;

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((seg) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, seg);
    board.appendChild(snakeElement);
  });
}

// create snake or food
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set position
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// draw snake

// draw();

// draw food
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

drawSnake();
drawFood();

// generating random food position
function generateFood() {
  let foodPosition;

  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      generateFood();
    } else {
      foodPosition = { x, y };
    }
  }

  return foodPosition;
}

//moving snake

function move() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  collided = false;
  gameStarted = true;
  gamePaused = false;
  pauseResume.textContent = "Pause";
  instructionText.style.display = "none";
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// create event Listener

function handleKeyPress(e) {
  if (
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight"
  ) {
    // console.log("keypressed");
    direction = e.key.slice(5).toLowerCase();
    startGame();
    gamePaused = false;
  }
}

document.addEventListener("keydown", handleKeyPress);

function pauseOrResumeBySpace(e) {
  if (!gameStarted || collided) return;
  if (gamePaused) {
    // resume game
    // console.log("resume game");
    gamePaused = false;
    pauseResume.textContent = "Pause";
    startGame();
  } else {
    // pause game
    // console.log("pause game");
    gamePaused = true;
    pauseResume.textContent = "Resume";

    stopGame();
  }
}

pauseResume.addEventListener("click", () => {
  // console.log("hello");
  pauseOrResumeBySpace();
});

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.code === "space") {
    pauseOrResumeBySpace();
  }
});

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  collided = true;
  restart.style.display = "";
  stopGame();
  updateHighScore();
  snake = [{ x: 9, y: 9 }];
  food = generateFood();
  //   direction = "right";
  gameSpeedDelay = 400;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  if (currentScore >= 6) {
    gameSpeedDelay = 350;
  }
  if (currentScore >= 12) {
    gameSpeedDelay = 300;
  }
  if (currentScore >= 18) {
    gameSpeedDelay = 250;
  }
  if (currentScore >= 24) {
    gameSpeedDelay = 200;
  }
  if (currentScore >= 50) {
    gameSpeedDelay = 180;
  }

  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  // gameStarted = false;

  // instructionText.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;

  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreElem.textContent = `HI ${highScore.toString().padStart(3, "0")}`;
    highScoreElem.style.display = "block";
    highScoreElem.style.display = "block";
    localStorage.setItem("highScore", currentScore);
  }
}
function showHighScore() {
  if (highScore > 0) {
    highScoreElem.textContent = `HI ${highScore.toString().padStart(3, "0")}`;
    highScoreElem.style.display = "block";
  }
}
showHighScore();

function startGameByBtnInMobile() {
  // if (!gameStarted || gamePaused) {
  //   // direction = e.key.slice(5).toLowerCase();

  // }
  startGame();
}

// mobile direction
const mobileDirection = {
  up: function () {
    direction = "up";
    startGameByBtnInMobile();
  },
  down: function () {
    direction = "down";
    startGameByBtnInMobile();
  },
  left: function () {
    direction = "left";
    startGameByBtnInMobile();
  },
  right: function () {
    direction = "right";
    startGameByBtnInMobile();
  },
};

moveUp.addEventListener("click", mobileDirection.up);
moveDown.addEventListener("click", mobileDirection.down);
moveLeft.addEventListener("click", mobileDirection.left);
moveRight.addEventListener("click", mobileDirection.right);
