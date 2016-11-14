// Modified version of http://stackoverflow.com/a/1968345/3080953 (detecting intersections between line segments)
// handle case when det is zero, don't return the intersection because we don't care
function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
	let s1_x = p1_x - p0_x; s1_y = p1_y - p0_y; s2_x = p3_x - p2_x; s2_y = p3_y - p2_y;
	let det = (-s2_x * s1_y + s1_x * s2_y);
	if (det == 0) return false;  // colinear
	let s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y)
	let t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	return 0 <= s && s <= 1 && t <= 0 && t <= 1;
}

function getWalkable(x1, y1, dx, dy, obstacleList, N) {
	// check if the line from x1, y1 to x2, y2 has any collisions with the obstacleList. N is the number of cells
	// this is slow, but it works
	if (!_.inRange(x1+dx, N) || !_.inRange(y1+dy, N))
		return false;
	return !obstacleList.some(function(line) {
		getLineIntersection(x1, y1, x1+dx, y1+dy, line.x1, line.y1, line.x2, line.y2);
	});
}

function dijkstra(startX, startY, obstacleList, N) {
	let pq = new FastPriorityQueue((x, y) => x.dist <= y.dist);
	pq.add({x: startX, y: startY, dist: 0});
	let distance = (new Array(35)).fill((new Array(35)).fill(Infinity));
	distance[startX][startY] = 0;

	const sqrt2 = 2 ** 0.5;
	let neighbours = [{"x":0,"y":1,"dist":1},{"x":1,"y":0,"dist":1},{"x":-1,"y":0,"dist":1},{"x":0,"y":-1,"dist":1},
		{"x":-1,"y":-1,"dist":sqrt2},{"x":-1,"y":1,"dist":sqrt2},{"x":1,"y":-1,"dist":sqrt2},{"x":1,"y":1,"dist":sqrt2}]

	while (!pq.isEmpty()) {
		let curCell = pq.poll()
		if(distance[curCell.x][curCell.y] !== Infinity && curCell.dist >= distance[curCell.x][curCell.y])
			continue // worse solution
		distance[curCell.x][curCell.y] = curCell.dist;

		for (let neigh in neighbours) {
			// do another check so we don't add more stuff than necessary to the queue,
			// also prevents us from re-adding the parent
			if (curCell.dist+neigh.dist < distance[curCell.x][curCell.y] && getWalkable(curCell.x, curCell.y, neigh.x, neigh.y, obstacleList, N)) {
				pq.add({x:curCell.x + neigh.x, y:curCell.y + neighY, dist:curCell.dist+neigh.dist});
			}
		}
	}
}

