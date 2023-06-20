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
let skinsButtonX = 470;
let skinsButtonY = 320;
let playButtonX = 380;
let playButtonY = 500;
let buttonWidth = 140;
let buttonHeight = 50;

let selectionFirstRow = 50;
let selectionSecondRow = 260;
let selectionFirstColumn = 80;
let selectionSecondColumn = 350;
let selectionThirdColumn = 620;
let selectionWidth = 200;
let selectionHeight = 150;

let playerHit = false;
let gameStarted = false;
let score = 0;
let timer = 0;
const HIGH_SCORE = "highScore";

let skinsPage = false;

let skin = 0;
let playerImg = document.getElementById("playerImage");
let nerdImg = document.getElementById("nerdImage");
let thirdImg = document.getElementById("thirdImage");
let turdImg = document.getElementById("turdImage");
let herdImg = document.getElementById("herdImage");

function showInstructions() {
    gameCanvas.start();
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Press any key to start", 260, 290);

    player = new createPlayer(playerY);
    player.draw();
}

function startGame() {
    interval = setInterval(updateCanvas, 20);
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
    var mousePos = getMousePos(gameCanvas.canvas, e);
    if (skinsPage) {
        if (isInside(mousePos, birdSelection)) {
            skin = 0;
            drawSkinsPage();
        }
        if (isInside(mousePos, nerdSelection)) {
            skin = 1;
            drawSkinsPage();
        }
        if (isInside(mousePos, thirdSelection)) {
            skin = 2;
            drawSkinsPage();
        }
        if (isInside(mousePos, turdSelection)) {
            skin = 3;
            drawSkinsPage();
        }
        if (isInside(mousePos, herdSelection)) {
            skin = 4;
            drawSkinsPage();
        }
        if (isInside(mousePos, playButton)) {
            clearInterval(interval);
            playerChangeY = 0;
            pipes = [];
            timer = 0;
            score = 0;
            playerHit = false;
            gameCanRestart = false;
            gameStarted = false;
            skinsPage = false;
            showInstructions();
        }
        return;
    }
    if (playerHit) {
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
        if (isInside(mousePos, skinsButton)) {
            clearInterval(interval);
            skinsPage = true;
            drawSkinsPage();
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
        switch(skin) {
            case 1:
                ctx.drawImage(nerdImg, playerX - playerRadius * 1.33, this.y - playerRadius * 1.15, playerImg.width / 9.4, playerImg.height / 9.4);
                break;
            case 2:
                ctx.drawImage(thirdImg, playerX - playerRadius * 1.4, this.y - playerRadius * 1.35, playerImg.width / 9, playerImg.height / 8);
                break;
            case 3:
                ctx.drawImage(turdImg, playerX - playerRadius * 1.3, this.y - playerRadius * 1.2, playerImg.width / 10, playerImg.height / 10);
                break;
            case 4:
                ctx.drawImage(herdImg, playerX - playerRadius * 1.3, this.y - playerRadius * 1.4, playerImg.width / 8, playerImg.height / 8);
                break;
            default:
                ctx.drawImage(playerImg, playerX - playerRadius * 2, this.y - playerRadius * 1.7, playerImg.width / 6, playerImg.height / 6);
        }
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
        ctx.fillRect(skinsButtonX, skinsButtonY, buttonWidth, buttonHeight);

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

function drawSkinsPage() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    switch(skin) {
        case 1: // nerd
            ctx.fillRect(nerdSelection.x - 3, nerdSelection.y - 3, selectionWidth + 6, selectionHeight + 6);
            break;
        case 2: // third
            ctx.fillRect(thirdSelection.x - 3, thirdSelection.y - 3, selectionWidth + 6, selectionHeight + 6);
            break;
        case 3: // turd
        ctx.fillRect(turdSelection.x - 3, turdSelection.y - 3, selectionWidth + 6, selectionHeight + 6);
            break;
        case 4: // herd
        ctx.fillRect(herdSelection.x - 3, herdSelection.y - 3, selectionWidth + 6, selectionHeight + 6);
            break;
        default: // bird
            ctx.fillRect(birdSelection.x - 3, birdSelection.y - 3, selectionWidth + 6, selectionHeight + 6);
    }
    ctx.fillStyle = "white";
    ctx.fillRect(selectionFirstColumn, selectionFirstRow, selectionWidth, selectionHeight);
    ctx.fillRect(selectionSecondColumn, selectionFirstRow, selectionWidth, selectionHeight);
    ctx.fillRect(selectionThirdColumn, selectionFirstRow, selectionWidth, selectionHeight);
    ctx.fillRect(selectionFirstColumn, selectionSecondRow, selectionWidth, selectionHeight);
    ctx.fillRect(selectionSecondColumn, selectionSecondRow, selectionWidth, selectionHeight);
    ctx.fillStyle = "gray";
    ctx.fillRect(selectionThirdColumn, selectionSecondRow, selectionWidth, selectionHeight);
    ctx.drawImage(playerImg, 140, 90, playerImg.width / 6, playerImg.height / 6);
    ctx.drawImage(nerdImg, 420, 100, playerImg.width / 9.4, playerImg.height / 9.4);
    ctx.drawImage(thirdImg, 690, 100, playerImg.width / 9, playerImg.height / 9);
    ctx.drawImage(turdImg, 150, 310, playerImg.width / 10, playerImg.height / 10);
    ctx.drawImage(herdImg, 420, 310, playerImg.width / 8, playerImg.height / 8);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Flappy bird", 100, 230);
    ctx.fillText("Flappy nerd", 370, 230);
    ctx.fillText("Flappy third", 640, 230);
    ctx.fillText("Flappy turd", 100, 440);
    ctx.fillText("Flappy herd", 370, 440);
    ctx.fillText("?", 710, 440);

    ctx.fillStyle = "orange";
    ctx.fillRect(playButtonX, playButtonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Play", playButtonX + 30, playButtonY + 37);
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

let skinsButton = {
    x: skinsButtonX,
    y: skinsButtonY,
    width: buttonWidth,
    height: buttonHeight,
};

let playButton = {
    x: playButtonX,
    y: playButtonY,
    width: buttonWidth,
    height: buttonHeight,
}

let birdSelection = {
    x: selectionFirstColumn,
    y: selectionFirstRow,
    width: selectionWidth,
    height: selectionHeight,
}

let nerdSelection = {
    x: selectionSecondColumn,
    y: selectionFirstRow,
    width: selectionWidth,
    height: selectionHeight,
}

let thirdSelection = {
    x: selectionThirdColumn,
    y: selectionFirstRow,
    width: selectionWidth,
    height: selectionHeight,
}

let turdSelection = {
    x: selectionFirstColumn,
    y: selectionSecondRow,
    width: selectionWidth,
    height: selectionHeight,
}

let herdSelection = {
    x: selectionSecondColumn,
    y: selectionSecondRow,
    width: selectionWidth,
    height: selectionHeight,
}