export default class Chunk {
    static preload(scene) {
        scene.load.image(scene.load.image('planet', 'assets/planet.png'))
    }

    constructor(scene, x, y) {
        this.sprite = scene.matter.add.image(x, y, 'planet', null, {
			shape: {
				type: 'circle',
				radius: 140
			},
			mass: 2000.0,
			isStatic: true,
			ignorePointer: false,
		})
	}

    update(scene, elapsed) {

    }
}
