var canvas; //Declare canvas
var context; //Declare context
var keys = {}; //Initialize key object for storing the keys that are being pressed at the moment
var keyCode = { //Key codes to handle presses
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    r: 82
}
var canvas = document.getElementById('canvas'); //Get canvas element
var framesByImage = 5; //The number of frames until the sprite image of the movement character changes
var attackFramesByImage = 3; //The number of frames until the sprite image of the attack character changes
var mapChanged = false; //Global variable storing wether the map has changed or not
var youWin = false; //Store if the player won

var maps = { //The map object storing all the maps content
    "0,0": undefined
}

var currentMap = "0,0"; //Has the current map position on the maps array

var character = { //The character object
    spriteX: 0,
    spriteY: 0,
    width: 100,
    height: 200,
    attackWidth: 200,
    attackHeight: 200,
    moveSpeed: 7,
    positionX: canvas.width/2,
    positionY: canvas.height/2,
    moving: false,
    currentSprite: 0,
    attackSprite: undefined,
    direction: 0,
    attacking: false,
    attackPressed: false,
    alive: true
}

var sprites = { //The sprite objects
    characterMovement: new Image(),
    characterAttack: new Image(),
    babyDown: new Image(),
    skull: new Image(),
    rock2: new Image(),
    flowers2: new Image(),
    flowers: new Image(),
    rock: new Image(),
    groundLog: new Image(),
    grass: new Image(),
    enemy: new Image(),
    deadEnemy: new Image(),
    deadCharacter: new Image(),
    gameOver: new Image(),
    youWin: new Image()
}

for (spriteName in sprites) { //Get all the sprites source by its name
    sprites[spriteName].src = "sprites/" + spriteName + ".png";
}


/**
 * Restart the game reseting the main global variables, this is called when the key 'r' has been pressed
 */
function restart() {
    mapChanged = false;
    youWin = false;
    maps = {
        "0,0": undefined
    }
    currentMap = "0,0"; //x, y
    character.alive = true;
    character.positionX = canvas.width/2;
    character.positionY = canvas.height/2;
    character.direction = 0;
    mapGenerate();
}

window.onkeyup = function (e) {
    if (e.keyCode == keyCode.r) restart(); //Restar if the r key has been unpressed
    keys[e.keyCode] = false;  //Remove the key from the object when the user stops pressing
}
window.onkeydown = function (e) { //Add the key to the object when the user starts pressing
    keys[e.keyCode] = true;
}

context = canvas.getContext('2d'); // Create canvas context

