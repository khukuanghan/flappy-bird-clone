import Phaser from "phaser";

let player = null; // Initialize player;

const GAME_SETTINGS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRAVITY_Y: 400,
  GRAVITY_X: 0,
};
const PLAYER_PROPERTIES = {
  FLAP_VELOCITY: 250,
  MOVEMENT_VELOCITY: 200,
  STARTING_POSITION_X: GAME_SETTINGS.CANVAS_WIDTH/10,
  STARTING_POSITION_Y: GAME_SETTINGS.CANVAS_HEIGHT/2,
};

// If the bird's x position is same or larger than the width of the canvas, send the bird back to the left
// If the bird's x position is same or smaller than 0, send the bird back to the right.
// Essentially the bird will bounce from left to right and vice versa.
function _horizontalBounce () {
  const {
    x: positionX,
    width
  } = player;
  if (positionX >=  config.width - width) {
    player.body.velocity.x = -Math.abs(PLAYER_PROPERTIES.MOVEMENT_VELOCITY);
  } 
  else if (positionX <= 0) {
    player.body.velocity.x = PLAYER_PROPERTIES.MOVEMENT_VELOCITY;
  };
};

// This will bounce the bird upwards.
function _birdFlap () {
  player.body.velocity.y = -Math.abs(PLAYER_PROPERTIES.FLAP_VELOCITY); // -value because we're going up. (Positive values will go downwards)
};

function _resetPlayerPosition () {
  player.x = PLAYER_PROPERTIES.STARTING_POSITION_X;
  player.y = PLAYER_PROPERTIES.STARTING_POSITION_Y;
  player.body.velocity.y = 0;
};

// This will trigger when the bird has gotten out of bounds.
function _checkForGameLoss () {
  const { y: positionY } = player;
  if (positionY > config.height || positionY < -Math.abs(player.height)) {
    _resetPlayerPosition();
  };
};

// Loading assets, such as images, music and animations.
function preload () {
  // This context - scene
  // Contains function and properties we can use.
  this.load.image(
    'sky', // The key of the resource. (Can call it anything you want)
    'assets/sky.png', // The path to the file.
  );

  // Load the bird
  this.load.image('bird', 'assets/bird.png');
};

// Creating game objects in the scene.
function create () {
  // The background image.
  this.add.image(
    0, // x axis of the scene
    0, // y axis of the scene
    'sky', // key of the image (this is determined in the preload.)
  ).setOrigin( // This determines the origin points (coordinates) of the image file.
    0, // x axis of the image file
    0, // y axis of the image file.
  );

  // The player object.
  player = this.physics.add.sprite(
    PLAYER_PROPERTIES.STARTING_POSITION_X,
    PLAYER_PROPERTIES.STARTING_POSITION_Y,
    'bird',
  ).setOrigin(0);

  // Set the gravity for the bird.
  // player.body.gravity.y = GAME_SETTINGS.GRAVITY_Y; // Speed (pixels per second); [This will gradually increase the velocity.] - Independent from game's global gravity
  // player.body.velocity.x = PLAYER_PROPERTIES.MOVEMENT_VELOCITY; // Velocity (distance over time); [Velocity will always be constant.]
  
  // This handles user inputs
  // This will execute when the user clicks.
  this.input.on('pointerdown', _birdFlap);
  // This will execute when the user presses on the SPACE key.
  this.input.keyboard.on('keydown-SPACE', _birdFlap)
};

// 60 frames per second.
// This function will execute 60 times per second.
function update (
  time, // Total time that the scene has been running (in milliseconds).
  delta, // How many milliseconds per frame.
) {
  _checkForGameLoss();
};

const config = {
  // WebGL (Web Graphics Library) is the default Phaser renderer.
  // JS API for rendering 2D and 3D graphics - It is compatible with almost every modern web browser.
  type: Phaser.AUTO,
  width: GAME_SETTINGS.CANVAS_WIDTH,
  height: GAME_SETTINGS.CANVAS_HEIGHT,
  physics: {
    // Arcade physics plugin manages physics simulation.
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: GAME_SETTINGS.GRAVITY_Y, // This will apply gravity to every single game object in the scene.
      },
    }
  },
  scene: {
    preload,
    create,
    update,
  }
};

new Phaser.Game(config);