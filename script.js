/*const canvas = document.getElementById("gameCanvas");
const ratio = window.devicePixelRatio || 1;
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth * ratio;
canvas.height = canvas.offsetHeight * ratio;
ctx.scale(ratio, ratio); // ctx es el contexto 2D del canvas*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;


const scoreBoard = document.getElementById("scoreBoard");
const startScreen = document.getElementById("startScreen");
const overlay = document.getElementById("overlay");
const beepSound = document.getElementById("beep");
const deathSound = document.getElementById("death");

const speedDisplay = document.getElementById("speedDisplay");

function updateSpeedDisplay(mode) {
  speedDisplay.textContent = `Velocidad: ${mode}`;
}


const gridSize = 6; // Tamaño del bloque
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [{ x: 10, y: 10 }];
let apple = generateApple();
let velocity = { x: 1, y: 0 };
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameRunning = false;
let gameSpeed = 150; // velocidad lenta por defecto


function gameLoop() {
  if (!gameRunning || isPaused) return;

  update();
  draw();

  setTimeout(gameLoop, gameSpeed);
}




function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // Comer manzana
  if (head.x === apple.x && head.y === apple.y) {
    snake.unshift(head);
    apple = generateApple();
    score++;
    updateScore();
    updateLevel();
    beepSound.currentTime = 0;
    beepSound.play();
    if (navigator.vibrate) navigator.vibrate(100);

  } else {
    snake.pop();
    snake.unshift(head);
  }

  // Colisión con bordes
  if (
    head.x < 0 || head.x >= tileCountX ||
    head.y < 0 || head.y >= tileCountY
  ) {
    endGame();
  }

  // Colisión consigo mismo
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame();
    }
  }
}

function draw() {
  ctx.fillStyle = "#cdd6b0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar víbora
  ctx.fillStyle = "#000";
  snake.forEach(part => {
    ctx.fillRect(
      part.x * gridSize + 1,
      part.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Dibujar manzana
  ctx.fillStyle = "#444";
  ctx.fillRect(
    apple.x * gridSize + 1,
    apple.y * gridSize + 1,
    gridSize - 2,
    gridSize - 2
  );
}

function updateScore() {
  scoreBoard.textContent = `Puntaje: ${score}`;
  document.getElementById("highScoreDisplay").textContent = `Récord: ${highScore}`;

}

function endGame() {
  gameRunning = false;
  canvas.classList.add("flash");
  showOverlay();
  deathSound.currentTime = 0;
  deathSound.play();

  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

  setTimeout(() => {
    canvas.classList.remove("flash");
    alert(`💀 Game Over — Puntaje: ${score}`);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      document.getElementById("highScoreDisplay").textContent = `Récord: ${highScore}`;
    }

    showStartScreen(); // ✅ esto aparece la pantalla con el botón "INICIAR"
  }, 600);
}


function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  speed = 200;
  score = 0;
  apple = generateApple();
  gameRunning = true;
  isPaused = false;
  updateScore();
}


function spawnApple() {
  let attempts = 0;
  while (attempts < 1000) {
    let newApple = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    if (!checkCollision(newApple, snake)) {
      apple = newApple;
      return;
    }
    attempts++;
  }
  console.warn("No se pudo encontrar espacio para una nueva manzana");
}


function startGame() {
  hideStartScreen();
  hideOverlay();
  resetGame();
  gameRunning = true;
  gameLoop();
}

function showStartScreen() {
  startScreen.style.display = "block";
}

function hideStartScreen() {
  startScreen.style.display = "none";
}

function showOverlay() {
  overlay.style.display = "block";
}

function hideOverlay() {
  overlay.style.display = "none";
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (velocity.y === 0) velocity = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocity.y === 0) velocity = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocity.x === 0) velocity = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocity.x === 0) velocity = { x: 1, y: 0 };
      break;
    case "Enter":
      if (!gameRunning) startGame();
      break;
      case "1":
        gameSpeed = 150;
        updateSpeedDisplay("Lenta");
        break;
      case "2":
        gameSpeed = 100;
        updateSpeedDisplay("Normal");
        break;
      case "3":
        gameSpeed = 60;
        updateSpeedDisplay("Rápida");
        break;
      case "p":
        case "P":
          togglePause();
            break;    
  }
});

document.addEventListener("keydown", function (event) {
  if (gameState === "gameOver" && event.key === "Enter") {
    resetGame();
    gameLoop();
  }
});


let level = 1;
function updateLevel() {
  let newLevel = 1;
  let newSpeed = 150;

  if (score >= 10) {
    newLevel = 2;
    newSpeed = 120;
  }
  if (score >= 20) {
    newLevel = 3;
    newSpeed = 90;
  }
  if (score >= 30) {
    newLevel = 4;
    newSpeed = 60;
  }

  if (newLevel !== level) {
    level = newLevel;
    gameSpeed = newSpeed;
    document.getElementById("levelDisplay").textContent = `Nivel: ${level}`;
  }
}



// Mostrar pantalla de inicio al cargar
showStartScreen();

// Generar manzana en un lugar libre
function generateApple() {
  let newApple;
  let collision;

  do {
    newApple = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };

    collision = snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
  } while (collision);

  return newApple;
}

const arrows = document.querySelectorAll(".arrow-btn");

arrows.forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;

    switch (dir) {
      case "up":
        if (velocity.y === 0) velocity = { x: 0, y: -1 };
        break;
      case "down":
        if (velocity.y === 0) velocity = { x: 0, y: 1 };
        break;
      case "left":
        if (velocity.x === 0) velocity = { x: -1, y: 0 };
        break;
      case "right":
        if (velocity.x === 0) velocity = { x: 1, y: 0 };
        break;
    }
  });
});

const nokiaButtons = document.querySelectorAll("#nokiaPad button");

nokiaButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;

    switch (dir) {
      case "up":
        if (velocity.y === 0) velocity = { x: 0, y: -1 };
        break;
      case "down":
        if (velocity.y === 0) velocity = { x: 0, y: 1 };
        break;
      case "left":
        if (velocity.x === 0) velocity = { x: -1, y: 0 };
        break;
      case "right":
        if (velocity.x === 0) velocity = { x: 1, y: 0 };
        break;
    }
  });
});

const startBtn = document.getElementById("startBtn");


startBtn.addEventListener("click", () => {
  if (!gameRunning) startGame();
});

const speedButtons = document.querySelectorAll("#speedControls button");

speedButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.speed;

    switch (mode) {
      case "slow":
        gameSpeed = 150;
        updateSpeedDisplay("Lenta");
        break;
      case "normal":
        gameSpeed = 100;
        updateSpeedDisplay("Normal");
        break;
      case "fast":
        gameSpeed = 60;
        updateSpeedDisplay("Rápida");
        break;
    }
  });
});

let isPaused = false;
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  togglePause();
});
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "▶️ Reanudar";
  } else {
    pauseBtn.textContent = "⏸️ Pausar";
    gameLoop(); // vuelve a correr el loop
  }
}



