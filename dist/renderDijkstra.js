// specific to this case
let e = 0.0001 // epsilon to pull all the points in a bit
let obstacleList = [
	{x1: 11+e, y1: 11+e, x2: 13-e, y2: 11+e},
	{x1: 13-e, y1: 11+e, x2: 13-e, y2: 14-e},
	{x1: 13-e, y1: 14-e, x2: 11+e, y2: 12-e},
	{x1: 11+e, y1: 12-e, x2: 11+e, y2: 11+e},
	{x1: 9, y1: 0, x2: 4, y2: 9} // ...
]
let N = 35;
// let grid = dijkstra(2,2,32,32,obstacleList,N);
let grid = astar(2,2,32,32,obstacleList,N, function(nextX, nextY, targetX, targetY){
	let dx = Math.abs(targetX - nextX), dy = Math.abs(targetY - nextY);
	return Math.sqrt(2) * Math.abs(dy - dx) + Math.min(dx, dy);
})

function drawObstacles(ctx, obstacleList) {
	ctx.beginPath();
	for(let line of obstacleList) {
		ctx.moveTo(line.x1*10, line.y1*10);
		ctx.lineTo(line.x2*10, line.y2*10);
	}
	ctx.strokeStyle = '#0000ff';
	ctx.lineWidth = 3;
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
	ctx.strokeStyle = 'red';
	ctx.stroke();
	console.log('done drawing')
}

$(function() {
	var ctx = $('#obstacle-map').get(0).getContext('2d');
	drawObstacles(ctx, obstacleList);
	drawPaths(ctx, grid);
	console.log("done rendeirng")
})