#!/bin/sh

if [ ! -d "./dist" ]; then
  mkdir dist
fi

browserify src/app.js -o bundle.js
cp bundle.js ./dist
cp index.html ./dist
cp style.css ./dist
