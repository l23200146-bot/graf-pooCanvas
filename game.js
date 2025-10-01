// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false, color = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game
class Game {
    constructor() {
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 4, 'white'),
            new Ball(canvas.width / 2, canvas.height / 2, 15, 3, 5, 'red'),
            new Ball(canvas.width / 2, canvas.height / 2, 8, 5, 3, 'yellow'),
            new Ball(canvas.width / 2, canvas.height / 2, 12, 4, 2, 'green'),  // nueva pelota
            new Ball(canvas.width / 2, canvas.height / 2, 7, 6, 4, 'orange')   // nueva pelota
        ];

        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true, '#ffb6c1');
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, false, '#9370db');

        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Mover paleta del jugador
        if (this.keys['ArrowUp']) this.paddle1.move('up');
        if (this.keys['ArrowDown']) this.paddle1.move('down');

        // Mover paleta de la IA usando la primera pelota
        this.paddle2.autoMove(this.balls[0]);

        // Actualizar todas las pelotas
        this.balls.forEach(ball => {
            ball.move();

            // Colisiones con paletas
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }

            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Reset si sale del borde
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    handleInput() {
        window.addEventListener('keydown', (event) => this.keys[event.key] = true);
        window.addEventListener('keyup', (event) => this.keys[event.key] = false);
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Ejecutar juego
const game = new Game();
game.run();
