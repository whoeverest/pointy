{
    functions: function(functions, $fnsContEl) {
        _.forEach(functions, function(fn, fnName) {
            $fnsContEl.append(render.fn(fnName, fn));
        });
    },
    fn: function(fnName, fn) {
        var $fnContEl = $('<div/>').addClass('function').attr('id', fnName);
        $fnContEl.append($('<div/>').addClass('function-name').text(fnName));

        var numFns = _.size(fn.commands);

        var $slotsEl = $('<div/>').addClass('slots');
        for (var i = 0; i < fn.slots; i++) {
            var $slotEl = $('<div/>').addClass('slot');
            
            if (i < numFns) {
                $slotEl.text(fn.commands[i]);
            } else {
                $slotEl.addClass('slot-disabled');
            }

            $slotsEl.append($slotEl);
        }

        $fnContEl.append($slotsEl);
        return $fnContEl;
    }
}