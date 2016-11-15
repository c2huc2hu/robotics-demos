// main code for Kalman filtering
$(function() {
	let robot, interval, graphCtx, chart, baseline;
	let history = [];
	let inputNoise = 0; // r in the problem
	let feedbackGain = 0.1; // K in the problem
	let usingKF = false; // whether to use Kalman filtering

	function genUniformNoise() {
		return (Math.random() * 2 - 1) * inputNoise;
	}

	// returns unbiased sampled standard deviation
	function stdevp(arr) {
		let mean = _.mean(arr);
		return Math.sqrt(_.sumBy(arr, function(x) {
			return (x - mean) ** 2
		}) / (arr.length - 1));
	}

	function updateRobot() {
		// update the robot's position
		let measurement = robot.measure();
		let control = -feedbackGain * ((usingKF ? robot.getStateEstimate() : measurement) - 0);
		let noiseVariance = feedbackGain ** 2 / 3; // variance of a uniform random variable
		robot.update(control);

		// update our estimate of the robot's position
		robot.updateEstimate(control, noiseVariance);
		robot.refineEstimate(measurement, noiseVariance);

		return {x: robot.x, estimatedX: robot.estimatedX}
	}
	function updateGraph() {
		window.clearInterval(interval);
		if (chart)
			chart.destroy();
		chart = new Chart(graphCtx, {
			type: 'scatter',
			data: {
				labels: _.range(history.length),
				datasets: [
					{
						label: "Actual Position",
						data: history.map(function(elem, i) {
							return {x: i, y: elem.x}
						}),
						fill: false,
						lineTension: 0,
						borderColor: 'red',
						backgroundColor: 'pink'
					},
					{
						label: "Estimated Position",
						data: history.map(function(elem, i) {
							return {x: i, y: elem.estimatedX}
						}),
						fill: false,
						lineTension: 0,
						borderColor: 'green',
						backgroundColor: 'lightgreen'
					}
				]
			},
			options: {
				maintainAspectRatio: false
			}
		})
	}

	function reset() {
		robot = new KalmanFilter(100, genUniformNoise, genUniformNoise, 0);
		inputNoise = parseFloat($('#noise').val())
		usingKF = $('#toggle-kf').prop('checked');
		history = [{x: robot.x, estimatedX: robot.estimatedX}];
		for(let i=0; i<100; i++) {
			history.push(updateRobot());
		}
		if (baseline === undefined)  // store the first run, i.e. zero noise, as the default settings
			baseline = history

		// update output
		updateGraph();
		let stdev = stdevp(_.zipWith(history, baseline, function(hist,baseline) {
			return hist.x - baseline.x;
		}));
		$('#output-panel').html(`
			Noise: ${inputNoise} <br>
			Kalman Filter: ${usingKF ? 'Enabled' : 'Disabled'} <br>
			Standard Deviation from Baseline: ${stdev.toFixed(5)}
		`);
	}

	$('#reset').click(function(e) {
		reset();
	});

	graphCtx = $('#graph').get(0).getContext('2d');
	reset();
})
