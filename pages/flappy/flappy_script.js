let canvasWidth = 900;
let canvasHeight = 600;
let interval = null;

let playerX = 125;
let playerY = 200;
let playerRadius = 20;
let playerChangeY = 0;
let pipeWidth = 100;
let pipeGap = 150;

let playerHit = false;

let gameStarted = false;
let gameCanRestart = false;
let score = 0;
let timer = 0;

function showInstructions() {
    gameCanvas.start();
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "darkblue";
    ctx.font = "20px Arial";
    ctx.fillText("Press any key to start", 300, 290);
    // draw player
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2, true);
    ctx.fill();
}

function startGame() {
    interval = setInterval(updateCanvas, 20);
    player = new createPlayer(playerY);
    let randomHeight = Math.floor(Math.random() * 5) * 100 + 25;
    firstPipe = new createPipe(randomHeight);
    pipes.push(firstPipe);
}

let gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
    }
}

window.onkeydown = function(e) {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
        return;
    }
    if (playerHit) {
        return;
    }
    playerChangeY -= 10;
    if (playerChangeY > -5) {
        playerChangeY = -5;
    }
    if (playerChangeY < -10) {
        playerChangeY = -10;
    }
}

window.onclick = function() {
    if (playerHit) {
        if (gameCanRestart) {
            clearInterval(interval);
            playerChangeY = 0;
            pipes = [];
            timer = 0;
            score = 0;
            playerHit = false;
            gameCanRestart = false;
            gameStarted = false;
            showInstructions();
        }
        return;
    }
}

function createPlayer(y) {
    this.y = y;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(playerX, this.y, playerRadius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    this.move = function() {
        playerChangeY += .4;
        this.y += playerChangeY;
        //check for collision with pipes
        if (playerHit) return;
        for (let i = 0; i < pipes.length; i++) {
            let verticalCollision = this.y + playerRadius > pipes[i].y + pipeGap || this.y - playerRadius < pipes[i].y;
            let horizontalCollision = playerX + playerRadius > pipes[i].x && playerX - playerRadius < pipes[i].x + pipeWidth;
            if (verticalCollision && horizontalCollision) {
                playerHit = true;
                timer = 0;
            }
        }
    }
}

function createPipe(topPipeY) {
    this.x = canvasWidth;
    this.y = topPipeY;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, 0, pipeWidth, topPipeY);
        ctx.fillRect(this.x, topPipeY + pipeGap, pipeWidth, canvasHeight);
    }

    this.move = function() {
        this.x -= 3;
    }
}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.move();
    player.draw();
    drawFloor();
    for (let i = 0; i < pipes.length; i++) {
        if (!playerHit) {
            pipes[i].move();
        }
        pipes[i].draw();
    }

    oneSecondTimer();

    if (playerHit) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText(`Your score: ${score}`, canvasWidth / 2 - 110, canvasHeight / 2 - 100);
        ctx.fillText(`High score: ?`, canvasWidth / 2 - 110, canvasHeight / 2 - 50);
        if (gameCanRestart) {
            ctx.fillText("Click to restart", canvasWidth / 2 - 110, canvasHeight / 2 + 30);
        }
        return;
    }

    drawScore();
}

function oneSecondTimer() {
    timer += .01;
    if (timer >=1) {
        timer = 0;
        if (playerHit) {
            gameCanRestart = true;
        }
        else {
            let randomHeight = Math.floor(Math.random() * 5) * 100 + 25;
            newPipe = new createPipe(randomHeight);
            pipes.push(newPipe);
            if (pipes.length > 3) {
                score++;
            }
            if (pipes.length > 4) {
                pipes.shift();
            }
        }
        
    }
}

let pipes = [];

function drawFloor() {

}

function drawScore() {
    ctx = gameCanvas.context;
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(score, canvasWidth / 2, canvasHeight / 10);
}
