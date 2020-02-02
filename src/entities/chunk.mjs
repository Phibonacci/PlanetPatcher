export default class Chunk {
	static preload(scene) {
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			scene.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
			scene.load.json(`chunk${i}-hitbox`, `assets/chunks/chunk${i}_hitbox.json`)
			const frameSize = Chunk.FRAME_SIZES[i - 1]
			scene.load.spritesheet(`planet-chunk${i}_anim`, `assets/chunks/chunk${i}_anim.png`, {
				frameWidth: frameSize.width,
				frameHeight: frameSize.height
			})
		}
	}

	constructor(scene, x, y, chunkType) {
		this.scene = scene
		this.type = chunkType
		const shape = scene.cache.json.get(`chunk${chunkType}-hitbox`)[`chunk${chunkType}`]
		this.sprite = scene.matter.add.sprite(x, y, `planet-chunk${chunkType}_anim`, null, {
			shape,
			isStatic: false,
			ignorePointer: false,
		})
		this.scene.anims.create({
			key: 'event' + chunkType,
			frames: scene.anims.generateFrameNumbers(`planet-chunk${chunkType}_anim`, { start: 0, end: 3 }),
			frameRate: 4,
			repeat: -1,
		})
		this.sprite.setMass(Chunk.MASS)
	}

	checkAndUpdatePosition(core) {
		const expectedPos = Chunk.ORIGINAL_POSITIONS[this.type - 1]
		let deltaX = Math.abs((this.sprite.x - core.x) - expectedPos.x)
		let deltaY = Math.abs((this.sprite.y - core.y) - expectedPos.y)
		let deltaAngle = Math.abs((this.sprite.angle + 360) % 360)
		if (deltaX < 10 && deltaY < 10 && deltaAngle < 10 || this.sprite.isStatic()) {
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

	get x() {
		return this.sprite.x
	}

	get y() {
		return this.sprite.y
	}
}

Chunk.MASS = 30.0
Chunk.PLANET_CHUNK_COUNT = 7

Chunk.FRAME_SIZES = [
	{ width: 253, height: 143 },
	{ width: 161, height: 200 },
	{ width: 157, height: 115 },
	{ width: 137, height: 122 },
	{ width: 127, height: 132 },
	{ width: 139, height: 109 },
	{ width: 119, height: 160 },
]

Chunk.ORIGINAL_POSITIONS = [
	{ x: -40.405, y: -98.076}, // vert foncé arbre
	{ x: -83.563, y: 41.489}, // bleu foncé baleine
	{ x: -16.988, y: -48.531}, // jaune palmier
	{ x: 9.402, y: 32.355}, // vert clair moulin
	{ x: 77.399, y: -58.357}, // bleu clair phare
	{ x: 21.485, y: 102.238}, // blanc iglou
	{ x: 93.954, y: 31.000}, // marron
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
