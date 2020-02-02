const EPSILON = 0.00001

export default class Robot {
	static preload(scene) {
		scene.load.spritesheet('robot', 'assets/robot.png', { frameWidth: 32, frameHeight: 32})
		scene.load.spritesheet('robot_propulsor', 'assets/robot_propulsor_animation.png', { frameWidth: 32, frameHeight: 32})
		scene.load.json('robot-hitbox', 'assets/robot_hitbox.json')
	}

	constructor(scene, x, y) {
		scene.anims.create({
            key: 'giggle',
            frames: scene.anims.generateFrameNumbers('robot', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
		})
		scene.anims.create({
            key: 'propulse',
            frames: scene.anims.generateFrameNumbers('robot_propulsor', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
		})
		this.sprite = scene.matter.add.sprite(x, y, 'robot', null, {
			shape: scene.cache.json.get('robot-hitbox')['robot'],
			ignorePointer: false,
		})
		this.sprite.setMass(1.0)
		this.sprite.anims.play('giggle', true)
		this.thruster_speed = 0.00002
	}

	distanceSquareBetweenCenterOfMasses(other) {
		return Phaser.Math.Distance.BetweenPointsSquared(
			this.sprite.centerOfMass.add({ x: this.sprite.x, y: this.sprite.y }),
			other.sprite.centerOfMass.add({ x: other.sprite.x, y: other.sprite.y }))
	}

	applyGravity(elapsed, chunks) {
		let min_distance = null
		let min_distance_direction = null
		for (const chunk of chunks) {
			const distance = this.distanceSquareBetweenCenterOfMasses(chunk)
			const direction = new Phaser.Math.Vector2(
				chunk.sprite.x - this.sprite.x,
				chunk.sprite.y - this.sprite.y)
			if (min_distance === null || min_distance > distance) {
				min_distance = distance
				min_distance_direction = direction.clone()
			}
			const rmass = this.sprite.body.mass
			const cmass = chunk.sprite.body.mass
			if (distance <= EPSILON) {
				continue
			}
			const massesOnDistance = rmass * cmass / distance
			if (massesOnDistance < EPSILON) {
				continue
			} else if (rmass > cmass * 1000) {
				continue
			}
			const force = elapsed / 200 * rmass * cmass / Math.max(10000, distance)
			const force_on_direction = direction.normalize().scale(force)
			this.sprite.applyForce(force_on_direction)
		}
		const expectedRotation = min_distance_direction.angle() - Math.PI / 2
		this.sprite.setRotation(Phaser.Math.Angle.RotateTo(this.sprite.rotation, expectedRotation, elapsed / 1000.0 * 5.0))
	}

	applyThruster(scene, elapsed) {
		let vx = 0
		if (scene.cursorKeys.left.isDown) {
			vx += -1
		} else if (scene.cursorKeys.right.isDown) {
			vx += 1
		}
		let vy = 0
		if (scene.cursorKeys.up.isDown) {
			vy += -1
		} else if (scene.cursorKeys.down.isDown) {
			vy += 1
		}

		if (vx != 0 || vy != 0) {
			this.sprite.anims.play('propulse', true)
		} else {
			this.sprite.anims.play('giggle', true)
		}
		let force = new Phaser.Math.Vector2(vx, vy)
		this.sprite.applyForce(force.scale(this.thruster_speed * elapsed))
	}

	getClosestChunk(chunks) {
		let min_distance = null
		let closest_chunk = null
		for (const chunk of chunks) {
			const distance = this.distanceSquareBetweenCenterOfMasses(chunk)
			if (min_distance === null || min_distance > distance) {
				min_distance = distance
				closest_chunk = chunk
			}
		}
		return closest_chunk
	}

	update(scene, elapsed, chunks) {
		this.applyGravity(elapsed, chunks)
		this.applyThruster(scene, elapsed)
	}

	get x() {
		return this.sprite.x
	}

	get y() {
		return this.sprite.y
	}
}
