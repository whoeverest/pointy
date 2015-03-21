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

    var schrodinCell;
    schrodinCell = _.findWhere(level.grid, { x: targetCell.x, y: targetCell.y });

    if (_.isUndefined(schrodinCell)) {
        return null; // cell not found
    } else {
        targetCell.h = schrodinCell.h;
        return targetCell;
    }
}

function _cmdSuccess(level) {
    var newLevel = _.cloneDeep(level);
    newLevel.cmdSuccess = true;
    return newLevel;
}

function _cmdFail(level) {
    var newLevel = _.cloneDeep(level);
    newLevel.cmdSuccess = false;
    return newLevel;
}

var commands = {
    walk: function walk(level) {
        var srcCell = _getSrcCell(level);
        var targetCell = _getTargetCell(level);

        if (_.isNull(targetCell)) {
            return _cmdFail(level);
        }

        if (targetCell.h !== srcCell.h) {
            return _cmdFail(level); // can't go when cells are not at the same height
        }

        var newLevel = _.cloneDeep(level);

        newLevel.robot.x = targetCell.x;
        newLevel.robot.y = targetCell.y;

        return _cmdSuccess(newLevel);
    },
    rotLeft: function rotLeft(level) {
        var newLevel = _.cloneDeep(level);

        newLevel.robot.rotation += 90;

        if (newLevel.robot.rotation >= 360) {
            newLevel.robot.rotation = 360 - newLevel.robot.rotation;
        }

        return _cmdSuccess(newLevel);
    },
    rotRight: function rotRight(level) {
        var newLevel = _.cloneDeep(level);

        newLevel.robot.rotation -= 90;

        if (newLevel.robot.rotation < 0) {
            newLevel.robot.rotation = 360 + newLevel.robot.rotation; // has negative value, so plus
        }

        return _cmdSuccess(newLevel);
    },
    jump: function jump(level) {
        var srcCell = _getSrcCell(level);
        var targetCell = _getTargetCell(level);

        if (_.isNull(targetCell)) {
            return _cmdFail(level);
        }

        if (targetCell.h !== srcCell.h + 1) {
            return _cmdFail(level); // you can only jump one level
        }

        // todo: jump one (or more) levels down

        var newLevel = _.cloneDeep(level);

        newLevel.robot.x = targetCell.x;
        newLevel.robot.y = targetCell.y;

        return _cmdSuccess(newLevel);
    },
    press: function press(level) {
        var srcCell = _getSrcCell(level);
        var button = _.findWhere(level.grid, { x: srcCell.x, y: srcCell.y, type: 'button' });

        var newLevel = _.cloneDeep(level);
        var newB = _.findWhere(newLevel.grid, { x: button.x, y: button.y });

        if (button.active) {
            newB.active = false;
        } else {
            newB.active = true;
        }

        return _cmdSuccess(newLevel);
    }
};

function step(level) {
    var newLevel;
    
    var fnName = level.currentCommand.fnName;
    var fnPos = level.currentCommand.position;
    var cmdName = level.functions[fnName].commands[fnPos];

    if (_.isUndefined(cmdName)) {
        // We got to the end of a function / empty slot
        return _cmdFail(level);
    }

    if (_.includes(_.keys(commands), cmdName)) {
        // execute and increment position
        newLevel = commands[cmdName](level);
        newLevel.currentCommand.position += 1;
    } else {
        // call to another function
        newLevel = _.cloneDeep(level);
        newLevel.currentCommand.fnName = cmdName;
        newLevel.currentCommand.position = 0;
    }

    return _cmdSuccess(newLevel);
}

module.exports = {
    commands: commands,
    step: step
};