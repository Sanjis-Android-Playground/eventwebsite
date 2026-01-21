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
                        <i class="fas fa-question-circle"></i> BD History Quiz
                    </button>
                    <button class="game-btn" data-game="snake">
                        <i class="fas fa-worm"></i> Freedom Snake
                    </button>
                </div>
                <div id="gameContainer" class="game-container">
                    <div class="game-placeholder">Select a game to play!</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', gameHTML);
    }

    attachListeners() {
        const toggle = document.getElementById('gameToggle');
        const bar = document.getElementById('gameBar');
        const close = document.getElementById('closeGameBar');
        const buttons = document.querySelectorAll('.game-btn');

        toggle.addEventListener('click', () => {
            bar.classList.add('active');
            toggle.classList.add('hidden');
        });

        close.addEventListener('click', () => {
            bar.classList.remove('active');
            toggle.classList.remove('hidden');
            this.stopActiveGame();
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.currentTarget.getAttribute('data-game');
                this.loadGame(gameType);
            });
        });
    }

    loadGame(type) {
        const container = document.getElementById('gameContainer');
        container.innerHTML = ''; // Clear previous game
        this.stopActiveGame();

        if (type === 'quiz') {
            this.startQuiz(container);
        } else if (type === 'snake') {
            this.startSnake(container);
        }
    }

    stopActiveGame() {
        if (this.activeGameInterval) {
            clearInterval(this.activeGameInterval);
            this.activeGameInterval = null;
        }
    }

    // --- QUIZ GAME ---
    startQuiz(container) {
        const questions = [
            { q: "When did Sheikh Hasina resign?", options: ["Aug 3", "Aug 5", "Aug 8"], a: 1 },
            { q: "Who is the Chief Adviser?", options: ["Dr. Yunus", "President Shahabuddin", "General Waker"], a: 0 },
            { q: "What was the main demand?", options: ["Lower Taxes", "Quota Reform", "New Roads"], a: 1 },
            { q: "Which movement started it?", options: ["Students", "Farmers", "Doctors"], a: 0 }
        ];
        
        let score = 0;
        let currentQ = 0;

        const renderQ = () => {
            if (currentQ >= questions.length) {
                container.innerHTML = `
                    <div class="game-result">
                        <h4>Quiz Complete!</h4>
                        <p>Score: ${score}/${questions.length}</p>
                        <button class="restart-btn">Play Again</button>
                    </div>
                `;
                container.querySelector('.restart-btn').onclick = () => this.startQuiz(container);
                return;
            }

            const q = questions[currentQ];
            let html = `<div class="quiz-box"><h4>${q.q}</h4><div class="quiz-options">`;
            q.options.forEach((opt, i) => {
                html += `<button class="quiz-opt" data-idx="${i}">${opt}</button>`;
            });
            html += `</div><p>Score: ${score}</p></div>`;
            container.innerHTML = html;

            container.querySelectorAll('.quiz-opt').forEach(btn => {
                btn.onclick = (e) => {
                    const idx = parseInt(e.target.getAttribute('data-idx'));
                    if (idx === q.a) score++;
                    currentQ++;
                    renderQ();
                };
            });
        };
        renderQ();
    }

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

        document.addEventListener('keydown', direction);

        function direction(event) {
            if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if (event.keyCode == 38 && d != "DOWN") d = "UP";
            else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if (event.keyCode == 40 && d != "UP") d = "DOWN";
        }

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

        this.activeGameInterval = setInterval(draw, 150); // Slowed down slightly for playability
        
        restartBtn.onclick = () => {
            clearInterval(this.activeGameInterval);
            this.startSnake(container);
        };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GameBar();
});
