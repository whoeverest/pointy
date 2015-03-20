var _ = require('lodash');

function _getSrcCell(level) {
    return {
        x: level.robot.x,
        y: level.robot.y,
        h: _.findWhere(level.grid, { x: level.robot.x, y: level.robot.y }).h
    };
}

function _getTargetCell(level) {
    var srcCell = _getSrcCell(level);

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
        return null; // cell not found
    } else {
        return targetCell;
    }
}

function walk(level) {
    var srcCell = _getSrcCell(level);
    var targetCell = _getTargetCell(level);

    if (_.isNull(targetCell)) {
        return false;
    }

    if (targetCell.h !== srcCell.h) {
        return false; // can't go when cells are not at the same height
    }

    var newLevel = _.cloneDeep(level);

    newLevel.robot.x = targetCell.x;
    newLevel.robot.y = targetCell.y;

    return newLevel;
}

function rotLeft(level) {
    var newLevel = _.cloneDeep(level);

    newLevel.robot.rotation += 90;

    if (newLevel.robot.rotation > 360) {
        newLevel.robot.rotation = 360 - newLevel.robot.rotation;
    }

    return newLevel;
}

function rotRight(level) {
    var newLevel = _.cloneDeep(level);

    newLevel.robot.rotation -= 90;

    if (newLevel.robot.rotation < 0) {
        newLevel.robot.rotation = 360 + newLevel.robot.rotation; // has negative value, so plus
    }

    return newLevel;
}

function jump(level) {
    var srcCell = _getSrcCell(level);
    var targetCell = _getTargetCell(level);

    if (_.isNull(targetCell)) {
        return false;
    }

    if (targetCell.h !== srcCell.h + 1) {
        return false; // you can only jump one level
    }

    var newLevel = _.cloneDeep(level);

    newLevel.robot.x = targetCell.x;
    newLevel.robot.y = targetCell.y;

    return newLevel;
}

function press(level) {
    var srcCell = _getSrcCell(level);
    var button = _.findWhere(level.grid, { x: srcCell.x, y: srcCell.y, type: 'button' });

    var newLevel = _.cloneDeep(level);
    var newB = _.findWhere(newLevel.grid, { x: button.x, y: button.y });

    if (button.active) {
        newB.active = false;
    } else {
        newB.active = true;
    }

    return newLevel;
}

module.exports = {
    walk: walk,
    rotLeft: rotLeft,
    rotRight: rotRight,
    jump: jump,
    press: press
};