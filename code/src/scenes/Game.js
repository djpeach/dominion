import 'phaser';
import { union } from 'martinez-polygon-clipping';

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
    this.base = new Phaser.Geom.Polygon();
    let baseRadius = 50;
    for (let i = 0; i < 360; i++) {
      let point = new Phaser.Geom.Point(
        this.player.x + baseRadius * Math.cos((i * Math.PI) / 180),
        this.player.y + baseRadius * Math.sin((i * Math.PI) / 180)
      );
      this.base.points.push(point);
    }
    this.graphics.fillPoints(this.base.points);
    this.baseExpansion = new Phaser.Geom.Polygon();
    this.baseExpansion.lastUpdate = 0;
    this.player.exploring = false;
  }

  update(time, delta) {
    console.log(this.player.body.bottom);
    let speed = 300;
    let rotation = 3;
    let newAngle = this.player.angle;
    if (
      !Phaser.Geom.Point.Equals(
        this.player.body.velocity,
        new Phaser.Geom.Point(0, 0)
      ) ||
      true
    ) {
      if (this.cursors.right.isDown) {
        newAngle += rotation;
      }
      if (this.cursors.left.isDown) {
        newAngle -= rotation;
      }
    }
    this.player.setAngle(newAngle);
    if (this.cursors.up.isDown) {
      this.player.setVelocity(
        speed * Math.cos((this.player.angle * Math.PI) / 180),
        speed * Math.sin((this.player.angle * Math.PI) / 180)
      );
    } else {
      this.player.setVelocity(0, 0);
    }
    let inBase = !!Phaser.Geom.Polygon.ContainsPoint(
      this.base,
      new Phaser.Geom.Point(this.player.x, this.player.y)
    );
    if (!this.exploring && !inBase) {
      console.log('leaving base');
      this.exploring = true;
      this.baseExpansion.points.push(
        new Phaser.Geom.Point(this.player.x, this.player.body.bottom)
      );
    } else if (
      this.exploring &&
      !inBase &&
      time - this.baseExpansion.lastUpdate > 60
    ) {
      console.log('exploring');
      this.baseExpansion.points.push(
        new Phaser.Geom.Point(this.player.x, this.player.y)
      );
      this.graphics.strokePoints(this.baseExpansion.points);
      this.baseExpansion.lastUpdate = time;
    } else if (this.exploring && inBase) {
      console.log('returning back to base');
      this.exploring = false;
      this.baseExpansion.points.push(
        new Phaser.Geom.Point(this.player.x, this.player.y)
      );
      // Phaser.Geom.Polygon.Smooth(this.baseExpansion);
      this.baseGeometry = [
        [this.base.points.map((point) => [point.x, point.y])],
      ];
      this.baseExpansionGeometry = [
        [this.baseExpansion.points.map((point) => [point.x, point.y])],
      ];
      let newBaseGeometry = union(
        this.baseGeometry,
        this.baseExpansionGeometry
      )[0][0];
      this.base.setTo(newBaseGeometry);
      this.baseExpansion.setTo([]);
      this.graphics.fillPoints(this.base.points);
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
