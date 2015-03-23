var _ = require('lodash');
var helpers = require('./helpers.js');

function _cmdSuccess (level) {
    var newLevel = _.cloneDeep(level);
    newLevel.cmdSuccess = true;
    return newLevel;
}

function _cmdFail (level) {
    var newLevel = _.cloneDeep(level);
    newLevel.cmdSuccess = false;
    return newLevel;
}

var commands = {
    walk: function walk(level) {
        var srcCell = helpers._getSrcCell(level);
        var targetCell = helpers._getTargetCell(level);

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
        var srcCell = helpers._getSrcCell(level);
        var targetCell = helpers._getTargetCell(level);

        if (_.isNull(targetCell)) {
            return _cmdFail(level);
        }

        // you can only jump one level
        if (targetCell.h !== srcCell.h + 1 && targetCell.h !== srcCell.h - 1) {
            return _cmdFail(level); 
        }

        var newLevel = _.cloneDeep(level);

        newLevel.robot.x = targetCell.x;
        newLevel.robot.y = targetCell.y;

        return _cmdSuccess(newLevel);
    },
    press: function press(level) {
        var srcCell = helpers._getSrcCell(level);
        var button = _.findWhere(level.grid, { x: srcCell.x, y: srcCell.y, type: 'button' });

        if (!button) {
            return _cmdFail(level);
        }

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
        newLevel = _.cloneDeep(level);
        newLevel.running = false;
        
        newLevel.currentCommand = {
            fnName: 'main',
            position: 0
        };

        newLevel.robot.x = newLevel.robot.startingPosition.x;
        newLevel.robot.y = newLevel.robot.startingPosition.y;
        newLevel.robot.rotation = newLevel.robot.startingPosition.rotation;

        newLevel.grid = _.map(newLevel.grid, function(cell) {
            if (cell.type === 'button') {
                cell.active = false;
            }
            return cell;
        });

        console.log(newLevel);
        
        return newLevel;
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

function addCmd(level, cmdName, fnName) {
    if (level.running) {
        throw new Error("Can't add command while game is running");
    }

    var newLevel = _.cloneDeep(level);
    newLevel.functions[fnName].commands.push(cmdName);

    return newLevel;
}

function removeCmd(level, cmdPos, fnName) {
    var selectedFn = level.functions[fnName];

    if (level.running) {
        throw new Error("Can't add command while game is running");
    }

    if (!_.inRange(cmdPos, 0, _.size(selectedFn.commands))) {
        throw new Error('Invalid command index');
    }

    var newLevel = _.cloneDeep(level);
    newLevel.functions[fnName].commands.splice(cmdPos, 1); // todo: lodashy way to remove el?

    return newLevel;
}

function run(level) {
    if (level.running) {
        throw new Error('Already running');
    }

    var newLevel = _.cloneDeep(level);
    newLevel.running = true;

    return newLevel;
}

function stop(level) {
    if (!level.running) {
        throw new Error('Already stopped');
    }

    var newLevel = _.cloneDeep(level);
    newLevel.running = false;
    return newLevel;
}

// todo: at function end, return to where you were

module.exports = {
    commands: commands,
    step: step,
    addCmd: addCmd,
    removeCmd: removeCmd,
    run: run,
    stop: stop
};