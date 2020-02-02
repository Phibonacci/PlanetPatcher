import Robot from '../entities/robot.mjs'
import Chunk from '../entities/chunk.mjs'

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	preload() {
		console.log('[Level] Preloading')

		// Déjà load dans l'intro
		//this.load.image('planet-full', 'assets/planet.png')

		this.load.image('robot', 'assets/robot.png')
		this.load.audio('steampunk-spies', 'assets/musics/steampunk-spies.ogg')
		Robot.preload(this)
		Chunk.preload(this)
	}

	create() {
		console.log('[Level] Creating')

		this.robot = new Robot(this, 100, 100)
		this.chunks = [ new Chunk(this, 200, 200), new Chunk(this, 600, 300) ]

		this.cursorKeys = this.input.keyboard.createCursorKeys();

		this.music = this.sound.add('steampunk-spies', { volume: 0.5 })
		this.music.play({ loop: true, seek: 2.0 })

		this.matter.world.setBounds()
	}

	update(_, elapsed) {
		this.matter.add.mouseSpring();

		this.robot.update(this, elapsed, this.chunks)
	}
}
