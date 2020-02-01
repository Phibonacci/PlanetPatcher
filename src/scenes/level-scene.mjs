export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	preload() {
		console.log('[Level] Preloading')

		// Déjà load dans l'intro
		//this.load.image('planet-full', 'assets/planet.png')

		//this.load.image('robot', 'assets/robot.png')
		this.load.image('sun', 'assets/planet.png')
		this.load.image('alien', 'assets/robot.png')
	}

	create() {
		console.log('[Level] Creating')

		// this.matter.world.setBounds();
		//
		// this.matter.add.sprite(100, 100, 'robot')

		// this.planet = this.add.image(500, 300, 'planet-full')
		// this.planet.setScale(0.1)

		// this.cameras.main.fadeIn(500)
		//
		// this.planet = this.matter.add.image(500, 300, 'planet-full', null, {
		// 	scale: {
		// 		x: 50,
		// 		y: 50
		// 	},
		// 	shape: {
		// 		type: 'circle',
		// 		radius: 10
		// 	},
		// 	plugin: {
		// 		attractors: [
		// 			function (bodyA, bodyB) {
		// 				return {
		// 					x: (bodyA.position.x - bodyB.position.x) * 0.000001,
		// 					y: (bodyA.position.y - bodyB.position.y) * 0.000001
		// 				};
		// 			}
		// 		]
		// 	}
		// })
		//this.planete.setScale(0.1)
		this.matter.world.setBounds();

    this.matter.add.imageStack('alien', null, 0, 500, 50, 2, 0, 0, {
        mass: 0.5,
        ignorePointer: true
    });

    var sun = this.matter.add.image(400, 200, 'sun', null, {
        shape: {
            type: 'circle',
            radius: 64
        },
        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    return {
                        x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                        y: (bodyA.position.y - bodyB.position.y) * 0.000001
                    };
                }
            ]
        }
    });
		sun.setScale(0.1)
    this.matter.add.mouseSpring();
	}

	update(timestamp, elapsed) {
	}
}
