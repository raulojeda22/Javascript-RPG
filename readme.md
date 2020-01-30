# Javascript-RPG
Small js project for the 2nd course of Development of Client Web Applications made by Raül Ojeda Gandia

Link to the <a href="https://raulojeda22.github.io/Javascript-RPG/">game</a>

## Introduction
I've always loved videogames and I actually got into programming for it, so I always enjoy to develop a new game on a new technology. Sadly, I don't have much time for it, so when the teacher told us that we could do whatever we wanted, I automatically thought in doing a videogame. I didn't had much ideas so I did a new version of a game I did in 1st of Microinformatic Systems and Networks for the /bin/bash command line using shell scripts, you can find the repo here: [Bash-Shell-RPG](https://github.com/raulojeda22/Bash-Shell-RPG)

<a href="https://snapcraft.io/bash-shell-rpg">
  <img alt="Get it from the Snap Store" src="https://snapcraft.io/static/images/badges/en/snap-store-black.svg" />
</a>

My main objective was to replicate the behaviour of that game, in that game the enemies only move when you move, I made it like that because it was the easiest way to do it in Shell Scripts but javascript game much more quickness and freedom to develop a much better game in less lines of code.


## The story

In this game you are a hero with a sword, the main objective is to find your lost child in the forest, but you will have to fight the monsters on the wild forest if you are willing to take the risk...

## The gameplay

Arrow keys ← → ↑ ↓ To move

'Spacebar' To attack

'R' To restart and reset the game

You can go to the next map crossing the edge of your current map.

The game is saved automatically when the player stops moving.

The game will load a save if it detects a previous saved game state.

## App explanation

The game uses the HTML canvas to animate the game, the html only has the canvas element and the css is only used to expand the canvas to the whole window space so it makes the game playable in mostly any screen.

I got the sprites from here: https://opengameart.org/content/zelda-like-tilesets-and-sprites, I've just used some of them and modified them a bit.

The javascript has several variables and objects on the window scope that are used on the whole web application and several functions that are used to change the canvas depending on the user input and the map state.

The main objects are:

- character (Character configuration)
- sprites (All the images)

The main functions:

- restart: Restart the game reseting the main global variables, this is called when the key 'r' has been pressed

- drawContent: Draws the background and the objects on the map that make it unique

- drawEnemies: Draws the enemies on the map and animates it's movement

- drawCharacter: Draws the character and it's movement and attacks

- draw: Draws everything to the canvas

- generateEnemies: Generate the enemies randomly, when more far away from the center, more enemies will appear

- clearCanvas: Clears the canvas content

- mapGenerate: Generates one of the maps content

- characterAttack: Detects character attack

- characterControls: Detect character movement and change it's direction and position

- characterMove: Detect if the character has reached the limit of the map and change map if you have

- load: Loads the last game state from localStorage

- save: Saves the current game state from localStorage

- main: Main function that is being executed every 17ms, this is the closest to 60 fps

## Conclusions

My main objectives were to copy the functionality of the Shell Script project that I did, I mainly did all of them and added new functionalities like saving the different maps on a map array and saving the game on local storage, the one functionality that left to put from the other game was to be able to select multiple weapons, but as I only had the animations of a sword, I didn't added the possibility of using different weapons into the game.

I think that the possibilites to improve this game are endless, probably games like Pokemon or The Legend Of Zelda started doing something like this and then started to add more and more features, sadly for me, time is the only thing that stops me from improving this game. The base functionality is there, adding more features to the game won't be much harder from here.

The game can be played online from [here](https://raulojeda22.github.io/Javascript-RPG/).
