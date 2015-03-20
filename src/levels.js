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
            slots: 3,
            commands: []
        }
    },
    currentCommand: {
        name: 'main',
        position: 0
    },
    running: false
};

module.exports = {
	first: first
};