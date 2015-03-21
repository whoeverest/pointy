var _ = require('lodash');

var valid = {
    grid: function(g) {
        // has at least one button cell
        var hasButton = _.some(g, { 'type': 'button' });

        // no overlapping cells
        var counts = _.countBy(g, function(cell) {
            return cell.x.toString() + cell.y.toString();
        });

        // if some key repeats twise, cells overlap
        var overlaps = _.size(counts) !== _.size(g);

        if (!hasButton) {
            throw new Error('Missing button cell');
        }

        if (overlaps) {
            throw new Error('Overlapping cells');
        }

        _.map(g.cells, valid.cell);

        return true;
    },
    cell: function(c) {
        // todo: remove hardcoded 8s
        var xOk = _.inRange(c.x, 0, 8);
        var yOk = _.inRange(c.y, 0, 8);
        var hOk = _.inRange(c.h, 0, 8);
        var typeOk = _.includes(['normal', 'button'], c.type);

        if (!xOk) {
            throw new Error('Cell "x" position is not in range');
        }

        if (!yOk) {
            throw new Error('Cell "y" position is not in range');
        }

        if (!hOk) {
            throw new Error('Cell height is not in range');
        }        

        if (!typeOk) {
            throw new Error('Invalid cell type');
        }

        // if type == button, active is true or false
        if (c.type === 'button' && !_.isBoolean(c.active)) {
            throw new Error('Missing or invalid "active" cell field');
        }

        return true;
    },
    robot: function(r) {
        // todo: remove hardcoded 8s
        var xOk = _.inRange(r.x, 0, 8);
        var yOk = _.inRange(r.y, 0, 8);
        var rotOk = _.includes([0, 90, 180, 270], r.rotation);

        if (!xOk) {
            throw new Error('Cell "x" position is not in range');
        }

        if (!yOk) {
            throw new Error('Cell "y" position is not in range');
        }

        if (!rotOk) {
            throw new Error('Invalid rotation value');
        }

        return true;
    },
    fn: function(f, fnNames) {
        var sizeOk = _.inRange(f.slots, 1, 13);

        if (!sizeOk) {
            throw new Error('Invalid number of slots in function');
        }

        var allFnsValid = _.all(_.map(f.commands, function(c) {
            return valid.command(c, fnNames);
        }));

        return allFnsValid;
    },
    command: function(cmd, fnNames) {
        var commands = ['walk', 'rotLeft', 'rotRight', 'jump', 'press'];
        
        var validCommand = _.includes(commands, cmd);
        var validFnCall = _.includes(fnNames, cmd);

        if (!validCommand && !validFnCall) {
            throw new Error('Invalid command name');
        }

        return true;
    },
    level: function(l) {
        if (!_.isNumber(l._width)) throw new Error('"_width" should be a Number');
        if (!_.isNumber(l._length)) throw new Error('"_length" should be a Number');
        if (!_.isNumber(l._height)) throw new Error('"_height" should be a Number');
        if (!_.isNumber(l._maxFnLength)) throw new Error('"_maxFnLength" should be a Number');
        if (!_.isNumber(l._maxNumFn)) throw new Error('"_maxNumFn" should be a Number');

        // if grid or robot is invalid, these functions will throw
        // so we're calling them for that side effect
        valid.grid(l.grid);
        valid.robot(l.robot);

        // robot position can be found in cells
        var robotPosInCells = _.findWhere(l.grid, { x: l.robot.x, y: l.robot.y });

        if (!robotPosInCells) {
            throw new Error('Robot coordinates don\'t represent a valid cell');
        }

        // calling for side effects
        var fnNames = _.keys(l.functions);
        _.forEach(l.functions, function(fn) {
            return valid.fn(fn, fnNames);
        });

        valid.currentCommand(l.currentCommand, l.functions);

        var runningIsBool = _.isBoolean(l.running);

        if (!runningIsBool) {
            throw new Error('"running" must be a boolean');
        }

        var cmdSuccess = _.isBoolean(l.cmdSuccess);

        if (!cmdSuccess) {
            throw new Error('"cmdFailed" must be a boolean');
        }

        // todo: number of functions <= _maxNumFn

        return true;
    },
    currentCommand: function(cc, functions) {
        // name can be found in functions
        // 0 <= position < function.length
        var fnNames = _.keys(functions);

        valid.command(cc.fnName, fnNames);

        if (_.includes(fnNames, cc.fnName)) {
            if (!_.inRange(cc.position, 0, _.size(functions[cc.fnName]) + 1)) {
                throw new Error('Current command position out of range');
            }
        }
    }
};

module.exports = valid;