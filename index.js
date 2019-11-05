var canvas;
var context;
var keys = {};
var keyCode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
}
var canvas = document.getElementById('canvas');
var framesByImage = 5;

var character = {
    spriteX: 0,
    spriteY: 0,
    width: 100,
    height: 200,
    moveSpeed: 7,
    positionX: 0,
    positionY: 0,
    spritePositionsX: [0, 100, 200, 300],
    spritePositionsY: [0, 200, 400, 600],
    moving: false,
    currentSprite: 0,
    ready: false
}

var characterImage = document.createElement('img');
characterImage.src = "sprites/characterMovement.png";
characterImage.onload = function(){
    character.ready = true;
};

window.onkeyup = function (e) { console.log(e.keyCode); keys[e.keyCode] = false; }
window.onkeydown = function (e) { console.log(e.keyCode); keys[e.keyCode] = true; }

context = canvas.getContext('2d');

function draw() {
    clearCanvas();
    context.beginPath();
    context.textAlign = "center";
    //context.fillStyle = "green";
    //context.fillRect(0, 0, canvas.width, canvas.height);
    character.spriteX = character.spritePositionsX[character.currentSprite];
    character.spriteY = character.spritePositionsY[character.direction];
    context.clearRect(character.positionX, character.positionY, character.width, character.height);
    if (character.ready) {
        context.drawImage(characterImage, character.spriteX, character.spriteY, character.width, character.height, character.positionX, character.positionY, character.width, character.height);
        if (character.moving) {
            if (character.currentSprite >= 2) {
                character.currentSprite = 0;
            } else {
                if (framesByImage == 0) {
                    character.currentSprite++;
                    framesByImage = 5;
                } else {
                    framesByImage--;
                }
            }
        } else {
            character.currentSprite = 0;
        }
    }
}

function clearCanvas () {
    canvas.width = canvas.width;
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

function main() {
    characterControls();
    draw();
}
draw();
setInterval(main, 17);