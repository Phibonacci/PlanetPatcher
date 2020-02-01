const PLANET_MAX_HEALTH = 10

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

		this.planet = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'planet-full')

		this.planetHealth = PLANET_MAX_HEALTH
		this.loadingNextScene = false

		this.planet.setInteractive({ useHandCursor: true })
		this.planet.on('pointerdown', (pointer) => {
			if (pointer.button !== 0 || this.loadingNextScene) {
				return
			}
			this.hitPlanet()
		})
	}

	update(timestamp, elapsed) {
		const angleVelocity = 0.02 + (1 - (this.planetHealth / PLANET_MAX_HEALTH)) / 5
		this.planet.angle += elapsed * angleVelocity

		const expectedY = this.game.config.height / 2 + Math.cos(timestamp / 1000 * Math.PI) * 20
		this.planet.y = this.planet.y + (expectedY - this.planet.y) * Math.min(1, elapsed / 150)
	}

	hitPlanet() {
		this.planetHealth -= 1
		const red = 0xFF;
		const green = 0xFF * this.planetHealth / PLANET_MAX_HEALTH
		const blue = green;
		this.planet.setTint((red << 16) + (green << 8) + blue)
		if (this.planetHealth === 0) {
			this.loadNextScene()
		} else {
			this.planet.y -= 50
		}
	}

	loadNextScene() {
		this.loadingNextScene = true
		this.cameras.main.fadeOut(100, 200, 0, 0)
		this.cameras.main.on('camerafadeoutcomplete', () => {
			setTimeout(() => this.scene.start('MainMenu'), 1000)
		})
	}
}
