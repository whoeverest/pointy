var Isomer = require('isomer');
var _ = require('lodash');

var valid = require('./validation.js');
var levels = require('./levels.js');
var game = require('./game.js');

var Point  = Isomer.Point;
var Path   = Isomer.Path;
var Shape  = Isomer.Shape;
var Vector = Isomer.Vector;
var Color  = Isomer.Color;

var level = levels.first;

console.log(game.walk(level));

var red = new Color(150, 0, 30);

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

function constructGridEls(grid) {
    var elements = [];

    var length = grid.length - 1;
    var width = grid[0].length - 1;
    for (var i = length; i >= 0; i--) {
        for (var j = width; j >= 0; j--) {
            var height = grid[i][j];

            for (var k = 0; k < height; k++) {
                elements.push(new Shape.Prism(new Point(i, j, k)));
            }
        }
    }

    return elements;
}

var iso = new Isomer(document.getElementById("canvas"));

var grid = [
    [0, 0, 1],
    [0, 1, 2],
    [1, 2, 3]
];

var p = new Pointy(Point.ORIGIN.translate(1, 2.25, 2));

iso.add(constructGridEls(grid));
iso.add(p.rotateZ(new Point(1.5, 2.5, 2), Math.PI), red);
iso.add(new Path([
    Point(2, 1, 2),
    Point(3, 1, 2),
    Point(3, 2, 2),
    Point(2, 2, 2)
]), new Color(250, 200, 170));

iso.add(new Path([
  Point(1, 1, 1),
  Point(2, 1, 1),
  Point(2, 2, 1),
  Point(1, 2, 1)
]), new Color(10, 10, 10));