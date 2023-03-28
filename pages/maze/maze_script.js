let canvasWidth = 900;
let canvasHeight = 600;
let backgroundColor = "rebeccapurple";
let gameStarted = false;

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

function showInstructions() {
    gameCanvas.start();
    ctx = gameCanvas.context;
    ctx.fillStyle = "orange";
    ctx.fillRect(playerXPosition, playerYPosition, playerWidth, playerHeight);
    ctx.fillStyle = "#E5E7EB";
    ctx.font = "20px Arial";
    ctx.fillText("Move your character using the arrow keys", playerXPosition + 50, playerYPosition + 20);
    ctx.fillText("Make your way through the maze to reach the goal", playerXPosition + 50, playerYPosition + 70);
    ctx.fillText("You can pick up the lantern to see farther", playerXPosition + 50, playerYPosition + 120);
    ctx.fillText("You can pick up the mystery box to trigger a random effect", playerXPosition + 50, playerYPosition + 170);
    ctx.fillText("Press any key to start", playerXPosition + 50, playerYPosition + 270);
    ctx.fillStyle = "yellow";
    // draw goal
    ctx.beginPath();
    ctx.arc(playerXPosition + goalRadius, playerYPosition + 50 + goalRadius, goalRadius, 0, Math.PI * 2, true);
    ctx.fill();
    // draw lantern
    if (!lanternReached) {
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        for (let i = 0; i < 3.5; i += .5) {
            ctx.arc(playerXPosition + lanternRadius, playerYPosition + 100 + lanternRadius, lanternRadius - i, 0, Math.PI * 2, true);
        }
        ctx.stroke();
    }
    // draw mystery box
    if (!boxReached) {
        ctx.fillStyle = "red";
        ctx.fillRect(playerXPosition, playerYPosition + 150, boxWidth, boxHeight);
    }

}

function startGame() {
    let interval = setInterval(updateCanvas, 20);
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
    if (!gameStarted) {
        gameStarted = true;
        startGame();
        return;
    }
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
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(this.x - lightSize, this.y - lightSize, lightSize * 2 + playerWidth, lightSize * 2 + playerHeight);
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
        if (horizontalCollision && verticalCollision && !goalReached) {
            goalReached = true;
        }
        // check if lantern reached
        horizontalCollision = this.x < lanternX + lanternRadius && this.x + playerWidth > lanternX - lanternRadius;
        verticalCollision = this.y < lanternY + lanternRadius && this.y + playerHeight > lanternY - lanternRadius;
        if (horizontalCollision && verticalCollision) {
            lanternReached = true;
            lightSize = 150;
        }
        // check if mystery box reached
        if (!boxReached) {
            horizontalCollision = this.x < boxX + boxWidth && this.x + playerWidth > boxX;
            verticalCollision = this.y < boxY + boxHeight && this.y + playerHeight > boxY;
            if (horizontalCollision && verticalCollision) {
                boxReached = true;
                if (goalReached) {
                    console.log("Most impressive...");
                    return;
                }
                let randomOutcome = Math.floor(Math.random() * 5);
                randomOutcome = 3;
                switch (randomOutcome) {
                    case 0:
                        playerSpeed = 4;
                        break;
                    case 1:
                        playerSpeed = 1;
                        lightSize = 200;
                        break;
                    case 2:
                        colorChanging = true;
                        break;
                    case 3:
                        alert("3...");
                        alert("2...");
                        alert("1...");
                        alert("Blast off!");
                        playerSpeed = 8;
                        break;
                    default:
                        console.log("Never gonna give you up...");
                        alert("After clicking OK: Right click -> Inspect -> Console");
                }
            }            
        }
    }
}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    oneSecondTimer();

    player.move();
    if (goalReached) {
        ctx.fillStyle = "#E5E7EB";
        ctx.font = "70px Arial";
        ctx.fillText("You win!", canvasWidth / 3, canvasHeight / 2 - 20);
        return;
    }
    player.draw();
    drawWalls();
    drawObjects();
}

let timer = 0;
let colorChanging = false;
let colors = ["rebeccapurple", "white", "lightgreen", "darkblue", "yellow", "black", "red", "orange"];
let colorIndex = 0;

function oneSecondTimer() {
    timer += .01;
    if (timer >=1) {
        timer = 0;
        if (colorChanging) {
            colorIndex += 1;
            if (colorIndex == colors.length) {colorIndex = 0;}
            backgroundColor = colors[colorIndex];
        }
    }
}

let wallCoordinates = [[1, 1, 0, 3], [1, 1, 3, 0], [4, 1, 0, 1], [5, 1, 0, 2], [5, 1, 12, 0], [17, 1, 0, 12],
            [1, 5, 0, 6], [2, 2, 0, 4], [2, 2, 2, 0], [2, 3, 3, 0],
            [1, 7, 2, 0], [3, 4, 0, 3], [3, 4, 4, 0], [6, 2, 0, 2], [6, 2, 6, 0], [12, 2, 0, 5], [12, 7, 1, 0],
            [13, 2, 0, 5], [13, 2, 3, 0], [16, 2, 0, 9],
            [6, 3, 2, 0], [8, 3, 0, 6], [9, 3, 0, 7], [9, 3, 3, 0],
            [10, 5, 0, 4], [9, 4, 2, 0], [11, 4, 0, 4],
            [2, 8, 6, 0], [4, 5, 0, 3], [4, 5, 2, 0], [7, 4, 0, 3], [5, 7, 2, 0], [5, 6, 0, 1], [6, 5, 0, 1],
            [2, 9, 6, 0], [10, 9, 4, 0], [11, 8, 3, 0],
            [2, 10, 13, 0], [15, 3, 0, 7], [14, 3, 0, 6],
            [2, 11, 15, 0]];
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

let boxX = 50 * 17 + 14;
let boxY = 50 * 11 + 12;
let boxWidth = 25;
let boxHeight = 25;
let boxReached = false;

let lanternX = 125;
let lanternY = 125;
let lanternRadius = 13;
let lanternReached = false;

let goalX = 675;
let goalY = 425;
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
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        for (let i = 0; i < 3.5; i += .5) {
            ctx.arc(lanternX, lanternY, lanternRadius - i, 0, Math.PI * 2, true);
        }
        ctx.stroke();
    }
    // draw mystery box
    if (!boxReached) {
        ctx.fillStyle = "red";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    }
}