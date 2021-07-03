import Phaser from "phaser";
import PlayScene from "./scenes/playScene";
import {GAME_SETTINGS} from './utils/AppConstants';

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
    }
  },
  scene: [PlayScene]
};

new Phaser.Game(config);