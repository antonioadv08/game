var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width;
var y = canvas.height;
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;
var dx = 2;
var dy = -2;
var playerHeight = 75;
var playerWidth = 75;
var playerX = (canvas.width - playerWidth) / 2;
var playerY = (canvas.height - playerHeight);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spaceBar = false;
var bullets = [];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        playerX = relativeX - playerWidth / 2;
    }
    var relativeY = e.clientY - canvas.offsetTop;
    if (relativeY > 0 && relativeY < canvas.height) {
        playerY = relativeY - playerHeight / 2;
    }

}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 38) {
        upPressed = true;
    }
    else if (e.keyCode == 40) {
        downPressed = true;
    }
    else if (e.keyCode == 32) {
        spaceBar = true;
    }

}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
    else if (e.keyCode == 38) {
        upPressed = false;
    }
    else if (e.keyCode == 40) {
        downPressed = false;
    }
    else if (e.keyCode == 32) {
        spaceBar = false;
    }
}



function moveBullets() {
    for (var i in bullets) {
        var bullet = bullets[i];
        bullet.y -= 5;
    }
    bullets = bullets.filter(function (bullet) {
        return bullet.y > 0;
    });
}

function shoot() {
    bullets.push({
        x: playerX,
        y: playerY,
        width: 10,
        height: 10
    });

}

function drawBullets() {
    ctx.save();
    ctx.fillStyle = "black";
    for (var i in bullets) {
        var bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    ctx.restore();

}








function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayer();
    moveBullets()
    drawBullets()
  

    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if (ballY + dy > canvas.height - ballRadius || ballY + dy < ballRadius) {
        dy = -dy;
    }
    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += 7;
    }
    if (leftPressed && playerX > 0) {
        playerX -= 7;
    }
    if (upPressed && playerY > 0) {
        playerY -= 7;
    }
    if (downPressed && playerY < canvas.height - playerHeight) {
        playerY += 7;
    }
    if (!spaceBar == false) {
        shoot()

    }


    ballX += dx;
    ballY += dy;
}

setInterval(draw, 10);