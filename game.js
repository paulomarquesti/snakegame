const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore'); 
const startBtn = document.getElementById('startBtn'); 

let highScore = localStorage.getItem('snakeHighScore') || 0;
let snake, direction, food, score, gameInterval, isRunning = false; 

highScoreSpan.textContent = highScore;

function spawnFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    ctx.fillStyle = 'green'; 
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20); 
    });

    // Desenha a comida
    ctx.fillStyle = 'red'; 
    ctx.fillRect(food.x, food.y, 20, 20); 
}

function moveSnake() {
    const head = { ...snake[0] }; // Cria uma nova cabeça baseada na posição atual

    // Atualiza a posição da cabeça conforme a direção
    if (direction === 'right') head.x += 20;
    if (direction === 'left') head.x -= 20;
    if (direction === 'up') head.y -= 20;
    if (direction === 'down') head.y += 20;

    snake.unshift(head); // Adiciona a nova cabeça ao início do array

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++; 
        scoreSpan.textContent = score;
        // Verifica se bateu o recorde
    if (score > highScore) {
        highScore = score;
        highScoreSpan.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    } 
        food = spawnFood(); 
    } else {
        snake.pop(); 
    }
    // Verifica colisão com parede ou com o próprio corpo
    if (
        head.x < 0 || head.x >= canvas.width || // Colisão com parede horizontal
        head.y < 0 || head.y >= canvas.height || // Colisão com parede vertical
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y) // Colisão com o próprio corpo
    ) {
        stopGame(); // Para o jogo
        alert('GAME OVER! SCORE: ' + score); 
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
    gameInterval = setInterval(gameLoop, 100); // Inicia o loop do jogo na velocidade 100ms
}

function stopGame() {
    clearInterval(gameInterval); 
    isRunning = false; 
    startBtn.textContent = "START";
}

document.addEventListener('keydown', (e) => {
    if (!isRunning) return; 
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

document.getElementById('upBtn').addEventListener('click', () => {
    if (isRunning && direction !== 'down') direction = 'up';
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (isRunning && direction !== 'up') direction = 'down';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (isRunning && direction !== 'right') direction = 'left';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (isRunning && direction !== 'left') direction = 'right';
});

startBtn.addEventListener('click', () => {
    if (isRunning) {
        stopGame();
        startBtn.textContent = "START";
    } else {
        startGame();
        startBtn.textContent = "PAUSE";
    }
});