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
var enemies = [];
var game = {
    state: "start"
}
var background;
var imgPlayer, imgBullet, imgEnemies;
var soundShoot,soundKill;





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


function loadBackground() {
    background = new Image();
    background.src = "/images/background.jpg";

}



function drawBackground() {
    ctx.drawImage(background, 0, 0, x, y)
}

function loadPlayer() {
    imgPlayer = new Image();
    imgPlayer.src = "/images/NicePng_garbage-png_982423.png";
}

function loadEnemies() {
    imgEnemies = new Image();
    imgEnemies.src = "/images/bolsabasura.png";
}

function loadBullet() {
    imgBullet = new Image();
    imgBullet.src = "/images/cubobasura.png";
}




function drawEnemies() {
    for (i in enemies) {
        var enemy = enemies[i];
        ctx.save();
        if (enemy.state == "alive") ctx.fillStyle = "green";
        if (enemy.state == "dead") ctx.fillStyle = "red";
        ctx.drawImage(imgEnemies, enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.restore();


    }
}

function moveEnemies() {
    for (var i in enemies) {
        var enemy = enemies[i];
        enemy.y += 4;
    }
    enemies = enemies.filter(function (enemy) {
        return enemy.y > 0;
    });


}

function refreshEnemies() {
    if (game.state == "start") {
        for (var i = 0; i < 10; i++) {
            enemies.push({
                x: 10 + (i * 50),
                y: 10,
                height: 40,
                width: 40,
                state: "alive",
                counter: 0
            });
        }
        // game.state = "start";


    }
    for (var i in enemies) {
        var enemy = enemies[i];
        if (!enemy) continue;
        if (enemy && enemy.state == "alive") {
            enemy.counter++;
            // enemy.x += Math.sin(enemy.counter * Math.PI / 90) * 5;
        }
        if (enemy && enemy.state == "hit") {
            enemy.counter++;
            if (enemy.counter >= 20) {
                enemy.state = "dead";
                enemy.counter = 0;
            }
        }
    }
    enemies = enemies.filter(function (enemy) {
        if (enemy && enemy.state != "died") return true;
        return false;
    });


}

function moveBullets() {
    for (var i in bullets) {
        var bullet = bullets[i];
        bullet.y -= 8;
    }
    bullets = bullets.filter(function (bullet) {
        return bullet.y > 0;
    });
}

function shoot() {
    bullets.push({
        x: playerX + (playerWidth / 2) - 5,
        y: playerY,
        width: 50,
        height: 50
    });

}

function drawBullets() {
    ctx.save();
    ctx.fillStyle = "black";
    for (var i in bullets) {
        var bullet = bullets[i];
        ctx.drawImage(imgBullet, bullet.x, bullet.y, bullet.width, bullet.height);
    }

    ctx.restore();

}



function hit(a, b) {
    var hit = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
        if (b.y + b.height >= a.y && b.y < a.y + a.height) {
            hit = true;
        }
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            hit = true;

        }
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
            hit = true;
        }
    }
    return hit;


}

function verifyHit() {
    for (var i in bullets) {
        var bullet = bullets[i];
        for (j in enemies) {
            var enemy = enemies[j];
            if (hit(bullet, enemy)) {
                enemy.state = "hit";
                enemy.counter = 10;
            }
        }
    }

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
    ctx.drawImage(imgPlayer, playerX, playerY, playerHeight, playerWidth)

    // ctx.rect(playerX, playerY, playerWidth, playerHeight);
    // ctx.fillStyle = "#0095DD";
    // ctx.fill();
    ctx.closePath();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadBackground();
    drawBackground();
    drawBall();
    loadPlayer()
    drawPlayer();
    loadBullet();
    moveBullets();
    drawBullets();
    verifyHit();
    loadEnemies() 
    drawEnemies();
    moveEnemies();
    // refreshEnemies();



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
