var _ = require('lodash');

var helpers = {
    _getHeight: function (grid, x, y) {
        return _.findWhere(grid, { x: x, y: y }).h;
    },
    _getSrcCell: function (level) {
        return {
            x: level.robot.x,
            y: level.robot.y,
            h: helpers._getHeight(level.grid, level.robot.x, level.robot.y)
        };
    },
    _getTargetCell: function (level) {
        var srcCell = helpers._getSrcCell(level);

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

        var schrodinCell;
        schrodinCell = _.findWhere(level.grid, { x: targetCell.x, y: targetCell.y });

        if (_.isUndefined(schrodinCell)) {
            return null; // cell not found
        } else {
            targetCell.h = schrodinCell.h;
            return targetCell;
        }
    }
};

module.exports = helpers;