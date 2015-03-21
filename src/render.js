var Isomer = require('isomer');
var _ = require('lodash');

var Point  = Isomer.Point;
var Path   = Isomer.Path;
var Shape  = Isomer.Shape;
var Vector = Isomer.Vector;
var Color  = Isomer.Color;

var Pointy = function(origin, dx, dy, dz) {
    dx = (typeof dx === 'number') ? dx : 1;
    dy = (typeof dy === 'number') ? dy : 1;
    dz = (typeof dz === 'number') ? dz : 1;

    var pointy = new Shape();

    var bottom = new Path([
        origin,
        new Point(origin.x + dx, origin.y, origin.z),
        new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z)
    ]);

    var back = new Path([
        origin,
        new Point(origin.x + dx, origin.y, origin.z),
        new Point(origin.x + dx / 2, origin.y, origin.z + dz)
    ]);

    var left = new Path([
        origin,
        new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z),
        new Point(origin.x + dx / 2, origin.y, origin.z + dz)
    ]);

    var right = new Path([
        new Point(origin.x + dx, origin.y, origin.z),
        new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z),
        new Point(origin.x + dx / 2, origin.y, origin.z + dz)
    ]);

    pointy.push(bottom);
    pointy.push(back);
    pointy.push(left);
    pointy.push(right);

    return pointy;
};

// todo: inject canvas el

var render = {
    level: function(level, canvasEl) {
        var iso = new Isomer(canvasEl);
        var ctx = canvasEl.getContext('2d');

        iso.canvas.clear();

        render.background(ctx);
        render.grid(level.grid, iso);
        render.pointy(level.robot, iso);
    },
    background: function(ctx) {
        var gradient = ctx.createRadialGradient(400, 250, 350, 400, 250, 600);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "#eee");

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
    },
    grid: function(grid, iso) {
        var sorted = _.sortBy(grid, function(cell) {
            return -(cell.x * 100 + cell.y);
        });

        _.forEach(sorted, function(cell) {
            render.cell(cell, iso);

            if (cell.type === 'button') {
                render.button(cell, iso);
            }
        });
    },
    cell: function(cell, iso) {
        for (var h = 0; h < cell.h; h++) {
            iso.add(new Shape.Prism(new Point(cell.x, cell.y, h)));
        }
    },
    button: function(button, iso) {
        var color;

        if (button.active) {
            color = new Color(240, 240, 240);
        } else {
            color = new Color(10, 10, 10);
        }

        iso.add(new Path([
            Point(button.x,     button.y,     button.h),
            Point(button.x + 1, button.y,     button.h),
            Point(button.x + 1, button.y + 1, button.h),
            Point(button.x,     button.y + 1, button.h)
        ]), color);
    },
    pointy: function(pointy, iso) {
        var red = new Color(150, 0, 30);
        var p = new Pointy(Point.ORIGIN.translate(pointy.x, pointy.y, 1));
        iso.add(p, red);
    }
};

module.exports = render;