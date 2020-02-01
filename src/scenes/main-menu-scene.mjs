const PLANET_CHUNK_COUNT = 7

export default class MainMenuScene extends Phaser.Scene {
	constructor() {
		super('MainMenu')
	}

	preload() {
		console.log('[MainMenu] Preloading')

		this.cameras.main.setBackgroundColor(Phaser.Display.Color.GetColor(200, 0, 0))

		this.load.image('planet-core', 'assets/chunks/core.png')
		this.load.json('core-hitbox', 'assets/chunks/core_hitbox.json')
		for (let i = 1; i <= PLANET_CHUNK_COUNT; ++i) {
			this.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
			this.load.json(`chunk${i}-hitbox`, `assets/chunks/chunk${i}_hitbox.json`)
		}

		this.load.audio('mecha-academy', 'assets/musics/mecha-academy.ogg')
	}

	create() {
		console.log('[MainMenu] Creating')

		const centerX = this.game.config.width / 2
		const centerY = this.game.config.height / 2
		this.planetCore = this.matter.add.image(centerX, centerY, 'planet-core', null, {
			shape: this.cache.json.get(`core-hitbox`).core,
			ignorePointer: true,
			isStatic: true,
		})

		this.chunks = []
		for (let i = 1; i <= PLANET_CHUNK_COUNT; ++i) {
			const x = centerX + (centerX / 2) * Math.cos(Math.PI * 2 * i / PLANET_CHUNK_COUNT)
			const y = centerY + (centerY / 2) * Math.sin(Math.PI * 2 * i / PLANET_CHUNK_COUNT)
			const shape = this.cache.json.get(`chunk${i}-hitbox`)[`chunk${i}`]
			this.chunks.push(this.matter.add.image(x, y, `planet-chunk${i}`, null, {
				shape,
			}))
		}

		this.cameras.main.setBackgroundColor(0)
		this.cameras.main.fadeIn(1000, 200, 0, 0)

		this.music = this.sound.add('mecha-academy', { volume: 0.3 })
		this.music.play({ loop: true, seek: 1.5 })

		this.matter.add.mouseSpring()
		this.matter.world.setBounds(0, 0, game.config.width, game.config.height)
	}

	onStartButtonClick(pointer) {
		if (pointer.button !== 0 || this.loadingNextScene) {
			return
		}
		this.loadingNextScene = true
		this.cameras.main.fadeOut(500)
		this.cameras.main.on('camerafadeoutcomplete', () => {
			this.music.stop()
			this.scene.start('Level')
		})
	}

	update(timestamp, elapsed) {
		for (const chunk of this.chunks) {
			chunk.setAngle(0)
			chunk.setAngularVelocity(0)
		}
	}
}
