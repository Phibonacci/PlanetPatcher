import IntroScene from './scenes/intro-scene.mjs'
import MainMenuScene from './scenes/main-menu-scene.mjs'
import LevelScene from './scenes/level-scene.mjs'

export default class Game extends Phaser.Game {
	constructor() {
		super({
			type: Phaser.AUTO,
			width: 1024,
			height: 600,
			pixelArt: true,
			physics: {
				default: 'matter',
			},
			scene: [IntroScene, MainMenuScene, LevelScene],
		})
	}
}
