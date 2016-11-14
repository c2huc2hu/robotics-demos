

function isWalkable(x1, y1, x2, y2, walkabilityGraph) {
	if walkabilityGraph[x2][y2] === true
		return true
	else if walkabilityGraph[x2][y2] === undefined
		return false
	else
		return walkabilityGraph[x1][y1][x2-x1][y2-y1] === true
	}
}

function generateWalkabilityGraph(obstacles) {
	// If a cell is always walkable, cell is undefined.
	// If a cell is never walkable, cell is true
	// If a cell is conditionally walkable, contains a reference to an obstacle.
	walkabilityGraph = (new Array(10)).fill((new Array(10)).fill())

	// actually everything is okay except corners

	// non walkable areas
	for (let obstacle in obstacles) {
		for(let i=0; i<obstacle.length-1; i++) {
			obstacle[i].x =
			obstacle[i].y =
		}
	}
}