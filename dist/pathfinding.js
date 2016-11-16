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

function getWalkable(x1, y1, x2, y2, obstacleList, N) {
	// check if the line from x1, y1 to x2, y2 has any collisions with the obstacleList. N is the number of cells
	// this is slow, but it works
	if (!_.inRange(x2, N) || !_.inRange(y2, N))
		return false;
	return !obstacleList.some(function(line) {
		return getLineIntersection(x1, y1, x2, y2, line.x1, line.y1, line.x2, line.y2);
	});
}

// a* is just an extension of dijkstra.
function dijkstra(startX, startY, targetX, targetY, obstacleList, N) {
	return astar(startX, startY, targetX, targetY, obstacleList, N, ()=>0);
}

function astar(startX, startY, targetX, targetY, obstacleList, N, heuristic) {
	let pq = new FastPriorityQueue((x, y) => x.estDist <= y.estDist);
	let result = new Array(N);
	const sqrt2 = 2 ** 0.5;
	let neighbours = [{x:0,y:1,dist:1},{x:1,y:0,dist:1},{x:-1,y:0,dist:1},{x:0,y:-1,dist:1},
		{x:-1,y:-1,dist:sqrt2},{x:-1,y:1,dist:sqrt2},{x:1,y:-1,dist:sqrt2},{x:1,y:1,dist:sqrt2}]

	pq.add({x: startX, y: startY, dist: 0, estDist: 0});
	for(let i=0; i<=N; i++){
		result[i] = new Array(N);
		for (let j=0; j<=N; j++) {
			result[i][j] = new Object({dist: Infinity, parentX: undefined, parentY: undefined})
		}
	};
	result[startX][startY].dist = 1; // non-zero to get the algorithm started

	while (!pq.isEmpty()) {
		let curCell = pq.poll()
		if(curCell.dist >= result[curCell.x][curCell.y].dist) {
			continue; // worse candidate than what we currently have
		}
		result[curCell.x][curCell.y].dist = curCell.dist;
		result[curCell.x][curCell.y].parentX = curCell.parentX;
		result[curCell.x][curCell.y].parentY = curCell.parentY;

		if(curCell.x === targetX && curCell.y === targetY){
			return result; // found optimal path
		}

		for (let neigh of neighbours) {
			// do another check so we don't add more stuff than necessary to the queue,
			// also prevents us from re-adding the parent
			let nextX = curCell.x + neigh.x;
			let nextY = curCell.y + neigh.y;

			if (getWalkable(curCell.x, curCell.y, nextX, nextY, obstacleList, N) &&
				curCell.dist+neigh.dist < result[nextX][nextY].dist)
			{
				pq.add({
					x: nextX,
					y: nextY,
					dist: curCell.dist + neigh.dist,
					estDist: heuristic(nextX, nextY, targetX, targetY) + curCell.dist + neigh.dist,
					parentX: curCell.x,
					parentY: curCell.y
				});
			}
		}
	}

	return false; // no path exists
}