
var _ = require('lodash');

var valid = require('./validation.js');
var levels = require('./levels.js');
var game = require('./game.js');
var render = require('./render.js');

var state = levels.third;
render.level(state, document.getElementById("canvas"));

setInterval(function() {
    state = game.step(state);
    render.level(state, document.getElementById("canvas"));
    valid.level(state);

    // console.log(state.currentCommand);
}, 500);