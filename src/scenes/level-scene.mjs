import Background from '../entities/background.mjs'
import Robot from '../entities/robot.mjs'
import Chunk from '../entities/chunk.mjs'

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	create() {
		console.log('[Level] Creating')

		this.background = new Background(this)
		this.createAndExplodePlanet()

		this.cameras.main.setBackgroundColor(0)
		this.cameras.main.fadeIn(500, 120, 0, 0)

		this.robot = new Robot(this, 100, 100)
		this.cursorKeys = this.input.keyboard.createCursorKeys();

		this.music = this.sound.add('mecha-academy', { volume: 0.3 })
		this.music.play({ loop: true, seek: 1.5 })

		this.matter.world.setBounds()
		this.matter.add.mouseSpring()

		this.timer = 0
		this.currentTick = 0
		this.loadingNextScene = false
	}

	createAndExplodePlanet() {
		const centerX = this.game.config.width / 2
		const centerY = this.game.config.height / 2

		this.chunks = []
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			const pos = Chunk.ORIGINAL_POSITIONS[i - 1]
			const chunk = new Chunk(this, centerX + pos.x, centerY + pos.y, i)
			const velocity = Chunk.DESTRUCTION_VELOCITIES[i - 1]
			chunk.sprite.setVelocity(velocity.x, velocity.y)
			this.chunks.push(chunk)
		}

		this.planetCore = this.matter.add.image(centerX, centerY, 'planet-core', null, {
			shape: this.cache.json.get(`core-hitbox`).core,
			ignorePointer: true,
			isStatic: true,
		})
		this.planetCore.setMass(Chunk.MASS)

		this.chunksPlusCore = [...this.chunks, { sprite: this.planetCore }]
	}

	update(_, elapsed) {
		this.timer += elapsed
		this.currentTick += 1

		this.robot.update(this, elapsed, this.chunksPlusCore)

		if (this.timer < 1000 || this.loadingNextScene) {
			return
		}

		const currentChunk = this.chunks[this.currentTick % Chunk.PLANET_CHUNK_COUNT]
		currentChunk.checkAndUpdatePosition(this.planetCore)
		if (this.chunks.every(x => x.isStatic())) {
			this.win()
		}
	}

	win() {
		this.loadingNextScene = true
		this.music.stop()
		this.scene.start('Intro')
	}
}
