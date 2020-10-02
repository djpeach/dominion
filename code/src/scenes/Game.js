import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init(data) {}

  preload() {
    this.scale.on('resize', this.resize, this);

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      b_1: Phaser.Input.Keyboard.KeyCodes.Q,
      b_2: Phaser.Input.Keyboard.KeyCodes.E,
    });
  }

  create() {
    var _this = this;
    this.graphics = this.add.graphics({
      lineStyle: { color: 0xff0000 },
      fillStyle: { color: 0x00ff00 },
    });

    this.player = new Phaser.Geom.Triangle(10, 0, 0, 40, 20, 40);
    this.player.height = this.player.bottom - this.player.top;
    this.player.width = this.player.right - this.player.left;
    Phaser.Geom.Triangle.CenterOn(
      this.player,
      this.game.config.width / 2,
      this.game.config.height - this.player.height / 2
    );
    console.log(this.player.height);
    this.graphics.clear();
    this.graphics.fillTriangleShape(this.player);
  }

  update(time, delta) {
    if (this.cursors.up.isDown) {
      Phaser.Geom.Triangle.CenterOn(this.player, this.player.)
    }
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    let width = gameSize.width;
    let height = gameSize.height;
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }
    this.cameras.resize(width, height);
  }
}
