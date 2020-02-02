import Chunk from '../entities/chunk.mjs'

const ORIGINAL_POSITIONS = [
	{ x: -38.4053525650732, y: -99.07659475924805 },
	{ x: -83.56300496127267, y: 41.489868659412195 },
	{ x: -16.988496988488407, y: -48.531061815251974 },
	{ x: 9.402535243795114, y: 32.35538242751096 },
	{ x: 78.39971731844594, y: -57.35720423175846 },
	{ x: 21.585369187653896, y: 102.23886175587222 },
	{ x: 93.95423402243694, y: 32.47817776151487 },
]

const DESTRUCTION_VELOCITIES = [
	{ x: -10, y: -10 },
	{ x: -10, y: 10 },
	{ x: -1, y: -5 },
	{ x: 1, y: 5 },
	{ x: 10, y: -10 },
	{ x: 10, y: 10 },
	{ x: 10, y: 10 },
]

export default class MainMenuScene extends Phaser.Scene {
	constructor() {
		super('MainMenu')
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
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			const pos = ORIGINAL_POSITIONS[i - 1]
			const shape = this.cache.json.get(`chunk${i}-hitbox`)[`chunk${i}`]
			const chunk = this.matter.add.image(
				this.planetCore.x + pos.x,
				this.planetCore.y + pos.y,
				`planet-chunk${i}`, null, {
				shape,
			})
			const velocity = DESTRUCTION_VELOCITIES[i - 1]
			chunk.setVelocity(velocity.x, velocity.y)
			this.chunks.push(chunk)
		}

		this.cameras.main.setBackgroundColor(0)
		this.cameras.main.fadeIn(500, 120, 0, 0)

		this.music = this.sound.add('mecha-academy', { volume: 0.3 })
		this.music.play({ loop: true, seek: 1.5 })

		this.matter.add.mouseSpring()
		this.matter.world.setBounds(0, 0, game.config.width, game.config.height)

		this.timer = 0
		this.currentTick = 0
		this.loadingNextScene = false
	}

	update(_, elapsed) {
		this.timer += elapsed
		this.currentTick += 1

		if (this.timer < 1000 || this.loadingNextScene) {
			return
		}

		this.checkChunkPosition(this.currentTick % Chunk.PLANET_CHUNK_COUNT)

		if (this.chunks.every(x => x.isStatic())) {
			this.win()
		}
	}

	checkChunkPosition(index) {
		const chunk = this.chunks[index]
		const expectedPos = ORIGINAL_POSITIONS[index]
		let deltaX = Math.abs((chunk.x - this.planetCore.x) - expectedPos.x)
		let deltaY = Math.abs((chunk.y - this.planetCore.y) - expectedPos.y)
		let deltaAngle = Math.abs(chunk.angle % 360)
		if (deltaX < 5 && deltaY < 5 && deltaAngle < 5 || chunk.isStatic()) {
			if (!chunk.isStatic()) {
				chunk.setStatic(true)
				chunk.body.ignorePointer = true
				this.sound.play('repair', { volume: 1.0 });
			}
			chunk.setPosition(this.planetCore.x + expectedPos.x, this.planetCore.y + expectedPos.y)
			chunk.setAngle(0)
		}
	}

	win() {
		this.loadingNextScene = true
		this.music.stop()
		this.scene.start('Intro')
	}
}
