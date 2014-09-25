// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-ce90a27
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2014-09-25 22:17:07Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Annotator.Plugin.TextAnchors = (function(_super) {
    __extends(TextAnchors, _super);

    function TextAnchors() {
      this.checkForEndSelection = __bind(this.checkForEndSelection, this);
      _ref = TextAnchors.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextAnchors.prototype.pluginInit = function() {
      var _this = this;
      if (!this.annotator.plugins.TextHighlights) {
        throw new Error("The TextAnchors Annotator plugin requires the TextHighlights plugin.");
      }
      this.Annotator = Annotator;
      this.$ = Annotator.$;
      $(document).bind({
        "mouseup": this.checkForEndSelection
      });
      this.annotator.subscribe("enableAnnotating", function(value) {
        if (value) {
          return setTimeout(_this.checkForEndSelection, 500);
        }
      });
      return null;
    };

    TextAnchors.prototype._getSelectedRanges = function() {
      var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
      selection = this.Annotator.util.getGlobal().getSelection();
      ranges = [];
      rangesToIgnore = [];
      if (!selection.isCollapsed) {
        ranges = (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = selection.rangeCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            r = selection.getRangeAt(i);
            browserRange = new this.Annotator.Range.BrowserRange(r);
            normedRange = browserRange.normalize().limit(this.annotator.wrapper[0]);
            if (normedRange === null) {
              rangesToIgnore.push(r);
            }
            _results.push(normedRange);
          }
          return _results;
        }).call(this);
        selection.removeAllRanges();
      }
      for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
        r = rangesToIgnore[_i];
        selection.addRange(r);
      }
      return this.$.grep(ranges, function(range) {
        if (range) {
          selection.addRange(range.toRange());
        }
        return range;
      });
    };

    TextAnchors.prototype.checkForEndSelection = function(event) {
      var container, pos, r, range, selectedRanges, _i, _j, _len, _len1;
      if (event == null) {
        event = {};
      }
      this.annotator.mouseIsDown = false;
      if (this.annotator.inAdderClick) {
        return;
      }
      selectedRanges = this._getSelectedRanges();
      for (_i = 0, _len = selectedRanges.length; _i < _len; _i++) {
        range = selectedRanges[_i];
        container = range.commonAncestor;
        if (this.Annotator.TextHighlight.isInstance(container)) {
          container = this.Annotator.TextHighlight.getIndependentParent(container);
        }
        if (this.annotator.isAnnotator(container)) {
          return;
        }
      }
      if (selectedRanges.length) {
        event.segments = [];
        for (_j = 0, _len1 = selectedRanges.length; _j < _len1; _j++) {
          r = selectedRanges[_j];
          event.segments.push({
            type: "text range",
            range: r
          });
        }
        if (!event.pageX) {
          pos = selectedRanges[0].getEndCoords();
          event.pageX = pos.x;
          event.pageY = pos.y;
        }
        return this.annotator.onSuccessfulSelection(event);
      } else {
        return this.annotator.onFailedSelection(event);
      }
    };

    return TextAnchors;

  })(Annotator.Plugin);

}).call(this);
