const EPSILON = 0.00001

export default class Robot {
	static preload(scene) {
		scene.load.image('robot', 'assets/robot.png')
		scene.load.json('robot-hitbox', 'assets/robot_hitbox.json')
	}

	constructor(scene, x, y) {
		this.sprite = scene.matter.add.sprite(x, y, 'robot', null, {
			shape: scene.cache.json.get('robot-hitbox')['robot'],
			ignorePointer: false,
		})
		this.sprite.setMass(1.0)
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
		this.sprite.setRotation(min_distance_direction.angle() - Math.PI / 2)
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
		let force = new Phaser.Math.Vector2(vx, vy)
		this.sprite.applyForce(force.scale(this.thruster_speed * elapsed))
	}

	update(scene, elapsed, chunks) {
		this.applyGravity(elapsed, chunks)
		this.applyThruster(scene, elapsed)
	}
}
