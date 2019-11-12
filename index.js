var canvas;
var context;
var keys = {};
var keyCode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32
}
var canvas = document.getElementById('canvas');
var framesByImage = 5;
var attackFramesByImage = 3;
var mapChanged = false;
var youWin = false;

var maps = {
    "0,0": undefined
}

var currentMap = "0,0"; //x, y

var character = {
    spriteX: 0,
    spriteY: 0,
    width: 100,
    height: 200,
    attackWidth: 200,
    attackHeight: 200,
    moveSpeed: 7,
    positionX: canvas.width/2,
    positionY: canvas.height/2,
    spritePositionsX: [0, 100, 200, 300],
    spritePositionsY: [0, 200, 400, 600],
    attackPositionsX: [0, 200, 400, 600],
    attackPositionsY: [0, 200, 400, 600],
    moving: false,
    currentSprite: 0,
    attackSprite: undefined,
    direction: 0,
    attacking: false,
    attackPressed: false,
    alive: true
}

var sprites = {
    characterMovement: new Image(),
    characterAttack: new Image(),
    babyDown: new Image(),
    skull: new Image(),
    rock2: new Image(),
    flowers2: new Image(),
    flowers: new Image(),
    rock: new Image(),
    groundLog2: new Image(),
    grass: new Image(),
    enemy: new Image(),
    deadEnemy: new Image(),
    deadCharacter: new Image(),
    gameOver: new Image(),
    youWin: new Image()
}

for (spriteName in sprites) {
    sprites[spriteName].src = "sprites/" + spriteName + ".png";
}

window.onkeyup = function (e) { keys[e.keyCode] = false; }
window.onkeydown = function (e) { keys[e.keyCode] = true; }

context = canvas.getContext('2d');

function draw() {
    clearCanvas();
    context.beginPath();
    context.textAlign = "center";
    var pattern = context.createPattern(sprites.grass, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);

    maps[currentMap].forEach(function(y, indexY) {
        y.forEach(function(image, indexX) {
            if (image == "babyDown") {
                var differenceX = character.positionX - (indexX * 192);
                var differenceY = character.positionY - (indexY * 108);
                if (differenceX < 110 && differenceX > -90 && differenceY < 0 && differenceY > -150) {
                    youWin = true;
                }
            }
            if ( !(image == "babyDown" && youWin) && image != undefined && typeof(image) != "object") {
                context.drawImage(sprites[image], 0, 0, sprites[image].width, sprites[image].height, indexX * 192, indexY * 108,  sprites[image].width, sprites[image].height);
            }
        })
    })

    if (!character.alive) {
        context.drawImage(sprites.deadCharacter, 0, 0, character.width, character.height, character.positionX, character.positionY, character.width, character.height);
    }
    maps[currentMap].forEach(function(y) {
        y.forEach(function(image) {
            if (image != undefined && typeof(image) == "object") { //enemy
                var differenceX = character.positionX - (image.positionX - 20);
                var differenceY = character.positionY - (image.positionY + 60);
                if (character.attacking) {
                    if (character.direction == 3) {
                        if (differenceX < 170 && differenceX > 0 && differenceY < 0 && differenceY > -140) {
                            image.alive = false;
                        }
                    } else if (character.direction == 1) {
                        if (differenceX > -120 && differenceX < 0 && differenceY < 0 && differenceY > -140) {
                            image.alive = false;
                        }
                    } else if (character.direction == 2) {
                        if (differenceX < 90 && differenceX > -90 && differenceY < 90 && differenceY > -60) {
                            image.alive = false;
                        }
                    } else if (character.direction == 0) {
                        if (differenceX < 90 && differenceX > -90 && differenceY < -60 && differenceY > -200) {
                            image.alive = false;
                        }
                    }
                }
                if (image.alive && character.alive && !youWin ) {
                    if (differenceX < 110 && differenceX > -90 && differenceY < 0 && differenceY > -150) {
                        character.alive = false;
                    }
                    if (character.positionX - image.positionX < 0) {
                        image.positionX -= image.speed;
                    } else if (character.positionX - image.positionX > 0) {
                        image.positionX += image.speed;
                    }
                    if (character.positionY - image.positionY < 0) {
                        image.positionY -= image.speed;
                    } else if (character.positionY - image.positionY > 0) {
                        image.positionY += image.speed;
                    }
                    printImage = sprites["enemy"];
                } else if (!image.alive){
                    printImage = sprites["deadEnemy"];
                } else if (image.alive) {
                    image.speed = 1;
                    if (character.positionX - image.positionX < 0) {
                        image.positionX += image.speed;
                    } else if (character.positionX - image.positionX > 0) {
                        image.positionX -= image.speed;
                    }
                    if (character.positionY - image.positionY < 0) {
                        image.positionY += image.speed;
                    } else if (character.positionY - image.positionY > 0) {
                        image.positionY -= image.speed;
                    }
                    printImage = sprites["enemy"];
                }
                context.drawImage(printImage, 0, 0, sprites["enemy"].width, sprites["enemy"].height, image.positionX - 20, image.positionY + 60,  sprites["enemy"].width, sprites["enemy"].height);
            }
        });
    })

    if (character.alive && !youWin) {
        if (character.attacking) {
            character.spriteX = character.attackPositionsX[character.attackSprite];
            character.spriteY = character.attackPositionsY[character.direction];
            context.drawImage(sprites.characterAttack, character.spriteX, character.spriteY, character.attackWidth, character.attackHeight, character.positionX - 50, character.positionY, character.attackWidth, character.attackHeight);
        } else {
            character.spriteX = character.spritePositionsX[character.currentSprite];
            character.spriteY = character.spritePositionsY[character.direction];
            context.drawImage(sprites.characterMovement, character.spriteX, character.spriteY, character.width, character.height, character.positionX, character.positionY, character.width, character.height);
        }

        if (character.moving) {
            if (framesByImage == 0) {
                character.currentSprite++;
                framesByImage = 5;
            } else {
                framesByImage--;
            }
            if (character.currentSprite >= 3 && framesByImage == 0) {
                character.currentSprite = 0;
                framesByImage = 5;
            }
        } else {
            character.currentSprite = 0;
        }

        if (character.attacking) {
            if (attackFramesByImage == 0) {
                character.attackSprite++;
                attackFramesByImage = 3;
            } else {
                attackFramesByImage--;
            }
            if (character.attackSprite >= 3 && attackFramesByImage == 0) {
                character.attackSprite = 0;
                attackFramesByImage = 3;
                character.attackPressed = false;
            }
        } else {
            character.attackSprite = 0;
        }
    } else {
        context.drawImage(sprites.gameOver, 0, 0, sprites.gameOver.width, sprites.gameOver.height, canvas.width/2 - sprites.gameOver.width/2, canvas.height/2 - sprites.gameOver.height/2,  sprites.gameOver.width, sprites.gameOver.height);
    }
    if (youWin) {
        context.drawImage(sprites.youWin, 0, 0, sprites.youWin.width, sprites.youWin.height, canvas.width/2 - sprites.youWin.width/2, canvas.height/2 - sprites.youWin.height/2,  sprites.youWin.width, sprites.youWin.height);

    }
}


