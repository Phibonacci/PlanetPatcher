import Background from '../entities/background.mjs'
import Robot from '../entities/robot.mjs'
import Chunk from '../entities/chunk.mjs'

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super('Level')
	}

	create() {
		console.log('[Level] Creating')

		this.background = new Background(this)
		this.createAndExplodePlanet()

		this.cameras.main.setBackgroundColor(0)
		this.cameras.main.fadeIn(500, 120, 0, 0)

		this.robot = new Robot(this, 100, 100)
		this.cursorKeys = this.input.keyboard.createCursorKeys()

		this.music = this.sound.add('mecha-academy', { volume: 0.2 })
		this.music.play({ loop: true, seek: 1.5 })

		this.matter.world.setBounds()
		this.matter.add.mouseSpring()

		this.timer = 0
		this.currentTick = 0
		this.loadingNextScene = false

		this.robotRope = this.add.line(0, 0, 0, 0, 0, 0, 0xFFFFFF)
		this.robotRope.visible = false
		this.selectedChunk = null
		this.selectedPoint = null
		this.rotationSinceSelection = null

		this.cursorKeys.space.on('down', () => {
			const chunk = this.robot.getClosestNonStaticChunk(this.chunks)
			const intersections = Phaser.Physics.Matter.Matter.Query.ray(
				this.chunkBodies,
				{ x: this.robot.x, y: this.robot.y },
				{ x: chunk.x, y: chunk.y },
				100
			)
			if (intersections.length > 0) {
				if (chunk && !chunk.isStatic()) {
					this.selectedChunk = chunk
					this.selectedPoint = new Phaser.Math.Vector2(
						intersections[0].supports[0].x - this.selectedChunk.x,
						intersections[0].supports[0].y - this.selectedChunk.y)
						this.rotationSinceSelection = chunk.sprite.rotation
					this.updateRope(0)
					this.robotRope.visible = true
					this.sound.play('jump', { volume: 1 })
				}
			}
		})
		this.cursorKeys.space.on('up', () => {
			if (this.robotRope.visible) {
				this.sound.play('release', { volume: 1 })
				this.robotRope.visible = false
			}
		})
	}

	createAndExplodePlanet() {
		const centerX = this.game.config.width / 2
		const centerY = this.game.config.height / 2

		this.chunks = []
		for (let i = 1; i <= Chunk.PLANET_CHUNK_COUNT; ++i) {
			const pos = Chunk.ORIGINAL_POSITIONS[i - 1]
			const chunk = new Chunk(this, centerX + pos.x, centerY + pos.y, i)
			chunk.sprite.anims.play('event' + i, true)
			const velocity = Chunk.DESTRUCTION_VELOCITIES[i - 1]
			chunk.sprite.setVelocity(velocity.x, velocity.y)
			this.chunks.push(chunk)
		}
		this.chunkBodies = this.chunks.map(x => x.sprite.body)

		this.planetCore = this.matter.add.sprite(centerX, centerY, 'planet-core', null, {
			shape: this.cache.json.get('core-hitbox').core,
			ignorePointer: true,
			isStatic: true,
		})
		this.anims.create({
			key: 'core',
			frames: this.anims.generateFrameNumbers(`core_anim`, { start: 0, end: 3 }),
			frameRate: 4,
			repeat: -1,
		})
		this.planetCore.anims.play('core', true)
		this.planetCore.setMass(Chunk.MASS)

		this.chunksPlusCore = [...this.chunks, { sprite: this.planetCore }]
	}

	update(_, elapsed) {
		this.timer += elapsed
		this.currentTick += 1

		this.robot.update(this, elapsed, this.chunksPlusCore)

		if (this.timer < 1000 || this.loadingNextScene) {
			return
		}

		const currentChunk = this.chunks[this.currentTick % Chunk.PLANET_CHUNK_COUNT]
		currentChunk.checkAndUpdatePosition(this.planetCore)
		if (this.chunks.every(x => x.isStatic())) {
			this.win()
			return
		}

		if (this.robotRope.visible) {
			this.updateRope(elapsed)
		}
	}

	win() {
		this.loadingNextScene = true
		this.music.stop()
		this.scene.start('Intro')
	}

	updateRope(elapsed) {
		const center_to_anchor = new Phaser.Math.Vector2(
			this.selectedPoint.x + this.selectedChunk.x,
			this.selectedPoint.y + this.selectedChunk.y)
		const anchor = Phaser.Math.RotateAround(
			center_to_anchor,
			this.selectedChunk.x, this.selectedChunk.y,
			this.selectedChunk.sprite.rotation - this.rotationSinceSelection)

		this.robotRope.setTo(
			anchor.x,
			anchor.y,
			this.robot.x, this.robot.y)
		const v = new Phaser.Math.Vector2(
			this.robot.x - this.selectedChunk.x,
			this.robot.y - this.selectedChunk.y)
		const distance = Phaser.Math.Distance.BetweenPoints(this.selectedChunk, this.robot)
		v.normalize().scale(elapsed * distance / 1000000)
		if (distance > 100) {
			this.selectedChunk.sprite.applyForceFrom(anchor, v)
		}
	}
}
