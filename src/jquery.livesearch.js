(function($) {
  var legacyMode = false;  // Running with jQuery 1.7.x or older

  if (/^1\.[0-7]/.test($.fn.jquery)) {
    legacyMode = true;
  }

  if (!legacyMode) {
    $.expr[":"].containsi = $.expr.createPseudo(function(arg) {
      return function(elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
      };
    });
  } else {
    $.extend($.expr[':'], {
      'containsi': function(elem, i, match, array) {
        return $(elem).text().toLowerCase()
          .indexOf((match[3] || "").toLowerCase()) >= 0;
      }
    });
  }

  var Search = function(block) {
    this.callbacks = {};
    block(this);
  }

  Search.prototype.all = function(fn) { this.callbacks.all = fn; }
  Search.prototype.reset = function(fn) { this.callbacks.reset = fn; }
  Search.prototype.empty = function(fn) { this.callbacks.empty = fn; }
  Search.prototype.results = function(fn) { this.callbacks.results = fn; }

  function query(selector) {
    if (val = this.val()) {
      return $(selector).filter(':containsi("' + val + '")');
    } else {
      return false;
    }
  }

  $.fn.search = function search(selector, block) {
    var search = new Search(block);
    var callbacks = search.callbacks;

    function perform() {
      if (result = query.call($(this), selector)) {
        callbacks.all && callbacks.all.call(this, result);
        var method = result.size() > 0 ? 'results' : 'empty';
        return callbacks[method] && callbacks[method].call(this, result);
      } else {
        callbacks.all && callbacks.all.call(this, $(selector));
        return callbacks.reset && callbacks.reset.call(this);
      };
    }

    if (!legacyMode) {
      $(this).on('keyup blur', perform);
    } else {
      $(this).live('keyup blur', perform);
    }
  }
})(jQuery);
