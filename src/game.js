var _ = require('lodash');

function walk(level) {
    // Executes "walk" command
    // Returns a new level state

    var srcCell = {
        x: level.robot.x,
        y: level.robot.y,
        h: _.findWhere(level.grid, { x: level.robot.x, y: level.robot.y }).h
    };

    var targetCell = {};

    if (level.robot.rotation === 0) {
        targetCell.x = srcCell.x + 1;
        targetCell.y = srcCell.y;
    } else if (level.robot.rotation === 90) {
        targetCell.x = srcCell.x;
        targetCell.y = srcCell.y + 1;
    } else if (level.robot.rotation === 180) {
        targetCell.x = srcCell.x - 1;
        targetCell.y = srcCell.y;
    } else {
        targetCell.x = srcCell.x;
        targetCell.y = srcCell.y - 1;
    }

    targetCell.h = _.findWhere(level.grid, { x: targetCell.x, y: targetCell.y }).h;

    if (_.isUndefined(targetCell.h)) {
        return false; // empty cell
    }

    if (targetCell.h !== srcCell.h) {
        return false; // can't go when cells are not at the same height
    }

    level.robot.x = targetCell.x;
    level.robot.y = targetCell.y;

    return level;
}

module.exports = {
    walk: walk
};