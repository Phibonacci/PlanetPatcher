export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	preload() {
		console.log('[Level] Preloading')

		this.load.image('robot', 'assets/robot.png')
	}

	create() {
		console.log('[Level] Creating')

		this.matter.add.sprite(100, 100, 'robot')
		this.cameras.main.fadeIn(500)
	}

	update(timestamp, elapsed) {
	}
}