function draw() {
    clearCanvas();
    context.beginPath();
    context.textAlign = "center";
    var pattern = context.createPattern(sprites.grass, 'repeat'); // Create a pattern with the floor image, and set it to "repeat".
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height); //Fill all the canvas with the background

    maps[currentMap].forEach(function(y, indexY) { //For each map row
        y.forEach(function(image, indexX) { //For each row element
            if (image == "babyDown") { //If the element is a baby
                var differenceX = character.positionX - (indexX * 192);
                var differenceY = character.positionY - (indexY * 108);
                if (differenceX < 110 && differenceX > -90 && differenceY < 50 && differenceY > -150) { //Detect if the character is near
                    youWin = true;
                }
            }
            if ( !(image == "babyDown" && youWin) && image != undefined && typeof(image) != "object") { //If the user has won, don't print the baby on the map
                context.drawImage(sprites[image], 0, 0, sprites[image].width, sprites[image].height, indexX * 192, indexY * 108,  sprites[image].width, sprites[image].height);
            }
        })
    })

    if (!character.alive) { //If the character is dead, print it's dead body on the floor
        context.drawImage(sprites.deadCharacter, 0, 0, character.width, character.height, character.positionX, character.positionY, character.width, character.height);
    }
    maps[currentMap].forEach(function(y) { //Print the enemies and it's movement
        y.forEach(function(image) {
            if (image != undefined && typeof(image) == "object") { //enemy
                var differenceX = character.positionX - (image.positionX - 20);
                var differenceY = character.positionY - (image.positionY + 60);
                var printImage;
                if (character.attacking) { //This ifs check if the sword has hit the area of the enemy, and kills it if it's the case
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
                if (image.alive && character.alive && !youWin ) { //If the character and enemy are alive and you haven't won, the enemies will approach you
                    if (differenceX < 110 && differenceX > -90 && differenceY < 0 && differenceY > -150) { //If the enemy touches the character, the character dies
                        character.alive = false;
                    }
                    //This ifs check the position of the character to change the position of the enemy and approach the character
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
                } else if (!image.alive){ //If the enemy is dead, don't move and display the dead sprite
                    printImage = sprites["deadEnemy"];
                } else if (image.alive) { //If the enemy is alive, and the character is dead or has won the game, the enmemy will go away
                    image.speed = 1;
                    //This ifs check the position of the character to change the position of the enemy to run away from the character
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

    if (character.alive && !youWin) { //If the character is alive and the game is still running, unlock the character movement
        if (character.attacking) { //Draw the attack of the character with it's current sprite and position
            character.spriteX = character.attackSprite * character.height;
            character.spriteY = character.direction * character.height;
            context.drawImage(sprites.characterAttack, character.spriteX, character.spriteY, character.attackWidth, character.attackHeight, character.positionX - 50, character.positionY, character.attackWidth, character.attackHeight);
        } else { //Draw the movement of the character with it's current sprite and position
            character.spriteX = character.currentSprite * character.width;
            character.spriteY = character.direction * character.height;
            context.drawImage(sprites.characterMovement, character.spriteX, character.spriteY, character.width, character.height, character.positionX, character.positionY, character.width, character.height);
        }

        if (character.moving) { //This is used to change the sprite of the user when it is moving, this changes the sprite every 5 frames
            if (framesByImage == 0) { //If the frame counter is 0, reset the counter and change sprite
                character.currentSprite++;
                framesByImage = 5;
            } else { //else remove  from the counter
                framesByImage--;
            }
            if (character.currentSprite >= 3 && framesByImage == 0) { //If it's the last sprite element and the counter has ended, reset counter and sprites
                character.currentSprite = 0;
                framesByImage = 5;
            }
        } else {
            character.currentSprite = 0;
        }

        if (character.attacking) { //This is used to change the sprite that will be displayed on the next frame, it may not change, it changes every 3 frames
            if (attackFramesByImage == 0) { //If the frame counter is 0, reset counter and change sprite
                character.attackSprite++;
                attackFramesByImage = 3;
            } else { //If the frame counter is not 0, remove 1 from the frame counter
                attackFramesByImage--;
            }
            if (character.attackSprite >= 3 && attackFramesByImage == 0) { //If it's the last frame, and the counter has ended, go to the first sprite of the row
                character.attackSprite = 0;
                attackFramesByImage = 3;
                character.attackPressed = false; //End attack animation
            }
        } else { //If the character is not attacking, reset to the first attack sprite
            character.attackSprite = 0;
        }
    } else { //Display dead banner
        context.drawImage(sprites.gameOver, 0, 0, sprites.gameOver.width, sprites.gameOver.height, canvas.width/2 - sprites.gameOver.width/2, canvas.height/2 - sprites.gameOver.height/2,  sprites.gameOver.width, sprites.gameOver.height);
    }
    if (youWin) { //Display win banner
        context.drawImage(sprites.youWin, 0, 0, sprites.youWin.width, sprites.youWin.height, canvas.width/2 - sprites.youWin.width/2, canvas.height/2 - sprites.youWin.height/2,  sprites.youWin.width, sprites.youWin.height);
    }
}


/**
 * Generate the enemies randomly, when more far away from the center, more enemies will appear
 * @param {object} map
 * @return {object} map
 */
function generateEnemies(map) {
    var x = 0;
    var y = 0;
    var thisMap = currentMap.split(',');
    if (thisMap[0] == 0) thisMap[0] = 1; //If the map is the first one, still make possible to have enemies on it
    if (thisMap[1] == 0) thisMap[1] = 1;
    distanceFromCenter = Math.abs(parseInt(thisMap[0])) + Math.abs(parseInt(thisMap[1])); //Calculate the distance from the center of the map
    if (distanceFromCenter > 50) distanceFromCenter = 50; //If you are more than 50 maps away from the center don't increment the enemy possibilities of appearing, is already really high
    enemyPossibility = 1000 - distanceFromCenter * 2 //Set the enemy possibility
    for (x = 0; x < canvas.width / 192; x++) { //For each row
        for (y = 0; y < canvas.height / 108; y++) { //For each column
            randomNumber = Math.floor(Math.random() * 1000); //Calculate a number between 0 and 999
            if (randomNumber > enemyPossibility) { //If the random number is bigger than the enemy possibility overwrite tile with enemy
                map[x][y] = {
                    positionX: x * 192, //Set enemy position
                    positionY: y * 108,
                    speed: Math.floor(Math.random() * 2) + 1, //Set a random speed
                    alive: true
                };
            }
        }
    }
    return map;
}

/**
 * Clears the canvas content
 */
function clearCanvas () {
    canvas.width = canvas.width;
}

/**
 * Generates one of the maps content
 */
function mapGenerate() {
    var x = 0;
    var y = 0;
    var map = [];
    for (x = 0; x < canvas.width / 192; x++) { //For each row
        map[x] = [];
        for (y = 0; y < canvas.height / 108; y++) { //For each column
            var randomNumber = Math.floor(Math.random() * 10000);
            //Every element has a different percentage of appearing, being the baby the less likely
            if (randomNumber > 9997) { //There is more or less a 0.03% possibility of a cell being a baby, as there are 100 cells on the map, a baby has a 3% chance of appearing on a map
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
                map[x][y] = "groundLog";
            } else {
                map[x][y] = undefined;
            }
        }
    }
    map = generateEnemies(map); //Adds the enemies to the generated map
    maps[currentMap] = map; //Overwrites the map with the enemies
    mapChanged = false;
}

/**
 * Detect character attack
 */
function characterAttack(){
    if (keys[keyCode.space]) {
        character.attacking = true;
        character.attackPressed = true;
    } else if (character.attackSprite == 0 && character.attackPressed == false){
        character.attacking = false;
    }
}

/**
 * Detect character movement and change it's direction and position
 */
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

/**
 * Detect if the character has reached the limit of the map and change map if you have
 */
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

/**
 * Main function that is being executed every 17ms, this is the closest to 60 fps
 */
function main() {
    if (character.alive && !youWin) {  //If the game hasn't ended, detect attack and movement of the character
        characterAttack();
        if (!character.attacking) {
            characterControls();
        }
        characterMove();
    }
    if (mapChanged) { //If the map has changed
        if (maps[currentMap] == undefined) { //Create a map if it doesn't exists already
            mapGenerate();
        }
    }
    draw();
}
mapGenerate(); //Generate first map
draw();
setInterval(main, 17); //Start main loop