const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('highScore'); 
const startBtn = document.getElementById('startBtn'); 

let snake, direction, food, score, gameInterval, isRunning = false; // Variáveis globais do jogo

function spawnFood() {
    // Gera uma posição aleatória para a comida, alinhada à grade de 20px
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Desenha cada segmento da cobra
    ctx.fillStyle = 'green'; // Define cor da cobra
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20); // Desenha segmento da cobra
    });

    // Desenha a comida
    ctx.fillStyle = 'red'; // Define cor da comida
    ctx.fillRect(food.x, food.y, 20, 20); // Desenha a comida
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
        score++; // Incrementa a pontuação
        scoreSpan.textContent = score; // Atualiza o placar na tela
        food = spawnFood(); // Gera nova comida
    } else {
        snake.pop(); // Remove o último segmento (movimento normal)
    }

    // Verifica colisão com parede ou com o próprio corpo
    if (
        head.x < 0 || head.x >= canvas.width || // Colisão com parede horizontal
        head.y < 0 || head.y >= canvas.height || // Colisão com parede vertical
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y) // Colisão com o próprio corpo
    ) {
        stopGame(); // Para o jogo
        alert('GAME OVER! SCORE: ' + score); // Exibe mensagem de fim de jogo
    }
}

function gameLoop() {
    moveSnake(); // Atualiza a posição da cobra
    draw(); // Redesenha o jogo
}

function startGame() {
    if (isRunning) return; // Se já estiver rodando, não faz nada
    snake = [{ x: 200, y: 200 }]; // Inicializa a cobra no centro
    direction = 'right'; // Define direção inicial
    food = spawnFood(); // Gera a primeira comida
    score = 0; // Zera a pontuação
    scoreSpan.textContent = score; // Atualiza o placar
    isRunning = true; // Marca que o jogo está rodando
    draw(); // Desenha o estado inicial
    gameInterval = setInterval(gameLoop, 100); // Inicia o loop do jogo (100ms)
}

function stopGame() {
    clearInterval(gameInterval); // Para o loop do jogo
    isRunning = false; // Marca que o jogo parou
    startBtn.textContent = "START";
}

document.addEventListener('keydown', (e) => {
    if (!isRunning) return; // Só aceita comandos se o jogo estiver rodando
    // Muda a direção da cobra conforme a tecla pressionada, evitando reversão direta
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
// Inicia o jogo ao clicar*/
startBtn.addEventListener('click', () => {
    if (isRunning) {
        stopGame();
        startBtn.textContent = "START";
    } else {
        startGame();
        startBtn.textContent = "PAUSE";
    }
});