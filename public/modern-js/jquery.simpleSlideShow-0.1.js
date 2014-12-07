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
    
    if (window.location.search && /(\?|^)sc\=true(\&|$)/.test(window.location.search)) {
      $.fn.simpleSlideShow.setupConsole(n);
      return n;
    }

    o = (o)?o:{};
    o = auditOptions($.extend({}, $.fn.simpleSlideShow.defaults, o));
    
    var bd = $('body');

    // cover everything until we're done setting up
    bd.append("<div id='simpelSlide_initCover' style='height:100%;width:100%;overflow:hidden;background-color:#fff;' />");

    n.append("<div id='simpleSlide_controls'>" +
        "<a href='#' class='simpleSlide_prev'>&lt;&lt;</a>" +
        "<a href='#' class='simpleSlide_source'>print</a>" +
        " | <a href='#' id='showNotes'>notes</a>" +
        " | <a href='#' id='slideSelector'>slides</a>" +
        "<a href='#' class='simpleSlide_next'>&gt;&gt;</a>" +
        "</div>" +
        "<ul id='slideLinks'></ul>");
    
    var sc = null;
    $(window).keyup(function(e) {
      if (e.shiftKey && e.ctrlKey && e.which == 83) {
        e.preventDefault();
        var l = window.location.origin + window.location.pathname+'?sc=true';
        if (window.location.search && window.location.search.length) {
          l += '&'+window.location.search.substr(1);
        }
        if (window.location.hash && window.location.hash.length) {
          l += '&'+window.location.hash;
        }
        sc = window.open(l, "height=600,width=900,location=no,resizable=yes,status=no");
      }
    });

    var slides = n.find('.'+o.slideClass);

    var change = function(old, nw) {
      if (nw.length) {
        nw.find('.simpleSlide_wait').hide();
        if (old) {
          if (old.hasClass('noTransition')) {
            old.hide();
            nw.show();
            changeHash(nw);
          } else {
            old.fadeOut('fast', function() {
              nw.fadeIn('fast');
              changeHash(nw);
            });
          }
        } else {
          nw.show();
          changeHash(nw);
        }
        
        $('#slideCount').text("Slide "+nw.index()+" of "+slides.length);

        if (sc) {
          sc.$('#'+n.attr('id')).trigger('change.simpleSlide', nw);
        }
      }
    };
    var changeHash = function(nw) {
      var u = window.location.href.match(/(.+?)(?:#.+)/);
      u = (u)?u[1]:window.location.href;
      window.location.href = u+'#'+nw.attr('id');
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

    var changeSize = function(amt) {
      var fs = parseInt(bd.css('font-size'));
      bd.css('font-size', (fs+amt)+'px');
    };

    
    n.find('.simpleSlide_prev').click(function(e) { e.preventDefault(); prev(); return false; });
    n.find('.simpleSlide_next').click(function(e) { e.preventDefault(); next(); return false; });
    bd.on('keyup', function(e) {
      if (e.ctrlKey && e.which == 38) { changeSize(1); return true; }
      if (e.ctrlKey && e.which == 40) { changeSize(-1); return true; }
      if (e.which == 39 || e.which == 40) { next(); }
      if (e.which == 37 || e.which == 38) { prev(); }
    });
    
    n.find('.simpleSlide_source').click(function(e) {
      e.preventDefault();
      $('.'+o.slideClass).show();
      $('#simpleSlide_controls, .closeNotes, #header').hide();
      slides.add('.simpleSlide_wait, .notes', n)
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
    var nts = $('.notes');
    $('#showNotes').click(function(e) {
      e.preventDefault();
      if (nts.filter(':visible').length) {
        nts.hide();
      } else {
        nts.show();
      }
    });
    
    $('.notes').prepend("<a href='#' class='closeNotes'>X</a>");
    
    // hide slide notes
    bd.on('click', '.closeNotes', function(e) {
      e.preventDefault();
      $('.notes').hide();
    });
    
    $('#slideSelector').click(function(e) {
      e.preventDefault();
      $('#slideLinks').toggle();
    });
    slides.each(function() {
      $('#slideLinks').append("<li><a href='#"+$(this).attr('id')+"'>"+$(this).attr('id')+"</a></li>");
    });
    bd.on('click', '#slideLinks a', function(e) {
      e.preventDefault();
      $('#slideLinks').hide();
      var old = slides.filter(':visible');
      var nw = $($(this).attr('href'));
      change(old, nw);
    });
    
    n.append("<div class='simpleSlide_footer'>"+o.slideFooter+"</div>");
    
    var resizeSlides = function() {
      // Tweak size of things for smaller screens
      var mw = 1300, mh = 650; // full screen desktop minimum
      var w = $(window).width(), h = $(window).height();
      r = 1;
      if (w < mw || h < mh) {
        r = Math.min((w / mw), (h / mh));
        $('#slideCount').css('font-size', ((r * 100) / 1.3)+'%');
      }
      $('#simpleSlide_controls, .simpleSlide_footer').css(
        'bottom', 
        parseInt($('#simpleSlide_controls').css('bottom')) * r
      );
      $('#header').css(
        'top', 
        parseInt($('#header').css('top')) * r
      );

      n.height($(window).height()-(70 * r));
      slides.height(n.height());
    };
    
    $(window).resize(resizeSlides);
    resizeSlides();
    
    if (o.timer && Number(o.timer) && o.timer > 0) {
      setupTimer(o.timer);
    }


    // Various CSS maneuvers

    $('.simpleSlide_centerBlock').each(function() {
      var t = $(this).css('display', 'inline-block');
      var pw = t.parent().width();
      t.css({
        position: 'relative',
        left: ((pw - t.width()) / 2)+'px'
      });
    });

    slides.not(".imgOnly").each(function() {
      var t = $(this)
                // determine where to put the vertical centering div
                .find("h2 ~ *:not(.subTitle):first, :not(h2, h2 *, .subTitle, .subTitle *):first")
                  .before("<div class='simpleSlide_vertCenter'>")
                  .end()
                .find(".simpleSlide_vertCenter")
                  // put all slide content (not notes or titles) in the centering div
                  .append($(this).children().not("h2, .subTitle, .notes"));

      var od = t.css('display');
      t.css('display', 'inline-block');
      var ph = t.parent().height();
      t.css({
        position: 'relative',
        top: (((ph - t.height()) / 2) - (ph * 0.05))+'px', // -5% cuz otherwise it looks low
        display: od
      });
    });

    // Hide slides and waits
    slides
      .hide()
      .find('.simpleSlide_wait')
        .hide();

    // Show initial slide (or selected slide based on URL hash)
    var cur = null;
    if (window.location.hash && $(window.location.hash).length) {
      cur = $(window.location.hash); //.show();
    } else {
      cur = slides.filter(':first'); //.show();
    }
    change(null, cur);
    $('#slideCount').text("Slide "+cur.index()+" of "+slides.length);

    // remove our initial setup cover
    $('#simpelSlide_initCover').remove();
    
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


  // Speaker Console
  $.fn.simpleSlideShow.setupConsole = function(n) {
    var slides = n.hide().find('.slide');
    
    var now = new Date();
    n.after(
      "<div id='simpleSlide_speakerConsole'>"+
        "<div id='sssc_slideBlock'>"+
          "<div id='sssc_prevSlide' class='sssc_slide'><p class='sssc_slideHeading'>Previous Slide</p><div class='sssc_slideContent' /></div>"+
          "<div id='sssc_currSlide' class='sssc_slide'><p class='sssc_slideHeading'>Current Slide</p><div class='sssc_slideContent' /></div>"+
          "<div id='sssc_nextSlide' class='sssc_slide'><p class='sssc_slideHeading'>Next Slide</p><div class='sssc_slideContent' /></div>"+
        "</div>"+
        "<div id='sssc_timeControls'>"+
          "<p>"+
            "<span id='sssc_timer'>00:00:00</span>"+
            "<span id='sssc_time'>"+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+"</span>"+
          "</p>"+
          "<input type='button' id='sssc_startTimer' value='Start Timer' />"+
          "<input type='button' id='sssc_resetTimer' value='Reset Timer' />"+
          "</div>"+
      "</div>"
      )
      .find('#simpleSlide_speakerConsole');

    var sct = $('#sssc_time');
    var scr = $('#sssc_timer');
    var tStarted = false;
    var tCnt = 0;

    $('#sssc_startTimer').click(function() {
      tStarted = !tStarted;
      $(this).val((tStarted)?'Pause Timer':'Start Timer');
    });
    $('#sssc_resetTimer').click(function() {
      scr.text("00:00:00");
      tCnt = 0;
    });

    function incrementTimes() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      sct.text(((h<10)?'0'+h:h)+':'+((m<10)?'0'+m:m)+':'+((s<10)?'0'+s:s));
      
      if (tStarted) {
        var t = ++tCnt;
        h = Math.floor(t / 3600);
        t -= (h * 3600);
        h = (h<10)?'0'+h:h;
        m = Math.floor(t / 60);
        t -= (m * 60);
        m = (m<10)?'0'+m:m;
        scr.text(h+':'+m+':'+((t<10)?'0'+t:t));
      }

      setTimeout(incrementTimes, 1000);
    }
    setTimeout(incrementTimes, 1000);

    var scp = $('#sssc_prevSlide .sssc_slideContent');
    var scc = $('#sssc_currSlide .sssc_slideContent');
    var scn = $('#sssc_nextSlide .sssc_slideContent');

    function getSlideHtml(s) {
      s = $(s);
      if (s.length) {
        var id = s.attr('id');
        var h = s.find('h2');
        var nt = s.find('.notes').html();

        return "<h3>"+((h.length)?h.text():id)+"</h3>"+
               ((h.length)?"<p class='sssc_sid'>"+id+"</p>":'')+
               "<div class='sssc_notes'>"+nt+"</div>";

      } else {
        return '<p class="fine">(none)</p>';
      }
    }

    n.bind('change.simpleSlide', function(e, cur) {
      var id = cur.id;

      var s = slides.filter('#'+id);
      if (s) {
        scc.html(getSlideHtml(s));
        scn.html(getSlideHtml(s.next('.slide')));
        scp.html(getSlideHtml(s.prev('.slide')));
      } else {
        s.add(s.next('.slide')).add(s.prev('.slide')).text('???');
      }

    });

    if (window.location.hash && window.location.hash.length) {
      n.trigger('change.simpleSlide', $(window.location.hash).get(0));
    }

  };

  
})(jQuery);