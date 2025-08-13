const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

let snake, direction, food, score, gameInterval, isRunning = false;

function spawnFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { ...snake[0] };
    if (direction === 'right') head.x += 20;
    if (direction === 'left') head.x -= 20;
    if (direction === 'up') head.y -= 20;
    if (direction === 'down') head.y += 20;

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreSpan.textContent = score;
        food = spawnFood();
    } else {
        snake.pop();
    }

    // Check wall or self collision
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
    ) {
        stopGame();
        alert('Game Over! Sua pontuação: ' + score);
    }
}

function gameLoop() {
    moveSnake();
    draw();
}

function startGame() {
    if (isRunning) return;
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    food = spawnFood();
    score = 0;
    scoreSpan.textContent = score;
    isRunning = true;
    draw();
    gameInterval = setInterval(gameLoop, 100);
}

function stopGame() {
    clearInterval(gameInterval);
    isRunning = false;
}

document.addEventListener('keydown', (e) => {
    if (!isRunning) return;
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

startBtn.addEventListener('click', startGame);