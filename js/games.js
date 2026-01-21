// Game Bar Controller
class GameBar {
    constructor() {
        this.isOpen = false;
        this.activeGame = null;
        this.init();
    }

    init() {
        this.createGameBarUI();
        this.attachListeners();
    }

    createGameBarUI() {
        const gameHTML = `
            <div id="gameToggle" class="game-toggle" title="Play Mini Games">
                <i class="fas fa-gamepad"></i>
            </div>
            
            <div id="gameBar" class="game-bar">
                <div class="game-bar-header">
                    <h3>Mini Games</h3>
                    <button id="closeGameBar"><i class="fas fa-times"></i></button>
                </div>
                <div class="game-list">
                    <button class="game-btn" data-game="quiz">
                        <i class="fas fa-question-circle"></i> Quiz
                    </button>
                    <button class="game-btn" data-game="snake">
                        <i class="fas fa-worm"></i> Snake
                    </button>
                </div>
                <div id="gameContainer" class="game-container">
                    <div class="game-placeholder">Select a game to play!</div>
                </div>
                <div class="game-bar-footer">
                    <a href="playground.html" class="full-pg-btn">
                        <i class="fas fa-rocket"></i> Open Full Playground
                    </a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', gameHTML);
    }

    attachListeners() {
        // ... (existing listeners) ...
        const toggle = document.getElementById('gameToggle');
        const bar = document.getElementById('gameBar');
        const close = document.getElementById('closeGameBar');
        const buttons = document.querySelectorAll('.game-btn');

        toggle.addEventListener('click', () => {
            bar.classList.add('active');
            toggle.classList.add('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling when open
        });

        close.addEventListener('click', () => {
            bar.classList.remove('active');
            toggle.classList.remove('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            this.stopActiveGame();
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.currentTarget.getAttribute('data-game');
                this.loadGame(gameType);
            });
        });
    }

    // ... (rest of methods) ...

    // --- SNAKE GAME ---
    startSnake(container) {
        container.innerHTML = `
            <canvas id="snakeCanvas" width="280" height="280"></canvas>
            <div class="snake-controls">Use Arrow Keys</div>
            <button class="restart-btn" style="margin-top:5px;">Restart</button>
        `;
        
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');
        const restartBtn = container.querySelector('.restart-btn');
        
        const box = 20;
        let snake = [{ x: 9 * box, y: 10 * box }];
        let food = {
            x: Math.floor(Math.random() * 14) * box,
            y: Math.floor(Math.random() * 14) * box
        };
        let d = null;
        let score = 0;

        // Named function so we can remove it later
        const handleKey = (event) => {
            // Prevent default scrolling for arrow keys
            if([37, 38, 39, 40].includes(event.keyCode)) {
                event.preventDefault();
            }

            if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if (event.keyCode == 38 && d != "DOWN") d = "UP";
            else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if (event.keyCode == 40 && d != "UP") d = "DOWN";
        };

        document.addEventListener('keydown', handleKey);

        // ... (drawing logic same as before) ...
        const draw = () => {
            ctx.fillStyle = "#1A1F3A"; // Dark BG
            ctx.fillRect(0, 0, 280, 280);

            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#00D9A3" : "#FFFFFF"; // Green head, white body
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#1A1F3A";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = "#F42A41"; // Red food
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (d == "LEFT") snakeX -= box;
            if (d == "UP") snakeY -= box;
            if (d == "RIGHT") snakeX += box;
            if (d == "DOWN") snakeY += box;

            if (snakeX == food.x && snakeY == food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 14) * box,
                    y: Math.floor(Math.random() * 14) * box
                };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };

            if (snakeX < 0 || snakeX > 260 || snakeY < 0 || snakeY > 260 || collision(newHead, snake)) {
                clearInterval(this.activeGameInterval);
                document.removeEventListener('keydown', handleKey); // Clean up listener
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText("Game Over! Score: " + score, 40, 140);
                return;
            }

            snake.unshift(newHead);
        };

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }

        this.activeGameInterval = setInterval(draw, 150);
        
        restartBtn.onclick = () => {
            clearInterval(this.activeGameInterval);
            document.removeEventListener('keydown', handleKey); // Clean up before restarting
            this.startSnake(container);
        };
    }

}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GameBar();
});
