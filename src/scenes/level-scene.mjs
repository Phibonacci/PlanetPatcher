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

	}

	update(timestamp, elapsed) {
	}
}
