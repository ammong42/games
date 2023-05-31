let canvasWidth = 900;
let canvasHeight = 600;
let interval = null;

let playerX = 125;
let playerY = 200;
let playerRadius = 20;
let playerChangeY = 0;
let pipeWidth = 100;
let pipeGap = 150;

let restartButtonX = 295;
let restartButtonY = 320;
let buttonWidth = 140;
let buttonHeight = 50;

let playerHit = false;
let gameStarted = false;
let score = 0;
let timer = 0;
const HIGH_SCORE = "highScore";

let playerImg = document.getElementById("playerImage");

function showInstructions() {
    gameCanvas.start();
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Press any key to start", 260, 290);
    // draw player
    /*
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2, true);
    ctx.fill();
    */
    
    ctx.drawImage(playerImg, playerX - playerRadius * 2, playerY - playerRadius * 1.7, playerImg.width / 6, playerImg.height / 6);
}

function startGame() {
    interval = setInterval(updateCanvas, 20);
    player = new createPlayer(playerY);
    let randomHeight = Math.floor(Math.random() * 4) * 100 + 75;
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
   playerChangeY = -8.5;
}

window.onclick = function(e) {
    if (playerHit) {
        var mousePos = getMousePos(gameCanvas.canvas, e);
        if (isInside(mousePos, restartButton)) {
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
    }
}

function createPlayer(y) {
    this.y = y;

    this.draw = function() {
        ctx = gameCanvas.context;
        /*
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(playerX, this.y, playerRadius, 0, Math.PI * 2, true);
        ctx.fill();
        */
        ctx.drawImage(playerImg, playerX - playerRadius * 2, this.y - playerRadius * 1.7, playerImg.width / 6, playerImg.height / 6);
    }

    this.move = function() {
        playerChangeY += .5; //.4
        if (playerChangeY > 8) playerChangeY = 8;
        this.y += playerChangeY;
        //check for collision with pipes
        if (playerHit) return;
        for (let i = 0; i < pipes.length; i++) {
            let verticalCollision = this.y + playerRadius > pipes[i].y + pipeGap || this.y - playerRadius < pipes[i].y;
            let horizontalCollision = playerX + playerRadius > pipes[i].x && playerX - playerRadius < pipes[i].x + pipeWidth;
            if (verticalCollision && horizontalCollision) {
                playerHit = true;
            }
        }
        //check for collision with ground
        if (this.y + playerRadius > canvasHeight) {
            playerHit = true;
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
        ctx.fillStyle = "orange";
        ctx.fillRect(restartButtonX, restartButtonY, buttonWidth, buttonHeight);
        ctx.fillRect(470, 320, 140, 50);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText(`Score: ${score}`, canvasWidth / 2 - 80, canvasHeight / 2 - 100);
        ctx.fillText(`Best:   ${getHighScore()}`, canvasWidth / 2 - 80, canvasHeight / 2 - 50);
        ctx.fillText("Restart", 300, 360);
        ctx.fillText("Skins", 490, 360);

        return;
    }

    drawScore();
}

function oneSecondTimer() {
    if (playerHit) {
        return;
    }
    timer += .01;
    if (timer >=1) {
        timer = 0;

        let randomHeight = Math.floor(Math.random() * 4) * 100 + 75;
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

let pipes = [];

function drawFloor() {

}

function drawScore() {
    ctx = gameCanvas.context;
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(score, canvasWidth / 2, canvasHeight / 10);
}

function getHighScore() {
    let highScore = localStorage.getItem(HIGH_SCORE) ?? 0;
    if (score > highScore) {
        localStorage.setItem(HIGH_SCORE, score);
        return score;
    }
    return highScore;
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
}

let restartButton = {
    x: restartButtonX,
    y: restartButtonY,
    width: buttonWidth,
    height: buttonHeight,
};