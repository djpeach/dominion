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
    this.graphics = this.add.graphics({
      lineStyle: { color: 0x538de6 },
      fillStyle: { color: 0x538de6 },
    });

    this.player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height - 50,
      'blueCar'
    );
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.035);
    this.player.setAngle(-90);
    this.player.setVelocity(0, 0);
    this.base = new Phaser.Curves.Path(this.player.x + 50, this.player.y);
    this.base.circleTo(50);
    this.base.draw(this.graphics);
    this.base.moveTo(this.player.x, this.player.y);
    this.base.lastUpdate = 0;
  }

  update(time, delta) {
    let speed = 300;
    let rotation = 3;
    let newAngle = this.player.angle;
    if (
      !Phaser.Geom.Point.Equals(
        this.player.body.velocity,
        new Phaser.Geom.Point(0, 0)
      )
    ) {
      if (this.cursors.right.isDown) {
        newAngle += rotation;
      }
      if (this.cursors.left.isDown) {
        newAngle -= rotation;
      }
    }
    this.player.setAngle(newAngle);
    this.player.setVelocity(
      speed * Math.cos((this.player.angle * Math.PI) / 180),
      speed * Math.sin((this.player.angle * Math.PI) / 180)
    );
    if (
      time - this.base.lastUpdate > 50 &&
      (Math.abs(
        this.player.x - this.base.curves[this.base.curves.length - 1].p0.x
      ) > 150 ||
        Math.abs(
          this.player.y - this.base.curves[this.base.curves.length - 1].p0.y
        ) > 150)
    ) {
      this.base.lastUpdate = time;
      let path = new Phaser.Curves.Path(this.player.x, this.player.y);
      path.lineTo(this.base.)
      this.base.add(new Phaser.Curves.Path())
      this.base.draw(this.graphics);
      console.log(this.base.curves);
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
