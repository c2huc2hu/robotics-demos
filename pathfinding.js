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

function getWalkable(x1, y1, x2, y2, obstacleList) {
	// check if the line from x1, y1 to x2, y2 has any collisions with the obstacleList.
	// this is slow, but it works
	return !obstacleList.some(function(line) {
		getLineIntersection(x1, y1, x2, y2, line.x1, line.y1, line.x2, line.y2);
	});
}

function dijkstra(grid, startX, startY) {
	let pq = new FastPriorityQueue((x, y) => x.dist < y.dist);
	pq.add({x: startX, y: startY, dist: 0});
	let visited = (new Array(35)).fill((new Array(35)).fill())
	visited[startX][startY] = true;
	let sqrt2 = 2 ** 0.5;
	let neighbours = [[0,1,1],[1,0,1],[-1,0,1],[0,-1,1],[-1,-1,sqrt2],[-1,1,sqrt2],[1,-1,sqrt2],[1,1,sqrt2]];

	while (!pq.isEmpty()) {
		let curCell = pq.poll()
		if(visited[curCell.x][curCell.y])
			continue
		visited[curCell.x][curCell.y] = true;

		for (let neigh in neighbours) {
			if (!visited[newX][newY]) {
				let newX = curCell.x + neigh[0];
				let newY = curCell.y + neigh[1];
				pq.add({x:newX, y:newY, dist:curCell.dist+neigh[2]});
			}
		}
	}
}