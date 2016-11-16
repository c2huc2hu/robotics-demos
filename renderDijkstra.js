// specific to this case
let e = 0.0001 // epsilon to pull all the points in a bit
let obstacleList = [
	{x1: 10, y1: 4, x2: 12, y2: 4},
	{x1: 12, y1: 4, x2: 12, y2: 10},
	{x1: 12, y1: 10, x2: 6, y2: 10},
	{x1: 6, y1: 10, x2: 6, y2: 8},
	{x1: 6, y1: 8, x2: 10, y2: 4},
	{x1: 14, y1: 11, x2: 17, y2: 11},
	{x1: 17, y1: 11, x2: 17, y2: 15},
	{x1: 17, y1: 15, x2: 14, y2: 15},
	{x1: 14, y1: 15, x2: 14, y2: 11},
	{x1: 9, y1: 16, x2: 12, y2: 16},
	{x1: 12, y1: 16, x2: 12, y2: 20},
	{x1: 12, y1: 20, x2: 9, y2: 20},
	{x1: 9, y1: 20, x2: 9, y2: 16},
	{x1: 18, y1: 16, x2: 24, y2: 16},
	{x1: 24, y1: 16, x2: 24, y2: 19},
	{x1: 24, y1: 19, x2: 18, y2: 19},
	{x1: 18, y1: 19, x2: 18, y2: 16},
	{x1: 20, y1: 6, x2: 28, y2: 6},
	{x1: 28, y1: 6, x2: 28, y2: 19},
	{x1: 28, y1: 19, x2: 20, y2: 6},
	{x1: 12, y1: 25, x2: 25, y2: 25},
	{x1: 25, y1: 25, x2: 25, y2: 22},
	{x1: 25, y1: 22, x2: 28, y2: 22},
	{x1: 28, y1: 22, x2: 28, y2: 28},
	{x1: 28, y1: 28, x2: 12, y2: 28},
	{x1: 12, y1: 28, x2: 12, y2: 25},
]
let N = 35;
let grid;

function drawObstacles(ctx, obstacleList) {
	ctx.beginPath();
	for(let line of obstacleList) {
		ctx.moveTo(line.x1*10, line.y1*10);
		ctx.lineTo(line.x2*10, line.y2*10);
	}
	ctx.strokeStyle = 'navy';
	ctx.lineWidth = 1;
	ctx.stroke();
}

function drawPaths(ctx, grid) {
	ctx.beginPath();
	for(let i=0; i<=N; i++){
		for(let j=0; j<=N; j++){
			let parent = grid[i][j];
			if (parent.distance !== Infinity && !_.isUndefined(parent.parentX)) {
				ctx.moveTo(i*10, j*10);
				ctx.lineTo(parent.parentX*10, parent.parentY*10);
			}
		}
	}
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'dodgerblue';
	ctx.stroke();

    // start point
    ctx.beginPath();
    ctx.arc(2*10, 2*10, 5, 0, 2*Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'maroon';
    ctx.stroke();

    // end point
    ctx.beginPath();
    ctx.arc(32*10, 32*10, 5, 0, 2*Math.PI);
    ctx.strokeStyle = 'darkgreen';
    ctx.stroke();
}

function reset() {
	let algorithm = $('input[name=pathfinding-method]:checked').val()
	let canvas = $('#obstacle-map').get(0)
    let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	let grid;

	if (algorithm === 'A*')
		grid = astar(2,2,32,32,obstacleList,N,function(nextX, nextY, targetX, targetY){
			let dx = Math.abs(targetX - nextX), dy = Math.abs(targetY - nextY);
			return Math.sqrt(2) * Math.abs(dy - dx) + Math.min(dx, dy);
		})
	else if (algorithm === 'Dijkstra')
		grid = dijkstra(2,2,32,32,obstacleList,N)

	drawObstacles(ctx, obstacleList);
	drawPaths(ctx, grid);

	let pathLength = grid[32][32].dist;
	let nodesExplored = _.sum(grid.map(function(row) {
		return _.sumBy(row, function(x) {
			return +(x.dist !== Infinity);
		})
	}))

	// update output
	$('#output-panel').html(`
		Algorithm: ${algorithm} <br>
		Total Distance:  ${grid[32][32].dist.toFixed(5)} <br>
		Nodes Explored: ${nodesExplored}
	`)
}

$(function() {
	var ctx = $('#obstacle-map').get(0).getContext('2d');
	$('#reset').click(reset);
    reset();
})