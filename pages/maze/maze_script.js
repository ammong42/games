let canvasWidth = 600;
let canvasHeight = 400;
let interval = setInterval(updateCanvas, 20);

let player;
let playerXPosition = 0;
let playerYPosition = 0;
let playerChangeX = 0;
let playerChangeY = 0;
let playerWidth = 25;
let playerHeight = 25;
let playerSpeed = 2;

function startGame() {
    gameCanvas.start();
    player = new createPlayer(playerXPosition, playerYPosition);
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
    if (e.key == "ArrowLeft") {
        playerChangeX = -1;
    }
    if (e.key == "ArrowRight") {
        playerChangeX = 1;
    }
    if (e.key == "ArrowUp") {
        playerChangeY = -1;
    }
    if (e.key == "ArrowDown") {
        playerChangeY = 1;
    }
}

window.onkeyup = function(e) {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
        playerChangeX = 0;
    }
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        playerChangeY = 0;
    }
}

function createPlayer(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, playerWidth, playerHeight);
    }
    
    this.move = function() {
        let oldX = this.x;
        let oldY = this.y;
        this.x += (playerChangeX * playerSpeed);
        this.y += (playerChangeY * playerSpeed);
        if (this.x < 0) {this.x = 0};
        if (this.x + playerWidth > canvasWidth) {this.x = canvasWidth - playerWidth};
        if (this.y < 0) {this.y = 0};
        if (this.y + playerHeight > canvasHeight) {this.y = canvasHeight - playerHeight};
        for (let wall of walls) {
            let horizontalCollision = this.x < wall[0] + wall[2] && this.x + playerWidth > wall[0];
            let verticalCollision = this.y < wall[1] + wall[3] && this.y + playerHeight > wall[1];
            if (horizontalCollision && verticalCollision) {
                let collidesWithoutMovingX = oldX < wall[0] + wall[2] && oldX + playerWidth > wall[0];
                if (collidesWithoutMovingX) {
                    this.y = oldY;
                }
                let collidesWithoutMovingY = oldY < wall[1] + wall[3] && oldY + playerHeight > wall[1];
                if (collidesWithoutMovingY) {
                    this.x = oldX;
                }
            }
        }
    }
}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    player.move();
    player.draw();
    drawWalls();
}

const walls = [[48, 50, 4, 100], [98, 100, 4, 200]];

function drawWalls() {
    ctx = gameCanvas.context;
    ctx.fillStyle = "black";
    for (let wall of walls) {
        ctx.fillRect(...wall)
    }
}