let canvasWidth = 900;
let canvasHeight = 600;
let interval = setInterval(updateCanvas, 20);

let player;
let playerXPosition = 67;
let playerYPosition = 67;
let playerChangeX = 0;
let playerChangeY = 0;
let playerWidth = 25;
let playerHeight = 25;
let playerSpeed = 2;
let hasShadow = true;
let lightSize = 80;

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
        if (hasShadow) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - canvasWidth, this.y - canvasHeight, canvasWidth * 3, canvasHeight * 3);
            ctx.clearRect(this.x - lightSize, this.y - lightSize, lightSize * 2 + playerWidth, lightSize * 2 + playerHeight);
        }
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, playerWidth, playerHeight);
    }
    
    this.move = function() {
        let oldX = this.x;
        let oldY = this.y;
        this.x += (playerChangeX * playerSpeed);
        this.y += (playerChangeY * playerSpeed);
        // correct for collisions with boundaries
        if (this.x < 0) {this.x = 0};
        if (this.x + playerWidth > canvasWidth) {this.x = canvasWidth - playerWidth};
        if (this.y < 0) {this.y = 0};
        if (this.y + playerHeight > canvasHeight) {this.y = canvasHeight - playerHeight};
        // correct for collisions with walls
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
        // check if goal reached
        let horizontalCollision = this.x < goalX + goalRadius && this.x + playerWidth > goalX - goalRadius;
        let verticalCollision = this.y < goalY + goalRadius && this.y + playerHeight > goalY - goalRadius;
        if (horizontalCollision && verticalCollision) {
            goalReached = true;
        }
        // check if lantern reached
        horizontalCollision = this.x < lanternX + lanternRadius && this.x + playerWidth > lanternX - lanternRadius;
        verticalCollision = this.y < lanternY + lanternRadius && this.y + playerHeight > lanternY - lanternRadius;
        if (horizontalCollision && verticalCollision) {
            lanternReached = true;
            lightSize = 150;
        }
    }
}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    player.move();
    player.draw();
    drawWalls();
    drawObjects();
}

let wallCoordinates = [[1, 1, 0, 3], [1, 1, 3, 0], [4, 1, 0, 1], [5, 1, 0, 2], [1, 5, 0, 6], [2, 2, 0, 4], [2, 2, 2, 0], [2, 3, 3, 0]];
let walls = [];
for (let wall of wallCoordinates) {
    let wallX = wall[0] * 50 - 2;
    let wallY = wall[1] * 50 - 2;
    let wallWidth = wall[2] * 50 + 4;
    let wallHeight = wall[3] * 50 + 4;
    let newWall = [wallX, wallY, wallWidth, wallHeight];
    walls.push(newWall);
}

function drawWalls() {
    ctx = gameCanvas.context;
    ctx.fillStyle = "black";
    for (let wall of walls) {
        ctx.fillRect(...wall)
    }
}

let lanternX = 125;
let lanternY = 125;
let lanternRadius = 13;
let lanternReached = false;

let goalX = 615;
let goalY = 415;
let goalRadius = 13;
let goalReached = false;

function drawObjects() {
    ctx = gameCanvas.context;
    ctx.fillStyle = "yellow";
    // draw goal
    ctx.beginPath();
    ctx.arc(goalX, goalY, goalRadius, 0, Math.PI * 2, true);
    ctx.fill();
    // draw lantern
    if (!lanternReached) {
        ctx.beginPath();
        ctx.arc(lanternX, lanternY, lanternRadius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.fillStyle = "rebeccapurple";
        ctx.beginPath();
        ctx.arc(lanternX, lanternY, lanternRadius - 5, 0, Math.PI * 2, true);
        ctx.fill();
    }

}