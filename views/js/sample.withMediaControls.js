$("#tabs").tabs().hide();
var socket = io();
var consoles = {};

vivocha.ready().then(function () {
  $('#controls').show();
  var currentMedia = {
    source: vivocha.channel().id,
    load: 0.0,
    paused: false,
    media_sessions: {},
    assigned: {},
    assigned_count: 0,
    pending: {},
    pending_count: 0,
    idle: {},
    idle_count: 0,
    available_media: ['chat','voice','video'],
    busy_media: [],
    weights: {}
  };

  function manageConsole(econsole) {
    console.log('VivochaEmbeddedConsole', econsole.id, 'ready');
    var cid = econsole.id;
    consoles[cid] = econsole;

    function onloadchange (update) {
      console.info('loadchange', cid, update);
    }

    function onmediachange (mediachange, diff) {
      console.info('mediachange', cid, mediachange, diff);
    }

    econsole.channel().getAgentLoad().then(onloadchange);
    econsole.channel().on('loadchange', onloadchange);
    econsole.contact.getMedia().then(onmediachange);
    econsole.contact.on('mediachange', onmediachange);
    econsole.contact.on('text', function(text, from_id, from_nick) {
      console.info((new Date()).toLocaleTimeString(), cid, (from_nick || from_id) + ':', text);
      if ($('iframe#'+cid + ':visible').size() < 1) {
        $('a[href="#_'+cid+'"]').addClass('ui-state-highlight');
      }
    });
    econsole.contact.on('localtext', function (text) {
      console.info((new Date()).toLocaleTimeString(), cid, 'Agent:', text);
    });
    econsole.interface.on('windowclose', function() {
      console.info("windowclose (dispose)", cid);
      econsole.dispose().then(function () {
        console.log('windowclose (disposed)', cid);
        $('._'+cid).remove();
        if ( $('ul li').size() < 1) {
          $("#tabs").hide();
        }
        delete consoles[cid];
      });
    });
    econsole.interface.sendText('Hello world! This is a test message!');
  }

  socket.on('token', function(msg){
    if (msg.token) {
      var $container = $('<div id="_' + msg.cid + '" class="_' + msg.cid + ' contact" ></div>');
      var $label = $('<li class="_' + msg.cid + '"></li>').append('<a href="#_' + msg.cid + '">' + msg.cid + '</a>');
      vivocha.openConsole(msg.cid, msg.token, $container).then(manageConsole, function(err) {
        console.error('openConsole error', err);
        $('._'+msg.cid).remove();
        if ( $('ul li').size() < 1) {
          $("#tabs").hide();
        }
      });
      $('#tabs ul').append($label);
      $('#tabs').append($container);
      if ($('#tabs div').size() > 1) { // workaround to force the focus if there's only one contact
        $("#tabs").show().tabs("refresh");
      } else {
        $("#tabs")
          .tabs("destroy")
          .tabs({
            activate: function( event, ui ) {
              ui.newTab.find('a').removeClass('ui-state-highlight');
            }
          })
          .show();
      }
    } else {
      console.error('invalid token');
    }
  });

  $('#pause').click(function () {
    var $this = $(this);
    if ($this.hasClass('disabled')) {
      $this.removeClass('disabled');
      currentMedia.paused = false;
    } else {
      $this.addClass('disabled');
      currentMedia.paused = 'user';
    }
    vivocha.updateDeltaLoad(currentMedia, true);
  });
  $('#chat, #voice, #video').click(function () {
    var $this = $(this);
    var id = this.id;
    if ($this.hasClass('disabled')) {
      $this.removeClass('disabled');
      currentMedia.available_media.push(id)
    } else {
      $this.addClass('disabled');
      currentMedia.available_media = $.grep(currentMedia.available_media, function(value) {
        return value != id;
      });
    }
    var tmpMedia = { weblead: true };
    (currentMedia.available_media).forEach(function(m){
      if (m === 'voice') {
        tmpMedia['cbn'] = true;
      } else {
        tmpMedia[m] = true;
      }
    })
    socket.emit('status', tmpMedia);
    vivocha.updateDeltaLoad(currentMedia);
  });
});
