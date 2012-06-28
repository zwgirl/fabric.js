(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      parentSet = fabric.Object.prototype.set,
      coordProps = { 'x1': 1, 'x2': 1, 'y1': 1, 'y2': 1 };

  if (fabric.Line) {
    fabric.warn('fabric.Line is already defined');
    return;
  }

  /**
   * @class Line
   * @extends fabric.Object
   */
  fabric.Line = fabric.util.createClass(fabric.Object, /** @scope fabric.Line.prototype */ {

    /**
     * @property
     * @type String
     */
    type: 'line',

    /**
     * Constructor
     * @method initialize
     * @param {Array} points Array of points
     * @param {Object} [options] Options object
     * @return {fabric.Line} thisArg
     */
    initialize: function(points, options) {
      if (!points) {
        points = [0, 0, 0, 0];
      }

      this.callSuper('initialize', options);

      this.set('x1', points[0]);
      this.set('y1', points[1]);
      this.set('x2', points[2]);
      this.set('y2', points[3]);

      this._setWidthHeight(options);
    },

    _setWidthHeight: function(options) {
      options || (options = { });

      this.set('width', (this.x2 - this.x1) || 1);
      this.set('height', (this.y2 - this.y1) || 1);

      this.set('left', 'left' in options ? options.left : (this.x1 + this.width / 2));
      this.set('top', 'top' in options ? options.top : (this.y1 + this.height / 2));
    },

    set: function(name, value) {
      parentSet.call(this, name, value);
      if (name in coordProps) {
        this._setWidthHeight();
      }
      return this;
    },

    /**
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();

      // move from center (of virtual box) to its left/top corner
      ctx.moveTo(this.width === 1 ? 0 : (-this.width / 2), this.height === 1 ? 0 : (-this.height / 2));
      ctx.lineTo(this.width === 1 ? 0 : (this.width / 2), this.height === 1 ? 0 : (this.height / 2));

      ctx.lineWidth = this.strokeWidth;

      // TODO: test this
      // make sure setting "fill" changes color of a line
      // (by copying fillStyle to strokeStyle, since line is stroked, not filled)
      var origStrokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
      ctx.strokeStyle = origStrokeStyle;
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    },

    /**
     * Returns object representation of an instance
     * @methd toObject
     * @return {Object}
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    },

    /**
     * Returns svg representation of an instance
     * @method toSVG
     * @return {string} svg representation of an instance
     */
    toSVG: function() {
      return [
        '<line ',
          'x1="', this.get('x1'), '" ',
          'y1="', this.get('y1'), '" ',
          'x2="', this.get('x2'), '" ',
          'y2="', this.get('y2'), '" ',
          'style="', this.getSvgStyles(), '" ',
        '/>'
      ].join('');
    }
  });

  /**
   * List of attribute names to account for when parsing SVG element (used by `fabric.Line.fromElement`)
   * @static
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */
  fabric.Line.ATTRIBUTE_NAMES = 'x1 y1 x2 y2 stroke stroke-width transform'.split(' ');

  /**
   * Returns fabric.Line instance from an SVG element
   * @static
   * @method fabric.Line.fromElement
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @return {fabric.Line} instance of fabric.Line
   */
  fabric.Line.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Line.ATTRIBUTE_NAMES);
    var points = [
      parsedAttributes.x1 || 0,
      parsedAttributes.y1 || 0,
      parsedAttributes.x2 || 0,
      parsedAttributes.y2 || 0
    ];
    return new fabric.Line(points, extend(parsedAttributes, options));
  };

  /**
   * Returns fabric.Line instance from an object representation
   * @static
   * @method fabric.Line.fromObject
   * @param {Object} object Object to create an instance from
   * @return {fabric.Line} instance of fabric.Line
   */
  fabric.Line.fromObject = function(object) {
    var points = [object.x1, object.y1, object.x2, object.y2];
    return new fabric.Line(points, object);
  };

})(typeof exports != 'undefined' ? exports : this);