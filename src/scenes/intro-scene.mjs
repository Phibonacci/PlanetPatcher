export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Intro')
	}

	preload() {
		console.log('[Intro] Preloading')

		this.load.image('planet-full', 'assets/planet.png')
	}

	create() {
		console.log('[Intro] Creating')

		this.planet = this.add.image(500, 300, 'planet-full')

		this.loadingNextScene = false

		this.input.on('pointerdown', () => {
			if (this.loadingNextScene) {
				return
			}
			this.loadingNextScene = true
			this.cameras.main.fadeOut(500)
			this.cameras.main.on('camerafadeoutcomplete', () => {
				this.scene.start('Level')
			});
		})
	}

	update(timestamp, elapsed) {
		this.planet.angle += elapsed * 0.02
		this.planet.y = this.game.config.height / 2 + Math.cos(timestamp / 200) * 10
	}
}
