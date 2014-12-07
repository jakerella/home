/* Copyright (c) 2011 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Requires: jQuery 1.2+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * REVISIONS:
 *   0.1 Initial release
 *   
 */
;(function($) {
  
  $.fn.simpleSlideShow = function(o) {
    var n = this;
    if (n.length < 1) { return n; }
    
    o = (o)?o:{};
    o = auditOptions($.extend({}, $.fn.simpleSlideShow.defaults, o));
    
    n.append("<div id='simpleSlide_controls'>" +
    		"<a href='#' class='simpleSlide_prev'>&lt;&lt;</a>" +
    		"<a href='#' class='simpleSlide_source'>print</a>" +
    		" | <a href='#' id='showNotes'>notes</a>" +
    		" | <a href='#' id='slideSelector'>slides</a>" +
    		"<a href='#' class='simpleSlide_next'>&gt;&gt;</a>" +
    		"</div>" +
    		"<ul id='slideLinks'></ul>");
    
    var change = function(old, nw) {
      if (nw.length) {
        nw.find('.simpleSlide_wait').hide();
        if (old.hasClass('noTransition')) {
          old.hide();
          nw.show();
          var u = window.location.href.match(/(.+?)(?:#.+)/);
          u = (u)?u[1]:window.location.href;
          window.location.href = u+'#'+nw.attr('id');
        } else {
          old.fadeOut('fast', function() {
            nw.fadeIn('fast');
            var u = window.location.href.match(/(.+?)(?:#.+)/);
            u = (u)?u[1]:window.location.href;
            window.location.href = u+'#'+nw.attr('id');
          });
        }
        
        $('#slideCount').text("Slide "+nw.index()+" of "+n.find('.slide').length);
      }
    };
    var prev = function() {
      var old = $('.'+o.slideClass+':visible');
      var nw = old.prev('.'+o.slideClass);
      change(old, nw);
    };
    var next = function() {
      var old = $('.'+o.slideClass+':visible');
      var w = old.find('.simpleSlide_wait:hidden:first');
      if (w.length) {
        w.fadeIn();
        
      } else {
        var nw = old.next('.'+o.slideClass);
        change(old, nw);
      }
    };
    
    n.find('.simpleSlide_prev').click(function(e) { e.preventDefault(); prev(); });
    n.find('.simpleSlide_next').click(function(e) { e.preventDefault(); next(); });
    $('body').keyup(function(e) {
      if (key(e) == 39 || key(e) == 40) { next(); }
      if (key(e) == 37 || key(e) == 38) { prev(); }
    });
    
    n.find('.simpleSlide_source').click(function(e) {
      e.preventDefault();
      $('.'+o.slideClass).show();
      $('#simpleSlide_controls, .closeNotes, #header').hide();
      $('.slide, .simpleSlide_wait, .notes')
        .show()
        .filter('.slide')
          .css({'height': 'auto', 'width': 'auto'})
          .filter(':gt(0)')
            .prepend("<hr />")
            .end()
          .end()
        .filter('.notes')
          .prepend("<h3>Slide Notes</h3>")
          .css({'height': 'auto', 'width': 'auto'});
      $(document).find('link[rel=stylesheet]:not([media=print])').remove();
    });
    
    // show slide notes
    $('#showNotes').click(function(e) {
      e.preventDefault();
      var n = $('.notes:visible');
      if (n && n.length) {
        n.hide();
      } else {
        $('.notes').show();
      }
    });
    
    $('.notes').prepend("<a href='#' class='closeNotes'>X</a>");
    
    // hide slide notes
    $('body').on('click', '.closeNotes', function(e) {
      e.preventDefault();
      $('.notes').hide();
    });
    
    $('#slideSelector').click(function(e) {
      e.preventDefault();
      $('#slideLinks').toggle();
    });
    $('.slide').each(function() {
      $('#slideLinks').append("<li><a href='#"+$(this).attr('id')+"'>"+$(this).attr('id')+"</a></li>");
    });
    $('body').on('click', '#slideLinks a', function(e) {
      e.preventDefault();
      $('#slideLinks').hide();
      var old = $('.'+o.slideClass+':visible');
      var nw = $($(this).attr('href'));
      change(old, nw);
    });
    
    n.append("<div class='simpleSlide_footer'>"+o.slideFooter+"</div>");
    
    $('.'+o.slideClass)
      .hide()
      .find('.simpleSlide_wait')
        .hide();
    
    var cur = null;
    if (window.location.hash && $(window.location.hash).length) {
      cur = $(window.location.hash).show();
    } else {
      cur = $('.'+o.slideClass+':first').show();
    }
    $('#slideCount').text("Slide "+cur.index()+" of "+n.find('.slide').length);
    
    var resizeSlides = function() {
      n.height($(window).height()-70);
      $('.'+o.slideClass).height(n.height());
    };
    
    $(window).resize(resizeSlides);
    resizeSlides();
    
    if (o.timer && Number(o.timer) && o.timer > 0) {
      setupTimer(o.timer);
    }
    
    return n;  // Continue jQuery chain
  };
  
  var setupTimer = function(min) {
    
    var setTimer = function(tn, ms) {
      if (ms > 0) {
        var hr = Math.floor(ms / 3600000);
        ms -= hr * 3600000;
        var mn = Math.floor(ms / 60000);
        ms -= mn * 60000;
        var sc = Math.floor(ms / 1000);
        tn.text(((hr)?(hr+':'):'')+mn+':'+((sc > 9)?sc:('0'+sc)));
      } else {
        tn.text("0:00");
      }
    };
    
    var ms = min * 60 * 1000;
    var tn = $("<div id='presTimer' data-timeremain='"+ms+"'>" +
               "<span class='timerRemain'></span>" +
               "<a href='#' class='timerStart'>start</a>" +
               "<a href='#' class='timerStop'>stop</a>" +
               "</div>").appendTo('body');
    tn.find('.timerStop').hide();
    setTimer(tn.find('.timerRemain'), ms);
    
    var to = null;
    var iterate = function() {
      to = setTimeout(function() {
        var time = Number(tn.attr('data-timeremain'));
        time -= 1000;
        tn.attr('data-timeremain', time);
        setTimer(tn.find('.timerRemain'), time);
        
        if (time > 500) {
          iterate();
        }
      }, 1000);
    };
    
    tn.find('.timerStart').click(function(e) {
      e.preventDefault();
      iterate();
      $(this).hide().siblings('.timerStop').show();
    });
    
    tn.find('.timerStop').click(function(e) {
      e.preventDefault();
      clearTimeout(to);
      $(this).hide().siblings('.timerStart').show();
    });
  };
  
  var key = function(e) {
    return (e.keyCode)?e.keyCode:e.which;
  };
  
  var auditOptions = function(o) {
    if (typeof o.slideClass != 'string') { o.slideClass = $.fn.simpleSlideShow.defaults.slideClass; }
    if (typeof o.slideFooter != 'string') { o.slideFooter = $.fn.simpleSlideShow.defaults.slideFooter; }
    
    return o;
  };
  
  // options for simpleSlideShow instances...
  $.fn.simpleSlideShow.defaults = {
    slideClass: 'slide',      // the class on each of the slide panels
    slideFooter: '',          // content to be added to each slide
    timer: null               // To add a countdown timer to the lower left corner
  };
  
})(jQuery);