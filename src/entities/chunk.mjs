class Chunk {
	static preload(scene) {
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			scene.load.image(`planet-chunk${i}`, `assets/chunks/chunk${i}.png`)
			scene.load.json(`chunk${i}-hitbox`, `assets/chunks/chunk${i}_hitbox.json`)
		}
	}

	constructor(scene, x, y, chunkType) {
		const shape = scene.cache.json.get(`chunk${chunkType}-hitbox`)[`chunk${chunkType}`]
		this.sprite = scene.matter.add.image(x, y, `planet-chunk${chunkType}`, null, {
			shape,
			mass: 100.0,
			isStatic: true,
			ignorePointer: false,
		})
	}

	update(scene, elapsed) {

	}
}

Chunk.PLANET_CHUNK_COUNT = 7

export default Chunk
