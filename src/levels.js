var first = {
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
        x: 0,
        y: 0,
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

module.exports = {
	first: first
};