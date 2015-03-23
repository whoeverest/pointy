// todo: use handlebars or similar templating engine?
var $ = require('jquery');
var _ = require('lodash');

var template = {
    functions: function(functions) {
        var $containerEl = $('<div/>').attr('id', 'functions');

        _.forEach(functions, function(fn, fnName) {
            $containerEl.append(template.fn(fnName, fn));
        });

        return $containerEl;
    },
    fn: function(fnName, fnData) {
        var $containerEl = $('<div/>').addClass('function').attr('id', fnName);
        $containerEl.append($('<div/>').addClass('function-name').text(fnName));

        var numFns = _.size(fnData.commands);

        var $slotsEl = $('<div/>').addClass('slots');
        for (var i = 0; i < fnData.slots; i++) {
            var $slotEl = $('<div/>').addClass('slot');
            
            if (i < numFns) {
                $slotEl.text(fnData.commands[i]);
                $slotEl.addClass('slot-full');
                $slotEl.attr('draggable', 'true');
                $slotEl.attr('data-pos', i);
            } else {
                $slotEl.addClass('slot-empty');
            }

            $slotsEl.append($slotEl);
        }

        $containerEl.append($slotsEl);
        return $containerEl;
    },
    controls: function(controls) {
        var $containerEl = $('<div/>').attr('id', 'controls');

        _.forEach(controls, function(ctrl) {
            $containerEl.append(template.ctrl(ctrl));
        });

        return $containerEl;
    },
    ctrl: function(ctrl) {
        return $('<div/>').addClass('control')
            .attr('id', ctrl)
            .attr('draggable', 'true')
            .text(ctrl);
    }
};

module.exports = {
    template: template
};