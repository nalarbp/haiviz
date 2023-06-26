# Phylocanvas Scale-bar Plugin
Visual History for Phylocanvas.

## Usage
```
npm install phylocanvas phylocanvas-plugin-scalebar
```
```javascript
import Phylocanvas from 'phylocanvas';
import scalebarPlugin from 'phylocanvas-plugin-scalebar';

Phylocanvas.plugin(scalebarPlugin);

Phylocanvas.createTree('id', {
  // config defaults
  scalebar: {
    active: true,
    width: 100,
    height: 20,
    fillStyle: 'black',
    strokeStyle: 'black',
    lineWidth: 1,
    font: '16px Sans-serif',
    textBaseline: 'bottom',
    textAlign: 'center',
    digits: 2,
    position: {
      bottom: 10,
      left: 10,
    },
  }
})
```

## Options

A list of available options:
* `active`: Show the scale-bar. The default is `true`.
* `width`: The width of the scale-bar in pixels. The default is `100` pixels.
* `height`: The height of the scale-bar in pixels. The default is `20` pixels.
* `lineWidth`: The thickness of scale-bar lines in space units. The default is `1` pixel.
* `strokeStyle`: Specifies the colour or style to use for scale-bar lines. The default is `#000` (black).
* `fillStyle`: Specifies the colour or style to use for scale-bar label. The default is `#000` (black).
* `font`: Specifies the text style used when drawing scale-bar label. The default is `16px Sans-serif`.
* `digits`: The number of digits to appear after the decimal point; this may be a value between 0 and 20, inclusive. The default is `2` digits.
* `position`: Specifies the scale-bar position on the canvas. Two keys should be provided, one for the vertical position and one for the horizontal position. The default value is `{ bottom: 10, left: 10 }`.
  * Supported vertical position keys are `top`, `middle`, or `bottom`.
  * Supported horizontal position keys are `left`, `centre`, or `right`.
