const PLANET_CHUNK_COUNT = 7
const PLANET_MAX_HEALTH = 15

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Intro')
	}

	preload() {
		console.log('[Intro] Preloading')

		this.load.image('planet-full', 'assets/planet.png')
		this.load.image('dollar', 'assets/dollar.png')

		this.load.audio('coin', 'assets/sounds/coin.wav')
		this.load.audio('explosion', 'assets/sounds/explosion.wav')

		this.load.image('planet-core', 'assets/chunks/core.png')
		this.load.json('core-hitbox', 'assets/chunks/core_hitbox.json')
		for (let i = 1; i <= PLANET_CHUNK_COUNT; ++i) {
			this.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
			this.load.json(`chunk${i}-hitbox`, `assets/chunks/chunk${i}_hitbox.json`)
		}

		this.load.audio('mecha-academy', 'assets/musics/mecha-academy.ogg')
	}

	create() {
		console.log('[Intro] Creating')

		this.planet = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'planet-full')

		this.planetHealth = PLANET_MAX_HEALTH
		this.loadingNextScene = false

		this.planet.setInteractive({ useHandCursor: true })
		this.planet.on('pointerdown', pointer => this.hitPlanet(pointer))

		this.dollars = []
	}

	update(timestamp, elapsed) {
		const angleVelocity = 0.02 + (1 - (this.planetHealth / PLANET_MAX_HEALTH)) / 5
		this.planet.angle += elapsed * angleVelocity

		const expectedY = this.game.config.height / 2 + Math.cos(timestamp / 1000 * Math.PI) * 20
		this.planet.y = this.planet.y + (expectedY - this.planet.y) * Math.min(1, elapsed / 150)

		let shouldRebuildDollars = false
		for (const dollar of this.dollars) {
			dollar.y -= elapsed / 1000 * 100
			dollar.alpha -= elapsed / 1000 / 2
			if (dollar.alpha <= 0) {
				dollar.destroy()
				shouldRebuildDollars = true
			}
		}
		if (shouldRebuildDollars) {
			this.dollars = this.dollars.filter(x => x.active)
		}
	}

	hitPlanet(pointer) {
		if (pointer.button !== 0 || this.loadingNextScene) {
			return
		}

		this.planetHealth -= 1
		const red = 0xFF;
		const green = 0xFF * this.planetHealth / PLANET_MAX_HEALTH
		const blue = green
		this.planet.setTint((red << 16) + (green << 8) + blue)
		if (this.planetHealth === 0) {
			this.sound.play('explosion', { volume: 1.0 });
			this.loadNextScene()
		} else {
			this.sound.play('coin', { volume: 0.3 });
			this.planet.y -= 50
		}

		const currentMoney = PLANET_MAX_HEALTH - this.planetHealth
		this.add.image(currentMoney * 32, 32, 'dollar')

		this.dollars.push(this.add.image(pointer.x, pointer.y, 'dollar'))
	}

	loadNextScene() {
		this.loadingNextScene = true
		this.scene.start('MainMenu')
	}
}
