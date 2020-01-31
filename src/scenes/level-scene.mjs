export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	preload() {
		console.log('[Level] Preloading')
	}

	create() {
		console.log('[Level] Creating')
	}

	update(timestamp, elapsed) {
	}
}
