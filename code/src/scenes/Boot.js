import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    this.load.image('blueCar', 'assets/blueCar.png');
  }

  create() {
    this.scene.start('Game');
  }
}
