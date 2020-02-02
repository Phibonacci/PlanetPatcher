export default class Background {
	static preload(scene) {
		scene.load.image('background', 'assets/background.png')
	}

	constructor(scene) {
		this.scene = scene
		this.sprite = scene.add.tileSprite(0, 0, scene.game.config.width, scene.game.config.height, 'background')
		this.sprite.setOrigin(0, 0)
	}
}
