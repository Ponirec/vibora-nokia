const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
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
let gameRunning = false;
let gameSpeed = 100; // velocidad normal por defecto


function gameLoop() {
  if (!gameRunning) return;

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
    beepSound.currentTime = 0;
    beepSound.play();
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
}

function endGame() {
  gameRunning = false;
  canvas.classList.add("flash");
  showOverlay();
  deathSound.currentTime = 0;
  deathSound.play();

  setTimeout(() => {
    canvas.classList.remove("flash");
    alert(`💀 Game Over — Puntaje: ${score}`);
    resetGame();
    showStartScreen();
  }, 600);
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  apple = generateApple();
  score = 0;
  updateScore();
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
      
      
  }
});

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
