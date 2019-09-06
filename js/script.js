var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var x = canvas.width;
var y = canvas.height;
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
var playing = false;
var startButton;
var background;
var imgPlayer, imgBullet, imgEnemies;
var soundShoot, soundKill;
var score = 0;
var lives = 200;




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


function loadMedia() {
    background = new Image();
    background.src = "/images/33087.jpg";
    imgPlayer = new Image();
    imgPlayer.src = "/images/señordelabasura.png";
    imgEnemies = new Image();
    imgEnemies.src = "/images/bolsabasura.png";
    imgBullet = new Image();
    imgBullet.src = "/images/cubobasura.png";
    // soundShoot = document.createElement("audio");
    // document.body.appendChild(soundShoot);
    // soundShoot.setAttribute("src", "/sounds/zapsplat_foley_bag_school_rucksack_open_001_33251.mp3")


}





function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
}




function drawEnemies() {
    for (i in enemies) {
        var enemy = enemies[i];
        if (enemy.state == "alive") ctx.fillStyle = "green";
        if (enemy.state == "dead") ctx.fillStyle = "red";

        ctx.drawImage(imgEnemies, enemy.x, enemy.y, enemy.width, enemy.height);


    }
}



function moveEnemies() {
    for (var i in enemies) {
        var enemy = enemies[i];
        enemy.y += 3;
        enemy.x += Math.random() * (20 - -20) + (-20);

    }
    enemies = enemies.filter(function (enemy) {
        return enemy.y > 0 && enemy.x > 0 && enemy.y < canvas.height && enemy.x < canvas.width;
    });


}



function refreshEnemies() {
    if (playing == true) {
        for (var i = 0; i < 12; i++) {
            enemies.push({

                x: 50 + (i * 150),
                y: 10,
                height: 40,
                width: 40,
                state: "alive",
                counter: 0
            });
        }
        playing = true;

    }
    for (var i in enemies) {
        var enemy = enemies[i];
        if (!enemy) continue;
        if (enemy && enemy.state == "alive") {
            enemy.counter++;
            // enemy.x += Math.sin(enemy.counter * Math.PI / 90) * 5;
            if (enemy.y > canvas.height) {
                lives--
                if (lives === 0) {
                    alert("you lose");
                    document.location.reload();
                }

            }


        }
        if (enemy && enemy.state == "hit") {
            enemy.counter++;
            if (enemy.counter >= 0) {
                enemy.state = "dead";
                enemy.counter = 0;
                enemies = enemies.filter(function (arr) {
                    return arr.state !== 'dead';
                });

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
    // soundShoot.pause();
    // soundShoot.currentTime = 0;
    // soundShoot.play();

    bullets.push({
        x: playerX + (playerWidth / 2) - 5,
        y: playerY,
        width: 50,
        height: 50
    });

}

function drawBullets() {

    for (var i in bullets) {
        var bullet = bullets[i];
        ctx.drawImage(imgBullet, bullet.x, bullet.y, bullet.width, bullet.height);
    }


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
                enemy.counter = 0;
                score++;
                if (score === 50000) {
                    alert("you win");
                    document.location.reload();

                }




            }
        }
    }

}

function drawScore() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "#A2232E";
    ctx.fillText("Score: " + score, 20, canvas.height / 2);

}

function drawLives() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "#25A223";
    ctx.fillText("Lives: " + lives, 20, (canvas.height / 2) - 70);

}



function drawPlayer() {
    ctx.drawImage(imgPlayer, playerX, playerY, playerHeight, playerWidth)


}



function startGame() {

    var elem = document.getElementById("button");
    elem.parentNode.removeChild(elem);

    var elemcanvas = document.getElementById("myCanvas")
    elemcanvas.style = null;


    playing = true;


}




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadMedia();
    drawBackground();
    drawPlayer();
    drawBullets();
    moveBullets();
    verifyHit();
    drawEnemies();
    drawScore()
    drawLives()
    // moveEnemies();
    // refreshEnemies();




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



}

setInterval(draw, 10);
setInterval(refreshEnemies, 1000);
setInterval(moveEnemies, 50);
