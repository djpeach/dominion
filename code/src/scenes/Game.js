import 'phaser';
import { xor, union } from 'martinez-polygon-clipping';
import Car from '../containers/Car';

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
      lineStyle: { color: 0xff0000 },
      fillStyle: { color: 0x538de6 },
    });
    this.player = new Car(this, this.game.config.width/ 2, this.game.config.height / 2, {
      imageKey: 'blueCar',
    });
    this.player.setScale(0.06);
    this.player.setAngle(-90);
    this.player.body.setVelocity(0, 0);
    this.base = new Phaser.Geom.Polygon();
    let baseRadius = 200;
    for (let i = 0; i < 360; i++) {
      let point = new Phaser.Geom.Point(
        this.player.x + baseRadius * Math.cos((i * Math.PI) / 180),
        this.player.y + baseRadius * Math.sin((i * Math.PI) / 180)
      );
      this.base.points.push(point);
    }
    this.base.points.push(this.base.points[0]);
    this.graphics.strokePoints(this.base.points);
    this.baseExpansion = new Phaser.Geom.Polygon();
    this.player.exploring = false;
    this.baseExpansionLineDrawer = new Phaser.Geom.Polygon();
    this.text = {
      title: this.add.text(50, 50, `Pointer:`),
      x: this.add.text(50, 70, `X: 0`),
      y: this.add.text(50, 90, `Y: 0`),
      h: this.add.text(50, 110, `H: 0`)
    }
  }

  update(time, delta) {
    let speed = 300;
    let rotation = 3;
    let newAngle = this.player.angle;
    if (this.cursors.right.isDown) {
      newAngle += rotation;
    }
    if (this.cursors.left.isDown) {
      newAngle -= rotation;
    }
    this.player.setAngle(newAngle);
    if (this.cursors.up.isDown) {
      this.player.body.setVelocity(
        speed * Math.cos((this.player.angle * Math.PI) / 180),
        speed * Math.sin((this.player.angle * Math.PI) / 180)
      );
    } else {
      this.player.body.setVelocity(0, 0);
    }
    let inBase = !!Phaser.Geom.Polygon.ContainsPoint(
      this.base,
      new Phaser.Geom.Point(this.player.x, this.player.y)
    );
    if (!this.exploring && !inBase) {
      console.log('leaving base');
      this.exploring = true;
      let exitPoint = new Phaser.Geom.Point(this.player.x, this.player.y)
      this.baseExpansion.nearestBaseExitPoint = {
        index: 0,
        point: new Phaser.Geom.Point(0, 0),
        distance: Number.MAX_SAFE_INTEGER
      }
      this.base.points.forEach((point, index) => {
        let distance = Phaser.Math.Distance.Between(exitPoint.x, exitPoint.y, point.x, point.y)
        if (distance < this.baseExpansion.nearestBaseExitPoint.distance) {
          this.baseExpansion.nearestBaseExitPoint = {index, point, distance}
        }
      })
      this.baseExpansion.setTo([this.baseExpansion.nearestBaseExitPoint.point, exitPoint])
      this.baseExpansionLineDrawer.setTo([this.baseExpansion.nearestBaseExitPoint.point, exitPoint])
    } else if (this.exploring && !inBase) {
      console.log('exploring');
      this.graphics.lineStyle(3, 0xff0000, .75);
      let newPoint = new Phaser.Geom.Point(this.player.x, this.player.y)
      this.baseExpansion.points.push(newPoint);
      this.baseExpansionLineDrawer.points.push(newPoint);
      this.graphics.strokePoints(this.baseExpansionLineDrawer.points);
      this.baseExpansionLineDrawer.setTo([newPoint]);
    } else if (this.exploring && inBase) {
      console.log('returning back to base');
      this.exploring = false;

      let entryPoint = new Phaser.Geom.Point(this.player.x, this.player.y)
      this.baseExpansion.nearestBaseEntryPoint = {
        index: 0,
        point: new Phaser.Geom.Point(0, 0),
        distance: Number.MAX_SAFE_INTEGER
      }
      this.base.points.forEach((point, index) => {
        let distance = Phaser.Math.Distance.Between(entryPoint.x, entryPoint.y, point.x, point.y)
        if (distance < this.baseExpansion.nearestBaseEntryPoint.distance) {
          this.baseExpansion.nearestBaseEntryPoint = {index, point, distance}
        }
      })
      this.baseExpansion.points.push(this.baseExpansion.nearestBaseEntryPoint.point);
      this.baseExpansion.points.push(this.baseExpansion.points[0]);
      this.graphics.clear();
      this.graphics.strokePoints(this.base.points);
      this.graphics.strokePoints(this.baseExpansion.points);
    }
    let pointer = this.input.activePointer;
    this.text.x.setText(`X: ${pointer.x}`)
    this.text.y.setText(`Y: ${pointer.y}`)
    this.text.h.setText(`H: ${Math.sqrt(pointer.x*pointer.x + pointer.y*pointer.y)}`)
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


// resort points to start at exitPoint
// let head = this.base.points.slice(0, first.index);
// let tail = this.base.points.slice(first.index, this.base.points.length);
// this.base.setTo([...tail, ...head]);
// this.base.points.push(first.point);
// this.graphics.clear();
// this.graphics.lineStyle(15, 0xffffff, 0.5);
// this.graphics.strokePoints(this.base.points);
// this.graphics.lineStyle(3, 0x00ff00);
// this.graphics.strokePoints(head) // green
// this.graphics.lineStyle(3, 0x0000ff);
// this.graphics.strokePoints(tail) // blue
// this.graphics.lineStyle(3, 0xff0000);
// this.graphics.strokePoints(this.baseExpansion.points);

// build new path with the remaining current base and new base expansion
// console.log(last.index - first.index);
// let remainingBasePath = this.base.points.slice(last.index - first.index, this.base.points.length);
// this.graphics.lineStyle(8, 0xff0000, 0.35);
// this.graphics.strokePoints(remainingBasePath);
// this.base.setTo([...this.baseExpansion.points, ...remainingBasePath]);
