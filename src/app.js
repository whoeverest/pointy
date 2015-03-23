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
    'walk', 'rotLeft', 'rotRight', 'jump', 'press', 'main', 'f1'
]));

function renderFunctions() {
    console.log('rend fu');

    $('#container #functions').remove();
    $('#container').append(gui.template.functions(state.functions));

    $('#functions .slot-empty').on('dragover', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });

    $('#functions .slot-empty').on('dragenter', function(ev) {
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

function renderButton() {
    var $button = $('<button/>').attr('id', 'run-stop');

    $('#container #run-stop').remove();
    $('#container').append($button);

    if (state.running) {
        $button.removeClass('stopped').addClass('running').text('Stop!');
    } else {
        $button.removeClass('running').addClass('stopped').text('Run!');
    }

    $('#run-stop').click(function() {
        if (state.running) {
            state = game.stop(state);
        } else {
            state = game.run(state);
        }
        renderButton();
    });
}

renderFunctions();

setInterval(function() {
    if (state.running) {
        var newLevel = game.step(state);
        valid.level(state);
        state = newLevel; // if it throws it won't be reached
    }
    renderButton();
    render.level(state, document.getElementById('canvas'));
}, 500);

$('#controls .control').on('dragstart', function(ev) {
    ev.originalEvent.dataTransfer.setData("cmdName", ev.target.id);
});
