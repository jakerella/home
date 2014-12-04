
var jk = {}; // namespace

$(document).ready(function() {
  // show sub nav (and populate) if necessary
  var m = window.location.href.match(/jquery\/([a-zA-Z0-9\-]+)(\/|$)/);
  
  if (m && m.length) {
    $('#subNav').show();
    var n = $('#nav a[href*='+m[1]+']').addClass('active').text();
    var v = $('.currentVer:first').text();
    v = (v && v.length)?('-'+v):'';
    $('#subNav a:contains(Overview)').attr('href', '/jquery/'+m[1]);
    $('#subNav a:contains(Documentation)').attr('href', '/jquery/'+m[1]+'/docs.php');
    $('#subNav a:contains(Examples)').attr('href', '/jquery/'+m[1]+'/examples.php');

    if (!$('body').hasClass('github')) {
      var dl = $('a.downloadLink:first');
      if (dl && dl.length) {
        $('#subNav a:contains(Download)').attr('href', dl.attr('href'));
      } else {
        $('#subNav a:contains(Download)').attr('href', '/jquery/'+m[1]+'/jquery.'+n+v+'.zip');
      }
      
      // load the jQuery plugin file
      $('head').append("<script type='text/javascript' src='/jquery/"+m[1]+"/jquery."+n+v+".js'></script>");
    }
    
  } else {
    // on home page
    $('#subNav').hide();
    $('#nav a[href$=jquery]').addClass('active');
    
    // only for home page, hover on short descriptions
    $('#pluginList .plugin')
      .hover(
        function() {
          $(this)
            .css('background-color', '#ffffff')
            .find('a.subLink')
              .addClass('hover');
        },
        function() {
          $(this)
            .css('background-color', '#f2f2f2')
            .find('a.subLink')
              .removeClass('hover');
        }
      )
      .each(function() {
        $(this).append("<p class='goToPlugin'><a class='subLink' href='"+$(this).find('a.subLink:first').attr('href')+"' title='Go to this plugin'>Read more &raquo;</a></p>");
      });
    
  }
  
  jk.changeSideNote(Math.floor(Math.random() * jk.notes.length));

  var langs = ['php', 'javascript', 'js', 'ruby', 'css', 'html', 'bash', 'shell', 'perl', 'json', 'xml'];
  $("code").each(function() {
    var t = $(this).text();
    var l = t.substr(0, t.indexOf("\n"));
    var lang = "javascript";
    if (l && $.inArray(l, langs) > -1) {
      lang = (l == 'js')?'javascript':l;
      t = t.substr(t.indexOf("\n"));
    }
    var code = $(this).after("<pre />").next('pre').text(t);
    $(this).remove();

    if (code.parent().is('p') && code.parent().children().length === 1) {
      code.addClass('block-code');
    }

  });
});

jk.notes = [
  "Want to see some of these plug-ins in action?<br />Check out <a href='http://TripLittle.com'>TripLittle</a>, a great new travel planning tool.",
  "Follow me on <a href='http://github.com/jakerella'>github</a> for updates and info!",
  'If you like these plugins, consider donating for my hosting costs! <form id="donateform" action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="N7J7TPK8TCDRE"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>'
];
jk.changeSideNote = function (id) {
  var n = $('#sideNote');
  var c = n.html('').attr('className');
  n.removeClass(c);
  
  if (c && typeof id != 'number') {
    id = Number(c.substr(5));
    if (!id && id !== 0) { id = 0; } else { id++; }
    if (!jk.notes[id]) { id = 0; }
  }
  
  n.html(jk.notes[id]).addClass('note-'+id);
  setTimeout(jk.changeSideNote, 7000);
};