import Phaser from "phaser";

// Loading assets, such as images, music, animations
function preload () {
  // This context - scene
  // Contains function and properties we can use.
  this.load.image(
    'sky', // Key of the resource. (Can call it anything you want.)
    'assets/sky.png' // The path to the file.
  );
};

function create () {
  // The reason we half of the config width and height is so that the image is placed in the center of the scene.
  this.add.image(
    config.width / 2, // x axis
    config.height / 2, // y axis
    'sky', // key of the image. (This is determined in preload.)
  );
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