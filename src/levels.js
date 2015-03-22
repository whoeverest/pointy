// First level:
// Three cells, walk two then press the button
var first = {
    _width: 8,
    _length: 8,
    _height: 8,
    _maxFnLength: 12,
    _maxNumFn: 1,
    grid: [
        { x: 0, y: 0, h: 1, type: 'normal' },
        { x: 1, y: 0, h: 1, type: 'normal' },
        { x: 2, y: 0, h: 1, type: 'button', active: false },
        { x: 2, y: 1, h: 1, type: 'normal' }
    ],
    robot: {
        x: 0,
        y: 0,

        // 0 == right
        // 90 == up
        // 180 == left
        // 270 == down
        rotation: 0
    },
    functions: {
        main: {
            slots: 3,
            commands: ['walk', 'walk', 'press']
        }
    },
    currentCommand: {
        fnName: 'main',
        position: 0
    },
    running: false,
    cmdSuccess: true
};

// Call a subroutine
var second = {
    _width: 8,
    _length: 8,
    _height: 8,
    _maxFnLength: 12,
    _maxNumFn: 2,
    grid: [
        { x: 0, y: 0, h: 1, type: 'normal' },
        { x: 1, y: 0, h: 1, type: 'normal' },
        { x: 2, y: 0, h: 1, type: 'button', active: false }
    ],
    robot: {
        x: 0,
        y: 0,

        // 0 == right
        // 90 == up
        // 180 == left
        // 270 == down
        rotation: 0
    },
    functions: {
        main: {
            slots: 4,
            commands: ['walk', 'walk', 'press', 'f1']
        },
        f1: {
            slots: 3,
            commands: ['rotLeft', 'rotLeft', 'main']
        }
    },
    currentCommand: {
        fnName: 'main',
        position: 0
    },
    running: false,
    cmdSuccess: true
};

var third = {
    _width: 8,
    _length: 8,
    _height: 8,
    _maxFnLength: 12,
    _maxNumFn: 2,
    grid: [
        { x: 0, y: 0, h: 1, type: 'normal' },
        { x: 1, y: 0, h: 1, type: 'normal' },
        { x: 2, y: 0, h: 1, type: 'button', active: false },
        { x: 2, y: 1, h: 1, type: 'normal' },
        { x: 2, y: 2, h: 1, type: 'button', active: false },
        { x: 1, y: 2, h: 2, type: 'normal' },
        { x: 0, y: 2, h: 1, type: 'button', active: false },
        { x: 0, y: 1, h: 1, type: 'normal' }
    ],
    robot: {
        x: 0,
        y: 0,

        // 0 == right
        // 90 == up
        // 180 == left
        // 270 == down
        rotation: 0
    },
    functions: {
        main: {
            slots: 12,
            commands: [
                'walk', 'walk', 'press', 'rotLeft',
                'walk', 'walk', 'press', 'rotLeft',
                'jump', 'jump', 'press', 'rotLeft',
                'walk', 'walk', 'rotLeft',
                'main'
            ]
        },
        f1: {
            slots: 12,
            commands: ['walk', 'rotLeft']
        }
    },
    currentCommand: {
        fnName: 'main',
        position: 0
    },
    running: false,
    cmdSuccess: true
};

module.exports = {
    first: first,
    second: second,
    third: third
};