/**
 * Genera los enemigos aleatoriamente, cuanto más lejos estés del centro, más enemigos apareceran
 * @param {object} map
 * @return {object} map
 */
function generateEnemies(map) {
    var x = 0;
    var y = 0;
    var thisMap = currentMap.split(',');
    if (thisMap[0] == 0) thisMap[0] = 1;
    if (thisMap[1] == 0) thisMap[1] = 1;
    distanceFromCenter = Math.abs(parseInt(thisMap[0])) + Math.abs(parseInt(thisMap[1]));
    if (distanceFromCenter > 100) distanceFromCenter = 100;
    enemyPossibility = 1000 - distanceFromCenter
    for (x = 0; x < canvas.width / 192; x++) {
        for (y = 0; y < canvas.height / 108; y++) {
            randomNumber = Math.floor(Math.random() * 1000);
            if (randomNumber > enemyPossibility) {
                map[x][y] = {
                    positionX: x * 192,
                    positionY: y * 108,
                    speed: Math.floor(Math.random() * 2) + 1,
                    alive: true
                };
            }
        }
    }
    return map;
}

function clearCanvas () {
    canvas.width = canvas.width;
}

function mapGenerate() {
    var x = 0;
    var y = 0;
    var map = [];
    for (x = 0; x < canvas.width / 192; x++) {
        map[x] = [];
        for (y = 0; y < canvas.height / 108; y++) {
            randomNumber = Math.floor(Math.random() * 10000);
            if (randomNumber > 9995) {
                map[x][y] = "babyDown";
            } else if (randomNumber > 9900) {
                map[x][y] = "skull";
            } else if (randomNumber > 9800) {
                map[x][y] = "rock2";
            } else if (randomNumber > 9700) {
                map[x][y] = "flowers2";
            } else if (randomNumber > 8500) {
                map[x][y] = "flowers";
            } else if (randomNumber > 8000) {
                map[x][y] = "rock";
            } else if (randomNumber > 7750) {
                map[x][y] = "groundLog2";
            } else {
                map[x][y] = undefined;
            }
        }
    }
    map = generateEnemies(map);
    maps[currentMap] = map;
    mapChanged = false;
}

function characterAttack(){
    if (keys[keyCode.space]) {
        character.attacking = true;
        character.attackPressed = true;
    } else if (character.attackSprite == 0 && character.attackPressed == false){
        character.attacking = false;
    }
}

function characterControls() {
    var directionX = 0
    var directionY = 0
    if (keys[keyCode.left]) {
        directionX += -character.moveSpeed;
        character.direction = 3; //left
    }
    if (keys[keyCode.right]) {
        directionX += character.moveSpeed;
        character.direction = 1; //right
    }
    if (keys[keyCode.up]) {
        directionY += -character.moveSpeed;
        character.direction = 2; //up
    }
    if (keys[keyCode.down]) {
        directionY += character.moveSpeed;
        character.direction = 0; //down
    }
    if (directionX == 0 && directionY == 0) {
        character.moving = false;
    } else {
        character.moving = true;
    }
    character.positionX += directionX;
    character.positionY += directionY;
}

function characterMove() {
    var thisMap = currentMap.split(',');
    if (character.positionX < 0) {
        character.positionX = canvas.width - character.width;
        thisMap = [ parseInt(thisMap[0]) - 1 , thisMap[1]];
        mapChanged = true;
    } else if (character.positionX > canvas.width - character.width) {
        character.positionX = 0;
        thisMap = [ parseInt(thisMap[0]) + 1, thisMap[1]];
        mapChanged = true;
    } else if (character.positionY < 0) {
        character.positionY = canvas.height - character.height;
        thisMap = [thisMap[0], parseInt(thisMap[1]) - 1];
        mapChanged = true;
    } else if (character.positionY > canvas.height - character.height) {
        character.positionY = 0;
        thisMap = [thisMap[0], parseInt(thisMap[1]) + 1];
        mapChanged = true;
    }
    currentMap = thisMap[0] + "," + thisMap[1];
}

function main() {
    if (character.alive && !youWin) {
        characterAttack();
        if (!character.attacking) {
            characterControls();
        }
        characterMove();
    }
    if (mapChanged) {
        if (maps[currentMap] == undefined) {
            mapGenerate();
        }
    }
    draw();
}
mapGenerate();
draw();
setInterval(main, 17);