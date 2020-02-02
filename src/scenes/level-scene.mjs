import Robot from '../entities/robot.mjs'
import Chunk from '../entities/chunk.mjs'

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	create() {
		console.log('[Level] Creating')

		this.robot = new Robot(this, 100, 100)
		this.chunks = [ new Chunk(this, 200, 200, 1), new Chunk(this, 600, 300, 2) ]

		this.cursorKeys = this.input.keyboard.createCursorKeys();

		this.matter.world.setBounds()
	}

	update(_, elapsed) {
		this.matter.add.mouseSpring();

		this.robot.update(this, elapsed, this.chunks)
	}
}
