var _ = require('lodash');
var $ = require('jquery');

var valid = require('./validation.js');
var levels = require('./levels.js');
var game = require('./game.js');
var render = require('./render.js');
var gui = require('./gui.js');

var state = levels.third;
render.level(state, document.getElementById('canvas'));

$('#container').append(gui.template.controls([
    'forward', 'rotLeft', 'rotRight', 'jump', 'press'
]));

function renderFunctions() {
    $('#container #functions').remove();
    $('#container').append(gui.template.functions(state.functions));

    $('#f1 .slot-empty').on('dragover', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });

    $('#f1 .slot-empty').on('dragenter', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });

    $('#functions .slot-empty').on('drop', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var cmdName = ev.originalEvent.dataTransfer.getData("cmdName");
        var fnName = $(this).parent().parent().attr('id');

        state = game.addCmd(state, cmdName, fnName);
        
        renderFunctions();
    });

    $('#functions .slot-full').on('click', function(ev) {
        var fnName = $(this).parent().parent().attr('id');
        var cmdPos = $(this).attr('data-pos');

        state = game.removeCmd(state, cmdPos, fnName);

        renderFunctions();
    });
}

renderFunctions();

setInterval(function() {
    state = game.step(state);
    render.level(state, document.getElementById('canvas'));
    valid.level(state);
}, 2000);


// drag'n'drop to add command


$('#controls .control').on('dragstart', function(ev) {
    ev.originalEvent.dataTransfer.setData("cmdName", ev.target.id);
});
