var _ = require('lodash');

function walk(level) {
	// Executes "walk" command
	// Returns a new level state

	var srcCell = {
		x: level.robot.x,
		y: level.robot.y,
		h: level.grid
};

module.exports = {
	walk: walk
};