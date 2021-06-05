import Phaser from "phaser";

let bird = null;

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
  bird = this.add.sprite(
    config.width/10, 
    config.height/2, 
    'bird'
  ).setOrigin(0);
  debugger
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
  },
  scene: {
    preload: preload,
    create: create,
  }
};


new Phaser.Game(config);