const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore'); 
const startBtn = document.getElementById('startBtn'); 

let highScore = localStorage.getItem('snakeHighScore') || 0;
let snake, direction, food, score, gameInterval, isRunning = false, isPaused = false, isGameOver = false; 

highScoreSpan.textContent = highScore;

//SFX
function playSound(src) {
    const sound = new Audio(src);
    sound.play();
}

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
        playSound('glup.wav');
        score++; 
        scoreSpan.textContent = score;
        food = spawnFood();
        if (score > highScore) {
        highScore = score;
        playSound('record.ogg');
        highScoreSpan.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
        }    
    } else {
        snake.pop(); 
    }
    // Verifica colisão com parede ou com o próprio corpo
    if (
        head.x < 0 || head.x >= canvas.width || // Colisão com parede horizontal
        head.y < 0 || head.y >= canvas.height || // Colisão com parede vertical
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y) // Colisão com o próprio corpo
    ) {
        endGame(); // Para o jogo
    }
}

function gameLoop() {
    moveSnake(); 
    draw(); 
}

function startGame() {
    playSound('start.wav');
    snake = [{ x: 200, y: 200 }];
    direction = 'right';
    food = spawnFood();
    score = 0;
    scoreSpan.textContent = score;
    isRunning = true;
    isPaused = false;
    isGameOver = false;
    draw();
    gameInterval = setInterval(gameLoop, 100);
    startBtn.textContent = "PAUSE";
}

function pauseGame() {
    playSound('pause.mp3');
    clearInterval(gameInterval);
    isRunning = false;
    isPaused = true;
    startBtn.textContent = "RESUME";
    startBtn.classList.add("blinking");
}

function resumeGame() {
    playSound('resume.mp3');
    isRunning = true;
    isPaused = false;
    gameInterval = setInterval(gameLoop, 100);
    startBtn.textContent = "PAUSE";
    startBtn.classList.remove("blinking");
}

function endGame() {
    playSound('gameover.wav');
    clearInterval(gameInterval);
    isRunning = false;
    isPaused = false;
    isGameOver = true;
    startBtn.textContent = "START";
    startBtn.classList.remove("blinking");
    setTimeout(() => {
        alert('GAME OVER! SCORE: ' + score);
    }, 300);
}

document.addEventListener('keydown', (e) => {
    playSound('select.wav');
    if (!isRunning) return; 
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

document.getElementById('upBtn').addEventListener('click', () => {
    playSound('select.wav');
    if (isRunning && direction !== 'down') direction = 'up';
});
document.getElementById('downBtn').addEventListener('click', () => {
    playSound('select.wav');
    if (isRunning && direction !== 'up') direction = 'down';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    playSound('select.wav');
    if (isRunning && direction !== 'right') direction = 'left';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    playSound('select.wav');
    if (isRunning && direction !== 'left') direction = 'right';
});

startBtn.addEventListener('click', () => {
    if (!isRunning && !isPaused && !isGameOver) {
        // Estado inicial: começar o jogo
        startGame();
    } else if (isRunning) {
        // Jogo rodando: pausar
        pauseGame();
    } else if (isPaused) {
        // Jogo pausado: retomar
        resumeGame();
    } else if (isGameOver) {
        // Após Game Over: reiniciar
        startGame();
    }
});