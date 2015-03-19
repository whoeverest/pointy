var level = {
    _width: 8,
    _length: 8,
    _height: 8,
    _maxFnLength: 12,
    _maxNumFn: 2,
    grid: [
        { x: 0, y: 0, h: 1, type: 'normal' },
        { x: 0, y: 1, h: 1, type: 'button', active: false },
        { x: 0, y: 2, h: 1, type: 'normal' },
        { x: 1, y: 2, h: 1, type: 'button', active: false }
    ],
    robot: {
        x: 1,
        y: 3,
        rotation: 0 // 90, 180, 270
    },
    functions: {
        main: {
            slots: 12,
            commands: ['fwd', 'main', 'f1']
        },
        f1: {
            slots: 8,
            commands: []
        }
    },
    currentCommand: {
        name: 'main',
        position: 0
    },
    running: true
};

var valid = {
    grid: function(g) {
        // has at least one button cell
        var hasButton = _.some(g, { 'type': 'button' });

        // no overlapping cells
        var counts = _.countBy(g, function(cell) {
            return cell.x.toString() + cell.y.toString();
        });

        var overlaps = _.size(counts) === _.size(g);

        if (!hasButton) {
            throw new Error('Missing button cell');
        }

        if (overlaps) {
            throw new Error('Overlapping cells');
        }

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
        console.log(r);

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
        var commands = ['fwd', 'left', 'right', 'jump', 'press'];
        
        var validCommand = _.includes(commands, cmd);
        var validFnCall = _.includes(fnNames, cmd);

        if (!validCommand && !validFnCall) {
            throw new Error('Invalid command name');
        }

        return true;
    },
    level: function(l) {
        // _width, _length, _height and _maxFnLenght, _maxNumFn are integers
        // all cells are valid
        // robot is valid
        // robot position can be found in cells
        // all functions are valid
        // only existing commands are referenced inside functions
        // current command is valid
        // running is true or false
    },
    currentCommand: function(cc) {
        // name can be found in functions
        // 0 <= position < function.length
    }
};
