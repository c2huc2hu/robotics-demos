// Modified version of http://stackoverflow.com/a/1968345/3080953 (detecting intersections between line segments)
// handle case when det is zero, also don't return the intersection because we don't care
function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
	let s1_x = p1_x - p0_x; s1_y = p1_y - p0_y; s2_x = p3_x - p2_x; s2_y = p3_y - p2_y;
	let det = (-s2_x * s1_y + s1_x * s2_y);
	if (det === 0) return false;  // colinear
	let s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / det;
	let t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / det;
	return 0 <= s && s <= 1 && 0 <= t && t <= 1;
}

function getWalkable(x1, y1, dx, dy, obstacleList, N) {
	// check if the line from x1, y1 to x2, y2 has any collisions with the obstacleList. N is the number of cells
	// this is slow, but it works
	if (!_.inRange(x1+dx, N) || !_.inRange(y1+dy, N))
		return false;
	return !obstacleList.some(function(line) {
		return getLineIntersection(x1, y1, x1+dx, y1+dy, line.x1, line.y1, line.x2, line.y2);
	});
}

function dijkstra(startX, startY, targetX, targetY, obstacleList, N) {
	console.log('starting dijkstra')
	let pq = new FastPriorityQueue((x, y) => x.dist <= y.dist);
	pq.add({x: startX, y: startY, dist: 0});
	let result = new Array(N);
	for(let i=0; i<=N; i++){
		result[i] = new Array(N);
		for (let j=0; j<=N; j++) {
			result[i][j] = new Object({distance: Infinity, parentX: undefined, parentY: undefined})
		}
	};
	result[startX][startY].distance = 1;

	const sqrt2 = 2 ** 0.5;
	let neighbours = [{x:0,y:1,dist:1},{x:1,y:0,dist:1},{x:-1,y:0,dist:1},{x:0,y:-1,dist:1},
		{x:-1,y:-1,dist:sqrt2},{x:-1,y:1,dist:sqrt2},{x:1,y:-1,dist:sqrt2},{x:1,y:1,dist:sqrt2}]

	while (!pq.isEmpty()) {
		let curCell = pq.poll()
		if(curCell.x === targetX && curCell.y === targetY)
			return result; // found optimal path
		if(curCell.dist >= result[curCell.x][curCell.y].distance) {
			continue; // worse candidate than what we currently have
		}
		result[curCell.x][curCell.y].distance = curCell.dist;
		result[curCell.x][curCell.y].parentX = curCell.parentX;
		result[curCell.x][curCell.y].parentY = curCell.parentY;

		for (let neigh of neighbours) {
			// do another check so we don't add more stuff than necessary to the queue,
			// also prevents us from re-adding the parent
			if (getWalkable(curCell.x, curCell.y, neigh.x, neigh.y, obstacleList, N) &&
				curCell.dist+neigh.dist < result[curCell.x+neigh.x][curCell.y+neigh.y].distance)
			{
				pq.add({x:curCell.x+neigh.x, y:curCell.y+neigh.y, dist:curCell.dist+neigh.dist, parentX: curCell.x, parentY: curCell.y});
			}
		}
	}

	return false; // no path exists
}