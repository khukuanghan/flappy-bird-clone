import Phaser from "phaser";

let bird = null;
let totalDelta = 0;
const xVelocity = 200;

// Loading assets, such as images, music, animations
function preload () {
  // This context - scene
  // Contains function and properties we can use.
  this.load.image(
    'sky', // Key of the resource. (Can call it anything you want.)
    'assets/sky.png' // The path to the file.
  );

  // Load the bird
  this.load.image('bird', 'assets/bird.png');
};

function create () {
  this.add.image(
    0, // x axis of the scene
    0, // y axis of the scene
    'sky', // key of the image (this is determined in the preload.)
  ).setOrigin( // This determines the origin points (coordinates) of the image file.
    0, // x axis of the image file
    0, // y axis of the image file.
  );

  // Add a sprite (game object - it has more properties than an image)
  bird = this.physics.add.sprite(
    config.width/10, 
    config.height/2, 
    'bird'
  ).setOrigin(0);

  // Set the gravity for the bird.
  // bird.body.gravity.y = 200; // Speed (pixels per second); [This will gradually increase the velocity.]
  bird.body.velocity.x = xVelocity; // Velocity (distance over time); [Velocity will always be constant.]
};


// If the bird's x position is same or larger than the width of the canvas, send the bird back to the left
// If the bird's x position is same or smaller than 0, send the bird back to the right.
// Essentially the bird will bounce from left to right and vice versa.
function _horizontalBounce () {
  const {
    x: positionX,
    width: birdWidth
  } = bird;
  if (positionX >=  config.width - birdWidth) {
    bird.body.velocity.x = -Math.abs(xVelocity);
  } 
  else if (positionX <= 0) {
    bird.body.velocity.x = xVelocity;
  }
}

// 60 frames per second
// This function will execute 60 times per second.
function update (
  time, // total time that the scene has been running.
  delta // How much milliseconds per frame
) {
  _horizontalBounce();
};

const config = {
  // WebGL (Web Graphics Library) is the default Phaser renderer.
  // JS API for rendering 2D and 3D graphics - It is compatible with almost every modern web browser.
  type: Phaser.AUTO,
  width:  800,
  height: 600,
  physics: {
    // Arcade physics plugin manages physics simulation.
    default: 'arcade',
    arcade: {
      // debug: true,
      // gravity: { y: 200 }, // This will apply gravity to every single game object in the scene.
    }
  },
  scene: {
    preload: preload,
    create: create,
    update
  }
};

new Phaser.Game(config);