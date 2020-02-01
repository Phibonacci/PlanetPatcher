const PLANET_CHUNK_COUNT = 7

export default class MainMenuScene extends Phaser.Scene {
	constructor() {
		super('MainMenu')
	}

	preload() {
		console.log('[MainMenu] Preloading')

		this.cameras.main.setBackgroundColor(Phaser.Display.Color.GetColor(200, 0, 0))

		this.load.image(`planet-core`, `assets/chunks/core.png`)
		for (let i = 1; i <= PLANET_CHUNK_COUNT; ++i) {
			this.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
		}
	}

	create() {
		console.log('[MainMenu] Creating')

		const centerX = this.game.config.width / 2
		const centerY = this.game.config.height / 2
		this.planetCore = this.add.image(centerX, centerY, 'planet-core')

		this.chunks = []
		for (let i = 1; i <= PLANET_CHUNK_COUNT; ++i) {
			const x = centerX + (centerX / 2) * Math.cos(Math.PI * 2 * i / PLANET_CHUNK_COUNT)
			const y = centerY + (centerY / 2) * Math.sin(Math.PI * 2 * i / PLANET_CHUNK_COUNT)
			this.chunks.push(this.add.image(x, y, `planet-chunk${i}`))
		}

		this.add.text(this.game.config.width / 2, this.game.config.height / 4, 'Planet Patcher (TODO: logo)')
		this.startButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Play (TODO: triangle)')

		this.loadingNextScene = false
		this.startButton.setInteractive({ useHandCursor: true })
		this.startButton.on('pointerdown', pointer => this.onStartButtonClick(pointer))

		this.cameras.main.setBackgroundColor(0)
		this.cameras.main.fadeIn(1000, 200, 0, 0)
	}

	onStartButtonClick(pointer) {
		if (pointer.button !== 0 || this.loadingNextScene) {
			return
		}
		this.loadingNextScene = true
		this.cameras.main.fadeOut(500)
		this.cameras.main.on('camerafadeoutcomplete', () => {
			this.scene.start('Level')
		})
	}

	update(timestamp, elapsed) {
	}
}
