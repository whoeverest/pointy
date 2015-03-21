var _ = require('lodash');

var valid = require('./validation.js');
var levels = require('./levels.js');
var game = require('./game.js');
var render = require('./render.js');

var state = levels.third;
render.level(state, document.getElementById("canvas"));

setInterval(function() {
    state = game.step(state);
    valid.level(state);
}, 500);

setInterval(function() {
    render.level(state, document.getElementById("canvas"));
}, 30);