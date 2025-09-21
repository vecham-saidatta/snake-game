// --- Game Setup ---
const board = document.getElementById('game-board');
const context = board.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const restartButton = document.getElementById('restart-button');

const GRID_SIZE = 20;
const BOARD_WIDTH = board.width;
const BOARD_HEIGHT = board.height;

// --- Game State ---
let snake, food, direction, score, isGameOver, gameLoopTimeout;

// --- API Functions ---
async function getHighScore() {
    try {
        const response = await fetch('/api/highscore');
        const data = await response.json();
        highScoreElement.textContent = data.highScore;
    } catch (error) {
        console.error("Failed to fetch high score:", error);
    }
}

async function updateHighScore() {
    try {
        await fetch('/api/highscore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: score })
        });
        await getHighScore(); // Refresh the high score display
    } catch (error) {
        console.error("Failed to update high score:", error);
    }
}

// --- Game Functions ---

function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    isGameOver = false;
    scoreElement.textContent = score;
    generateFood();
    getHighScore();
    main();
}

function main() {
    if (isGameOver) {
        updateHighScore(); // Update high score when game ends
        alert(`Game Over! Final Score: ${score}.`);
        return;
    }

    gameLoopTimeout = setTimeout(() => {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollision();
        main();
    }, 100);
}

function restartGame() {
    clearTimeout(gameLoopTimeout); // Stop the old game loop
    initializeGame(); // Start a new game
}

// ... (keep the clearBoard, drawSnake, drawFood, moveSnake, generateFood, checkCollision, and changeDirection functions exactly as they were before) ...
// NOTE: Make sure the functions below are present in your file.

function clearBoard() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function drawSnake() {
    context.fillStyle = 'lime';
    snake.forEach(segment => {
        context.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });
}

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (BOARD_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (BOARD_HEIGHT / GRID_SIZE))
    };
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x * GRID_SIZE >= BOARD_WIDTH || head.y < 0 || head.y * GRID_SIZE >= BOARD_HEIGHT) {
        isGameOver = true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameOver = true;
        }
    }
}

function changeDirection(event) {
    const keyPressed = event.key;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (keyPressed === 'ArrowUp' && !goingDown) direction = 'up';
    if (keyPressed === 'ArrowDown' && !goingUp) direction = 'down';
    if (keyPressed === 'ArrowLeft' && !goingRight) direction = 'left';
    if (keyPressed === 'ArrowRight' && !goingLeft) direction = 'right';
}


// --- Event Listeners & Game Start ---
document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', restartGame);

initializeGame(); // Start the very first game