var level = {
    _width: 8,
    _length: 8,
    _height: 8,
    _maxFnLength: 12,
    _maxNumFn: 2,
    grid: [
        { x: 0, y: 0, h: 1, type: 'normal' },
        { x: 0, y: 1, h: 1, type: 'button', active: true },
        { x: 0, y: 2, h: 1, type: 'normal' },
        { x: 1, y: 2, h: 1, type: 'end' }
    ],
    robot: {
        position: { x: 1, y: 3 },
        rotation: 0 // 90, 180, 270
    },
    functions: {
        main: {
            length: 12,
            commands: [
                { name: 'fwd' }
            ]
        },
        f1: {
            length: 8,
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
        // no overlapping cells
        // has exactly one 'end' cell
    },
    cell: function(c) {
        // 0 <= x <= _width
        // 0 <= y <= _length
        // 0 <= h <= _height
        // type is one of: 'normal', 'button', 'end'
        // if type == button, active is true or false
    },
    robot: function(r) {
        // 0 <= x <= _width
        // 0 <= y <= _length
        // rotation is one of: [0, 90, 180, 270]
    },
    fn: function(f) {
        // 1 <= length <= max length
        // all commands are valid
    },
    command: function(cmd) {
        // name is one of: 'fwd', 'left', 'right', 'jump', 'press' or FN
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