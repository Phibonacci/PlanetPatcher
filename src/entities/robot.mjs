const EPSILON = 0.00001

export default class Robot {
	static preload(scene) {
		scene.load.image('robot', 'assets/robot.png')
	}

	constructor(scene, x, y) {
		this.sprite = scene.matter.add.sprite(x, y, 'robot', null, {
			mass: 1.0,
			ignorePointer: false,
		})
		this.thruster_speed = 0.0001
	}

	distanceSquareBetweenCenterOfMasses(other) {
		return Phaser.Math.Distance.BetweenPoints(
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
			const force = elapsed / 10000 * rmass * cmass / Math.max(100, distance)
			const force_on_direction = direction.normalize().scale(force)
			this.sprite.applyForce(force_on_direction)
		}
		this.sprite.setRotation(min_distance_direction.angle() - Math.PI / 2)
	}

	applyThruster(scene, elapsed) {
		let vx = 0
		if (scene.cursorKeys.left.isDown) {
			vx = -this.thruster_speed
		} else if (scene.cursorKeys.right.isDown) {
			vx = this.thruster_speed
		}
		let vy = 0
		if (scene.cursorKeys.up.isDown) {
			vy = -this.thruster_speed
		} else if (scene.cursorKeys.down.isDown) {
			vy = this.thruster_speed
		}
		let force = new Phaser.Math.Vector2(vx, vy)
		this.sprite.applyForce(force.scale(elapsed * 0.2))
	}

	update(scene, elapsed, chunks) {
		this.applyGravity(elapsed, chunks)
		this.applyThruster(scene, elapsed)
	}
}
