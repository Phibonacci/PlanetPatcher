export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	preload() {
		console.log('[Level] Preloading')

		// Déjà load dans l'intro
		//this.load.image('planet-full', 'assets/planet.png')

		this.load.image('robot', 'assets/robot.png')
	}

	create() {
		console.log('[Level] Creating')
		this.planet = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'planet-full')
		// this.robot = this.physics.add.image(50, 50, 'robot')
		this.robot = this.add.image(50, 50, 'robot')
		this.robot.X = 50
		this.robot.Y = 50
		this.robot.VX = 0
		this.robot.VY = 0
		this.robot.speed = 0.1
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		// this.robot.setCollideWorldBounds(true);

	}

	update(timestamp, elapsed) {
		if (this.cursorKeys.left.isDown) {
			this.robot.VX += -this.robot.speed
		} else if (this.cursorKeys.right.isDown) {
			this.robot.VX += this.robot.speed
		}
		if (this.cursorKeys.up.isDown) {
			this.robot.VY += -this.robot.speed
		} else if (this.cursorKeys.down.isDown) {
			this.robot.VY += this.robot.speed
		}
		this.robot.X += this.robot.VX
		this.robot.Y += this.robot.VY
		this.robot.setPosition(this.robot.X, this.robot.Y)
		this.robot.setRotation(-Phaser.Math.Angle.Between(
			this.robot.getCenter().y,
			this.robot.getCenter().x,
			this.planet.getCenter().y,
			this.planet.getCenter().x
		))
	}
}
