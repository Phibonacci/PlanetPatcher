export default class Title {
	static preload(scene) {
		scene.load.image('logo_planet', 'assets/planet_logo-1.png')
		scene.load.image('logo_patcher', 'assets/patcher_logo-1.png')
	}

	constructor(scene) {
		this.scene = scene
		this.planet = scene.add.image(180, 80, 'logo_planet')
		this.patcher = scene.add.image(180, 150, 'logo_patcher')
		this.planet.setScale(6)
		this.patcher.setScale(6)
	}
}
