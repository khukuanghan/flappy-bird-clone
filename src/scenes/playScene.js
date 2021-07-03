import { Scene } from "phaser";
import { 
  GAME_SETTINGS,
  PLAYER_PROPERTIES,
  PIPE_PROPERTIES,
  STORAGE_KEYS
} from "../utils/AppConstants";

class PlayScene extends Scene {
  constructor() {
    super("PlayScene");
    this.player = null;
    this.pipes = null;
    this.score = 0;
    this.scoreText = "";
    this.bestScoreText = "";
  };

  _birdFlap() {
    this.player.body.velocity.y = -Math.abs(PLAYER_PROPERTIES.FLAP_VELOCITY); // -value because we're going up. (Positive values will go downwards)
  };

  _saveBestScore() {
    // Saves the best score
    const bestScoreText = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    if (!bestScore || this.score > bestScore) {
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, this.score);
    }
  };

  _increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    this._saveBestScore();
  };

  _gameOver() {
    this.physics.pause(); // This will pause the game.
    this.player.setTint(0xFF0000);
    this._saveBestScore();
    // Restarts the game after a 1 second delay.
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  };

  _checkForGameLost() {
    if (this.player.getBounds().bottom >= GAME_SETTINGS.CANVAS_HEIGHT || this.player.y <= 0) {
      this._gameOver();
    };
  };

  _getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  };

  _renderPipes(upperPipe, lowerPipe) {
    const rightMostX = this._getRightMostPipe();
    let pipeVerticalDistance = Phaser.Math.Between(...PIPE_PROPERTIES.PIPE_VERTICAL_DISTANCE_RANGE);
    let pipeVerticalPosition = Phaser.Math.Between(20, GAME_SETTINGS.CANVAS_HEIGHT - 20 - pipeVerticalDistance);
    let pipeHorizontalDistance = Phaser.Math.Between(...PIPE_PROPERTIES.PIPE_HORIZONTAL_DISTANCE_RANGE);
    upperPipe.x = rightMostX + pipeHorizontalDistance;
    upperPipe.y = pipeVerticalPosition;
    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticalDistance;
  };

  _recyclePipes () {
    const tempPipes = [];
    this.pipes.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right <= 0) {
        // Recycle pipe.
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this._renderPipes(...tempPipes);
          this._increaseScore();
        }
      }
    }, this);
  };

  preload() {
    // This context - scene
    // Contains function and properties we can use.
    this.load.image(
      'sky', // The key of the resource. (Can call it anything you want)
      'assets/sky.png', // The path to the file.
    );
    // Load the bird
    this.load.image('bird', 'assets/bird.png');
    // Load the pipe
    this.load.image('pipe', 'assets/pipe.png');
    // Load the pause button
    this.load.image('pause', 'assets/pause.png');
  };

  _createBackground() {
    // The background image.
    this.add.image(
      0, // x axis of the scene
      0, // y axis of the scene
      'sky', // key of the image (this is determined in the preload.)
    ).setOrigin( // This determines the origin points (coordinates) of the image file.
      0, // x axis of the image file
      0, // y axis of the image file.
    );
  };

  _createPauseButton() {
    const pauseButton = this.add.image(
      (GAME_SETTINGS.CANVAS_WIDTH - 10),
      (GAME_SETTINGS.CANVAS_HEIGHT - 10),
      'pause'
    )
    .setScale(3)
    .setOrigin(1,1)
    .setInteractive();
    pauseButton.on('pointerdown', () => {
      this.physics.pause();
      this.scene.pause();
    });
  };

  _createPlayer() {
    // The player object.
    this.player = this.physics.add.sprite(
      PLAYER_PROPERTIES.STARTING_POSITION_X,
      PLAYER_PROPERTIES.STARTING_POSITION_Y,
      'bird',
    ).setOrigin(0);
    // Set the gravity for the bird.
    this.player.body.gravity.y = PLAYER_PROPERTIES.GRAVITY_Y; // Speed (pixels per second); [This will gradually increase the velocity.] - Independent from game's global gravity
    // player.body.velocity.x = PLAYER_PROPERTIES.MOVEMENT_VELOCITY; // Velocity (distance over time); [Velocity will always be constant.]
    this.player.setCollideWorldBounds();
  };

  _createPipes() {
    // The pipe objects.
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPE_PROPERTIES.NUMBER_OF_PIPES_TO_RENDER; i += 1) {
      const upperPipe = this.pipes.create(
        0,
        0,
        'pipe',
      )
      .setImmovable(true)
      .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(
        0,
        0,
        'pipe',
      )
      .setImmovable(true)
      .setOrigin(0, 0);
      this._renderPipes(upperPipe, lowerPipe);
    };
    this.pipes.setVelocityX(-Math.abs(GAME_SETTINGS.PIPE_VELOCITY));
  };

  _createColliders() {
    this.physics.add.collider(this.player, this.pipes, this._gameOver, null, this);
  };

  _createScore() {
    this.score = 0; // Restarts score when the game is restarted.
    const bestScore = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    this.scoreText = this.add.text(
      16, 
      16, 
      `Score: ${this.score}`,
      {
        fontSize: '32px',
        color: '#FFFFFF',
      });
    this.bestScoreText = this.add.text(
      16, 
      52, 
      `Best score: ${bestScore || 0}`,
      {
        fontSize: '16px',
        color: '#FFFFFF',
      }
    );
  }

  _inputHandler() {
    // This handles user inputs
    // This will execute when the user clicks.
    this.input.on('pointerdown', this._birdFlap, this);
    // This will execute when the user presses on the SPACE key.
    this.input.keyboard.on('keydown-SPACE', this._birdFlap, this)
  };

  create() {
    this._createBackground();
    this._createPlayer();
    this._createPipes();
    this._createColliders();
    this._createScore();
    this._createPauseButton();
    this._inputHandler();
  };

  update(
    time, // Total time that the scene has been running (in milliseconds).
    delta, // How many milliseconds per frame.
  ) {
    this._checkForGameLost();
    this._recyclePipes();
  };
};

export default PlayScene;