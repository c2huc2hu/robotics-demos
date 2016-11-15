// == Application of Kalman Filtering ==
// A robot moves along one dimension with noise introduced in the control and in the sensing.
// The robot is regulated to the origin with a proportional controller.

// Noise is generated uniformly from [-r to r], where r can be chosen.

class RobotOneD {
	constructor(initialX, stateNoise, measurementNoise) {
		this.x = initialX;
		this.stateNoise = stateNoise;
		this.measurementNoise = measurementNoise;
	}

	update(control) {
		this.x += control + this.stateNoise();
	}

	measure() {
		return this.x + this.measurementNoise();
	}
}

class KalmanFilter extends RobotOneD {
	constructor(initialX, stateNoise, measurementNoise, varX, initialEstX) {
		super(initialX, stateNoise, measurementNoise);
		this.estimatedX = initialEstX || initialX;
		this.varX = varX;
	}

	updateEstimate(control, controlVariance) {
		// makes a priori estimate
		this.estimatedX += control + controlVariance;
		this.varX += controlVariance
	}

	refineEstimate(measurement, measurementVarance) {
		// a posteri estimate
		let kalmanGain = this.varX / (this.varX + measurementVarance);
		this.estimatedX += kalmanGain * (measurement - this.estimatedX);
		this.varX -= kalmanGain * measurementVarance;
		return this.estimatedX;
	}

	getStateEstimate() {
		return this.estimatedX;
	}
}