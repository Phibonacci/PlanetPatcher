class Chunk {
	static preload(scene) {
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			scene.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
			scene.load.json(`chunk${i}-hitbox`, `assets/chunks/chunk${i}_hitbox.json`)
		}
	}

	constructor(scene, x, y, chunkType) {
		this.scene = scene
		this.type = chunkType
		const shape = scene.cache.json.get(`chunk${chunkType}-hitbox`)[`chunk${chunkType}`]
		this.sprite = scene.matter.add.image(x, y, `planet-chunk${chunkType}`, null, {
			shape,
			mass: 100.0,
			isStatic: false,
			ignorePointer: false,
		})
	}

	checkAndUpdatePosition(core) {
		const expectedPos = Chunk.ORIGINAL_POSITIONS[this.type - 1]
		let deltaX = Math.abs((this.sprite.x - core.x) - expectedPos.x)
		let deltaY = Math.abs((this.sprite.y - core.y) - expectedPos.y)
		let deltaAngle = Math.abs(this.sprite.angle % 360)
		if (deltaX < 5 && deltaY < 5 && deltaAngle < 5 || this.sprite.isStatic()) {
			if (!this.sprite.isStatic()) {
				this.sprite.setStatic(true)
				this.sprite.body.ignorePointer = true
				this.scene.sound.play('repair', { volume: 1.0 })
			}
			this.sprite.setPosition(core.x + expectedPos.x, core.y + expectedPos.y)
			this.sprite.setAngle(0)
		}
	}

	isStatic() {
		return this.sprite.isStatic()
	}
}

Chunk.PLANET_CHUNK_COUNT = 7

Chunk.ORIGINAL_POSITIONS = [
	{ x: -38.4053525650732, y: -99.07659475924805 },
	{ x: -83.56300496127267, y: 41.489868659412195 },
	{ x: -16.988496988488407, y: -48.531061815251974 },
	{ x: 9.402535243795114, y: 32.35538242751096 },
	{ x: 78.39971731844594, y: -57.35720423175846 },
	{ x: 21.585369187653896, y: 102.23886175587222 },
	{ x: 93.95423402243694, y: 32.47817776151487 },
]

Chunk.DESTRUCTION_VELOCITIES = [
	{ x: -10, y: -10 },
	{ x: -10, y: 10 },
	{ x: -1, y: -5 },
	{ x: 1, y: 5 },
	{ x: 10, y: -10 },
	{ x: 10, y: 10 },
	{ x: 10, y: 10 },
]

export default Chunk
