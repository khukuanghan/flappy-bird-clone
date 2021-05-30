import Phaser from "phaser";

// Loading assets, such as images, music, animations
function preload () {
  // This context - scene
  // Contains function and properties we can use.
  debugger;
};

function create () {
  debugger;
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