import Phaser from 'phaser';

export default class Car extends Phaser.GameObjects.Container {
  constructor(scene, x, y, carOptions) {
    super(scene, x, y);
    scene.physics.add.existing(this);
    scene.add.existing(this);

    this.car = scene.add.image(0, 0, carOptions.imageKey);
    this.add(this.car);

    const radius = this.car.height / 5;
    this.body.setSize(10, 10);
    this.body.setOffset(-5, -5);
    this.front = scene.add.circle(this.car.width / 2, 0, radius)
    scene.physics.add.existing(this.front);
    this.add(this.front);
    this.front.body.setCircle(radius)
    this.back = scene.add.circle(-this.car.width / 2, 0, radius)
    scene.physics.add.existing(this.back);
    this.add(this.back);
    this.back.body.setCircle(radius)
  }
}
