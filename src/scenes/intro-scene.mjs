export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Intro')
	}

	preload() {
		console.log('[Intro] Preloading')
	}

	create() {
		console.log('[Intro] Creating')
	}

	update(timestamp, elapsed) {
	}
}
