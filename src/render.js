var Isomer = require('isomer');
var _ = require('lodash');
var $ = require('jquery');

var helpers = require('./helpers.js');

var Point  = Isomer.Point;
var Path   = Isomer.Path;
var Shape  = Isomer.Shape;
var Vector = Isomer.Vector;
var Color  = Isomer.Color;

// todo: render light from top-left

var Pointy = function(origin) {
    // dx = (typeof dx === 'number') ? dx : 1;
    // dy = (typeof dy === 'number') ? dy : 1;
    // dz = (typeof dz === 'number') ? dz : 1;

    var pointy = new Shape();

    var padding = 0.1;

    // points
    var right = new Point(origin.x + padding, origin.y + padding, origin.z);
    var front = new Point(origin.x + 0.5, origin.y + 0.5, origin.z);
    var top = new Point(origin.x + padding, origin.y - (padding / 2) + 0.5, origin.z + 1);
    var left = new Point(origin.x + padding, origin.y - padding + 1, origin.z);

    // sides (paths, polygons)
    var bottomSide = new Path([right, front, left]);
    var backSide   = new Path([right, top, left]);
    var rightSide  = new Path([right, front, top]);
    var leftSide   = new Path([front, left, top]);

    pointy.push(bottomSide);
    pointy.push(backSide);
    pointy.push(rightSide);
    pointy.push(leftSide);

    return pointy;
};

var WireCell = function(origin) {
    return new Path([
        origin,
        new Point(origin.x + 1, origin.y, origin.z),
        new Point(origin.x + 1, origin.y + 1, origin.z),
        new Point(origin.x, origin.y + 1, origin.z)
    ]);
};

var render = {
    level: function(level, canvasEl) {
        var iso = new Isomer(canvasEl);
        var ctx = canvasEl.getContext('2d');

        iso.canvas.clear();

        // render.background(ctx);
        render.wireframe(iso);
        render.grid(level.grid, iso);
        render.pointy(level.robot, level.grid, iso);
    },
    background: function(ctx) {
        var gradient = ctx.createRadialGradient(400, 250, 350, 400, 250, 600);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "#eee");

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
    },
    wireframe: function(iso) {
        for (var x = -3; x < 6; x++) {
            for (var y = -3; y < 6; y++) {
                iso.add(new WireCell(new Point(x, y, 1)), new Color(200, 200, 200, 0));
            }
        }
    },
    grid: function(grid, iso) {
        var sorted = _.sortBy(grid, function(cell) {
            return -(cell.x * 100 + cell.y);
        });

        // todo: render pointy at the same time as the grid,
        // because ordering issues otherwise (pointy behind cell)

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
    pointy: function(pointy, grid, iso) {
        var red = new Color(150, 0, 30);

        var h = helpers._getHeight(grid, pointy.x, pointy.y);
        var positioned = new Pointy(Point.ORIGIN.translate(pointy.x, pointy.y, h));
        var rotPoint = new Point(pointy.x + 0.5, pointy.y + 0.5, 1);

        var rotRadians;
        if (pointy.rotation === 0) {
            rotRadians = 0;
        } else if (pointy.rotation === 90) {
            rotRadians = Math.PI / 2;
        } else if (pointy.rotation === 180) {
            rotRadians = Math.PI;
        } else {
            rotRadians = 3 * Math.PI / 2;
        }

        var rotated = positioned.rotateZ(rotPoint, rotRadians);

        iso.add(rotated, red);
    }
};

module.exports = render;
