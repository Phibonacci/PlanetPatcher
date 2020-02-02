import IntroScene from './scenes/intro-scene.mjs'
import LevelScene from './scenes/level-scene.mjs'

export default class Game extends Phaser.Game {
	constructor() {
		super({
			type: Phaser.AUTO,
			width: 1024,
			height: 600,
			pixelArt: true,
			autoRound: true,
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
			},
			physics: {
				default: 'matter',
				matter: {
					debug: false,
					gravity: {
						scale: 0,
					},
					plugins: {
						attractors: true
					}
				},
			},
			scene: [IntroScene, LevelScene],
		})
	}
}
