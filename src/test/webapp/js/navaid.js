QUnit.config.requireExpects = true;

QUnit.module('tk.NavAid', {
	beforeEach: function(assert){
     this.geolocation = ol.Geolocation.prototype;
     for (var member in ol.Geolocation.prototype){
       ol.Geolocation.prototype[member] = function(){};
     }

    $('body').append('<div id="map"></div>');
    this.TEST_MAP = new ol.Map({
    	target: $('#map').get(0),
    	view: new ol.View({
    		maxZoom: 16,
    		zoom: 8,
    		center: [-8178732, 4962492]
    	})
    });

	},
	afterEach: function(assert){
    ol.Geolocation.prototype = this.geolocation;
    delete this.TEST_MAP;
    $('#map, #navigation, #navigation-settings, #warning, .dia-container').remove();
	}
});

QUnit.test('constructor (no startingZoomLevel option)', function(assert){
  assert.expect(15);

  var updateCurrentTrack = tk.NavAid.prototype.updateCurrentTrack;
  var baseLayer = tk.NavAid.prototype.baseLayer;
  var initDraw = tk.NavAid.prototype.initDraw;
  var restoreFeatures = tk.NavAid.prototype.restoreFeatures;
  var initCurrentTrack = tk.NavAid.prototype.initCurrentTrack;
  var setupControls = tk.NavAid.prototype.setupControls;
  var navSettings = tk.NavAid.prototype.navSettings;
  var navLayer = tk.NavAid.prototype.navLayer;
  var setTracking = tk.NavAid.prototype.setTracking;
  var featureInfo = tk.NavAid.prototype.featureInfo;
  var called = function(){
    assert.ok(true);
  };
  tk.NavAid.prototype.updateCurrentTrack = called;
  tk.NavAid.prototype.baseLayer = called;
  tk.NavAid.prototype.initDraw = called;
  tk.NavAid.prototype.restoreFeatures = called;
  tk.NavAid.prototype.initCurrentTrack = called;
  tk.NavAid.prototype.setupControls = called;
  tk.NavAid.prototype.navSettings = called;
  tk.NavAid.prototype.navLayer = called;

  tk.NavAid.prototype.setTracking = function(tracking){
    // called by super constructor and then by triggered event
    assert.notOk(tracking);
  };

  var mockEvent = {type: 'click'};
  tk.NavAid.prototype.featureInfo = function(event){
    assert.ok(event === mockEvent);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal(navaid.startingZoomLevel, 15);
  assert.ok(navaid.popup instanceof nyc.ol.Popup);
  assert.ok(navaid.source instanceof ol.source.Vector);
  assert.ok(navaid.dia instanceof nyc.Dialog);

  navaid.dispatchEvent(nyc.ol.Tracker.EventType.UPDATED, navaid);
  this.TEST_MAP.dispatchEvent(mockEvent);

  tk.NavAid.prototype.updateCurrentTrack = updateCurrentTrack;
  tk.NavAid.prototype.baseLayer = baseLayer;
  tk.NavAid.prototype.initDraw = initDraw;
  tk.NavAid.prototype.restoreFeatures = restoreFeatures;
  tk.NavAid.prototype.initCurrentTrack = initCurrentTrack;
  tk.NavAid.prototype.setupControls = setupControls;
  tk.NavAid.prototype.navSettings = navSettings;
  tk.NavAid.prototype.navLayer = navLayer;
  tk.NavAid.prototype.setTracking = setTracking;
  tk.NavAid.prototype.featureInfo = featureInfo;
});

QUnit.test('constructor (has startingZoomLevel option)', function(assert){
  assert.expect(15);

  var updateCurrentTrack = tk.NavAid.prototype.updateCurrentTrack;
  var baseLayer = tk.NavAid.prototype.baseLayer;
  var initDraw = tk.NavAid.prototype.initDraw;
  var restoreFeatures = tk.NavAid.prototype.restoreFeatures;
  var initCurrentTrack = tk.NavAid.prototype.initCurrentTrack;
  var setupControls = tk.NavAid.prototype.setupControls;
  var navSettings = tk.NavAid.prototype.navSettings;
  var navLayer = tk.NavAid.prototype.navLayer;
  var setTracking = tk.NavAid.prototype.setTracking;
  var featureInfo = tk.NavAid.prototype.featureInfo;
  var called = function(){
    assert.ok(true);
  };
  tk.NavAid.prototype.updateCurrentTrack = called;
  tk.NavAid.prototype.baseLayer = called;
  tk.NavAid.prototype.initDraw = called;
  tk.NavAid.prototype.restoreFeatures = called;
  tk.NavAid.prototype.initCurrentTrack = called;
  tk.NavAid.prototype.setupControls = called;
  tk.NavAid.prototype.navSettings = called;
  tk.NavAid.prototype.navLayer = called;

  tk.NavAid.prototype.setTracking = function(tracking){
    // called by super constructor and then by triggered event
    assert.notOk(tracking);
  };

  var mockEvent = {type: 'click'};
  tk.NavAid.prototype.featureInfo = function(event){
    assert.ok(event === mockEvent);
  };

  var navaid = new tk.NavAid({
    map: this.TEST_MAP,
    startingZoomLevel: 10
  });

  assert.equal(navaid.startingZoomLevel, 10);
  assert.ok(navaid.popup instanceof nyc.ol.Popup);
  assert.ok(navaid.source instanceof ol.source.Vector);
  assert.ok(navaid.dia instanceof nyc.Dialog);

  navaid.dispatchEvent(nyc.ol.Tracker.EventType.UPDATED, navaid);
  this.TEST_MAP.dispatchEvent(mockEvent);

  tk.NavAid.prototype.updateCurrentTrack = updateCurrentTrack;
  tk.NavAid.prototype.baseLayer = baseLayer;
  tk.NavAid.prototype.initDraw = initDraw;
  tk.NavAid.prototype.restoreFeatures = restoreFeatures;
  tk.NavAid.prototype.initCurrentTrack = initCurrentTrack;
  tk.NavAid.prototype.setupControls = setupControls;
  tk.NavAid.prototype.navSettings = navSettings;
  tk.NavAid.prototype.navLayer = navLayer;
  tk.NavAid.prototype.setTracking = setTracking;
  tk.NavAid.prototype.featureInfo = featureInfo;
});

QUnit.test('setTracking', function(assert){
  assert.expect(6);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var setTracking = nyc.ol.Tracker.prototype.setTracking;
  nyc.ol.Tracker.prototype.setTracking = function(tracking){
    assert.ok(tracking);
  };

  navaid.setTracking(true);

  assert.notOk(navaid.skipViewUpdate);
  assert.ok($('.pause-btn').hasClass('pause'));

  navaid.setTracking(false);

  assert.ok(navaid.skipViewUpdate);
  assert.notOk($('.pause-btn').hasClass('pause'));

  nyc.ol.Tracker.prototype.setTracking = setTracking;
});

QUnit.test('restore', function(assert){
  assert.expect(0);

  var restore = nyc.ol.Tracker.prototype.restore;
  nyc.ol.Tracker.prototype.restore = function() {
    assert.ok(false);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.restore();

  nyc.ol.Tracker.prototype.restore = restore;
});

QUnit.test('updateView', function(assert){
  assert.expect(1);

  var popup = nyc.ol.Popup;
  var updateView = nyc.ol.Tracker.prototype.updateView;

  nyc.ol.Popup = function(){
    $('body').append('<div class="popup"></div>');
  };

  var mockPosition =  'mock-position';
  nyc.ol.Tracker.prototype.updateView = function(position) {
    assert.equal(position, mockPosition);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  $('.popup').show();
  navaid.updateView(mockPosition);

  $('.popup').hide();
  navaid.updateView(mockPosition);

  $('.popup').remove();
  nyc.ol.Popup = popup;
  nyc.ol.Tracker.prototype.updateView = updateView;
});

QUnit.test('baseLayer', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var noaa = this.TEST_MAP.getLayers().getArray()[0];

  assert.ok(noaa instanceof ol.layer.Tile);
  assert.ok(noaa.getSource() instanceof ol.source.XYZ);
  assert.equal(noaa.getSource().getUrls()[0], 'https://tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png');
});

QUnit.test('navLayer', function(assert){
  assert.expect(12);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var nav = this.TEST_MAP.getLayers().getArray()[3];

  assert.ok(nav instanceof ol.layer.Vector);
  assert.ok(nav.getSource() instanceof ol.source.Vector);
  assert.ok(nav.getSource() === navaid.navSource);
  assert.equal(nav.getStyle().length, 2);
  assert.equal(nav.getStyle()[0].getStroke().getColor(), 'yellow');
  assert.equal(nav.getStyle()[0].getStroke().getWidth(), 4);
  assert.notOk(nav.getStyle()[0].getFill());
  assert.notOk(nav.getStyle()[0].getImage());
  assert.equal(nav.getStyle()[1].getStroke().getColor(), 'red');
  assert.equal(nav.getStyle()[1].getStroke().getWidth(), 2);
  assert.notOk(nav.getStyle()[1].getFill());
  assert.notOk(nav.getStyle()[1].getImage());
});

QUnit.test('setupControls (called by constructor)', function(assert){
  assert.expect(18);

  var navaid;

  var toggleNav = tk.NavAid.prototype.toggleNav;
  var hackAudio = tk.NavAid.prototype.hackAudio;
  var playPause = tk.NavAid.prototype.playPause;
  var navSettings = tk.NavAid.prototype.navSettings;
  var importExport = tk.NavAid.prototype.importExport;

  tk.NavAid.prototype.toggleNav = function(event){
    assert.ok(event.target === navaid.navBtn.get(0));
  };
  tk.NavAid.prototype.hackAudio = function(btn){
      this.audio = {};
      assert.ok(btn === this.navBtn);
  };
  tk.NavAid.prototype.playPause = function(event){
    assert.ok($(event.target).hasClass('pause-btn'));
  };
  tk.NavAid.prototype.navSettings = function(){
    assert.ok(true);
  };
  tk.NavAid.prototype.importExport = function(){
    assert.ok(true);
  };

  navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal($('.draw-btn-mnu .square, .draw-btn-mnu .box, .draw-btn-mnu .gps, .draw-btn-mnu .save, .draw-btn-mnu .delete').length, 0);
  assert.ok(navaid.waypointBtn.hasClass('waypoint'));

  assert.ok(navaid.navBtn.hasClass('nav'));
  navaid.navBtn.trigger('click');

  assert.equal($('.nav-dash').length, 1);
  assert.ok(navaid.navForm.get(0) === $('#navigation').get(0));
  assert.ok(navaid.settingsForm.get(0) === $('#navigation-settings').get(0));
  assert.equal($('#warning').length, 1);

  assert.equal($('a.pause-btn').length, 1);
  $('a.pause-btn').trigger('click');

  $('#navigation-settings input').each(function(){
    $(this).trigger('change');
  });

  $('#navigation-settings button').each(function(){
    $(this).trigger('click');
  });

  tk.NavAid.prototype.toggleNav = toggleNav;
  tk.NavAid.prototype.hackAudio = hackAudio;
  tk.NavAid.prototype.playPause = playPause;
  tk.NavAid.prototype.navSettings = navSettings;
  tk.NavAid.prototype.importExport = importExport;
});

QUnit.test('playPause (play)', function(assert){
  assert.expect(3);

  var done = assert.async();

  var navaid;

  this.TEST_MAP.getView().animate = function(options){
    assert.equal(options.zoom, navaid.startingZoomLevel);
  };

  navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.setTracking = function(tracking){
    assert.ok(tracking);
  };

  navaid.draw.deactivate = function(silent){
    assert.ok(silent);
  };

  $('.pause-btn').removeClass('pause');

  navaid.playPause({target: $('.pause-btn').get(0)});

  setTimeout(function(){
    done();
  }, 1000);
});

QUnit.test('playPause (pause)', function(assert){
  assert.expect(1);

  var done = assert.async();

  var navaid;

  this.TEST_MAP.getView().animate = function(options){
    assert.ok(false);
  };

  navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.setTracking = function(tracking){
    assert.ok(true);
  };

  navaid.draw.deactivate = function(silent){
    assert.ok(false);
  };

  $('.pause-btn').addClass('pause');

  navaid.playPause({target: $('.pause-btn').get(0)});

  setTimeout(function(){
    done();
  }, 1000);
});

QUnit.test('initCurrentTrack (firstLaunch)', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.updateStorage = function(){
    assert.ok(true);
  };

  var trackIdx = navaid.storage.getItem('navaid-track-index');
  navaid.storage.removeItem('navaid-track-index');

  navaid.initCurrentTrack();

  assert.equal(navaid.trackFeature.getId(), 'navaid-track-1');
  assert.equal(navaid.storage.getItem('navaid-track-index'), '1');
  assert.ok(navaid.firstLaunch);

  navaid.storage.setItem('navaid-track-index', trackIdx);
});

QUnit.test('initCurrentTrack (not firstLaunch)', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.updateStorage = function(){
    assert.ok(true);
  };

  var trackIdx = navaid.storage.getItem('navaid-track-index');
  navaid.storage.setItem('navaid-track-index', 3);

  navaid.initCurrentTrack();

  assert.equal(navaid.trackFeature.getId(), 'navaid-track-4');
  assert.equal(navaid.storage.getItem('navaid-track-index'), '4');
  assert.notOk(navaid.firstLaunch);

  navaid.storage.setItem('navaid-track-index', trackIdx);
});

QUnit.test('initDraw (called by constructor)', function(assert){
  assert.expect(26);

  var nameFeature = tk.NavAid.prototype.nameFeature;
  var updateStorage = tk.NavAid.prototype.updateStorage;
  var setTracking = tk.NavAid.prototype.setTracking;

  tk.NavAid.prototype.nameFeature = function(){
    // once from event
    assert.ok(true);
  };
  tk.NavAid.prototype.updateStorage = function(){
    // once from constructor, once from event
    assert.ok(true);
  };
  tk.NavAid.prototype.setTracking = function(tracking){
    // twice from constructor, once from event
    assert.ok(true);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.ok(navaid.draw instanceof nyc.ol.Draw);
  assert.ok(navaid.draw.map === this.TEST_MAP);
  assert.equal(navaid.draw.layer.getStyle().length, 3);

  assert.equal(navaid.draw.layer.getStyle()[0].getZIndex(), 0);
  assert.equal(navaid.draw.layer.getStyle()[0].getFill().getColor(), 'rgba(255,255,255,.2)');
  assert.notOk(navaid.draw.layer.getStyle()[0].getStroke());
  assert.notOk(navaid.draw.layer.getStyle()[0].getImage());

  assert.equal(navaid.draw.layer.getStyle()[1].getZIndex(), 200);
  assert.equal(navaid.draw.layer.getStyle()[1].getStroke().getColor(), 'red');
  assert.equal(navaid.draw.layer.getStyle()[1].getStroke().getWidth(), 3);
  assert.notOk(navaid.draw.layer.getStyle()[1].getFill());
  assert.notOk(navaid.draw.layer.getStyle()[1].getImage());

  assert.equal(navaid.draw.layer.getStyle()[2].getZIndex(), 300);
  assert.equal(navaid.draw.layer.getStyle()[2].getImage().getRadius(), 8);
  assert.equal(navaid.draw.layer.getStyle()[2].getImage().getFill().getColor(), 'red');
  assert.equal(navaid.draw.layer.getStyle()[2].getImage().getStroke().getColor(), '#fff');
  assert.equal(navaid.draw.layer.getStyle()[2].getImage().getStroke().getWidth(), 2.5);
  assert.notOk(navaid.draw.layer.getStyle()[2].getFill());
  assert.notOk(navaid.draw.layer.getStyle()[2].getStroke());

  navaid.draw.trigger(nyc.ol.FeatureEventType.ADD);
  navaid.draw.trigger(nyc.ol.FeatureEventType.REMOVE);
  navaid.draw.trigger(nyc.ol.FeatureEventType.CHANGE);
  navaid.draw.trigger(nyc.ol.Draw.EventType.ACTIVE_CHANGED);

  tk.NavAid.prototype.nameFeature = nameFeature;
  tk.NavAid.prototype.updateStorage = updateStorage;
  tk.NavAid.prototype.setTracking = setTracking;
});

QUnit.test('updateDash (has arrival)', function(assert){
  assert.expect(7);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = 'mock-feature';

  navaid.getSpeed = function(){
    return 10;
  };
  navaid.getHeading = function(){
    return 1;
  };
  navaid.distance = function(){
    return 1000;
  };
  navaid.remainingTime = function(){
    return 'remaining-time';
  };
  navaid.checkCourse = function(feature, speed, heading){
    assert.ok(feature === navaid.navFeature);
    assert.equal(speed, 10);
    assert.equal(heading, 57);
  };

  navaid.updateDash();

  assert.equal($('#speed span').html(), '22.37 mph');
  assert.equal($('#heading span').html(), '57°');
  assert.equal($('#arrival span').html(), 'remaining-time');
  assert.ok($('#arrival span').is(':visible'));
});


QUnit.test('updateDash (no arrival)', function(assert){
  assert.expect(7);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = 'mock-feature';

  navaid.getSpeed = function(){
    return 10;
  };
  navaid.getHeading = function(){
    return 1;
  };
  navaid.distance = function(){
    return 1000;
  };
  navaid.remainingTime = function(){
    return '';
  };
  navaid.checkCourse = function(feature, speed, heading){
    assert.ok(feature === navaid.navFeature);
    assert.equal(speed, 10);
    assert.equal(heading, 57);
  };

  navaid.updateDash();

  assert.equal($('#speed span').html(), '22.37 mph');
  assert.equal($('#heading span').html(), '57°');
  assert.equal($('#arrival span').html(), '');
  assert.notOk($('#arrival span').is(':visible'));
});

QUnit.test('avgSpeed', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var speed = 14;
  navaid.getSpeed = function(){
      return speed;
  };

  navaid.speeds = [10, 11, 12, 15, 10, 9];
  assert.equal(navaid.avgSpeed().toFixed(2), '11.57');
  assert.deepEqual(navaid.speeds, [14, 10, 11, 12, 15, 10, 9]);

  var speed = 12;
  navaid.speeds = [10, 11, 12, 15, 10, 9, 14, 11, 9, 18];
  assert.equal(navaid.avgSpeed().toFixed(2), '11.30');
  assert.deepEqual(navaid.speeds, [12, 10, 11, 12, 15, 10, 9, 14, 11, 9]);
});

QUnit.test('distance (no navFeature)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal(navaid.distance(), 0);
});

QUnit.test('distance (no course)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var navFeature = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [0, 3]])
  });

  assert.equal(navaid.distance(navFeature), 3);
});

QUnit.test('distance (has course)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.course = new ol.geom.LineString([[0, 1], [0, 3], [1, 4], [2, 5]]);

  var navFeature = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [0, 3]])
  });

  assert.equal(navaid.distance(navFeature).toFixed(2), '7.83');
});

QUnit.test('remainingTime', function(assert){
  assert.expect(7);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal(navaid.remainingTime(0, 10), '');
  assert.equal(navaid.remainingTime(1000, 0), '');
  assert.equal(navaid.remainingTime(1000, 200), '00:00:05');
  assert.equal(navaid.remainingTime(1000, 10), '00:01:40');
  assert.equal(navaid.remainingTime(1000, 1), '00:16:40');
  assert.equal(navaid.remainingTime(10000, 1), '02:46:40');
  assert.equal(navaid.remainingTime(100000, 1), '27:46:40');
});

QUnit.test('heading', function(assert){
  assert.expect(2);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var line = new ol.geom.LineString([[0, 0], [1, 1]]);
  assert.equal(navaid.heading(line).toFixed(2), '45.00');

  line = new ol.geom.LineString([[1, 1], [0, 0]]);
  assert.equal(navaid.heading(line).toFixed(2), '225.00');
});

QUnit.test('checkCourse', function(assert){
  assert.expect(6);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.offCourse = 20;

  var navFeature = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [0, 3]])
  });

  navaid.heading = function(){assert.ok(false);};
  navaid.warnOn = function(){assert.ok(false);};
  navaid.warnOff = function(){assert.ok(true);};

  navaid.checkCourse(null, 10, 1);
  navaid.checkCourse(navFeature, 0, 1);

  navaid.heading = function(line){
    assert.ok(line === navFeature.getGeometry());
    return 30;
  };
  navaid.warnOn = function(){assert.ok(false);};
  navaid.warnOff = function(){assert.ok(true);};

  navaid.checkCourse(navFeature, 5, 10);

  navaid.heading = function(line){
    assert.ok(line === navFeature.getGeometry());
    return 31;
  };
  navaid.warnOn = function(){assert.ok(true);};
  navaid.warnOff = function(){assert.ok(false);};

  navaid.checkCourse(navFeature, 5, 10);
});

QUnit.test('warnOff', function(assert){
  assert.expect(5);

  var clearInterval = window.clearInterval;

  window.clearInterval = function(intv){
    assert.equal(intv, 'mock-interval');
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.warnInterval = 'mock-interval';
  navaid.audio = {muted: false};

  $('#warning').show();
  assert.ok($('#warning').is(':visible'));

  navaid.warnOff();

  assert.notOk($('#warning').is(':visible'));
  assert.notOk(navaid.warnInterval);
  assert.ok(navaid.audio.muted);

  window.clearInterval = clearInterval;
});

QUnit.test('warnOn (warnIcon, warnAlarm)', function(assert){
  assert.expect(5);

  var setInterval = window.setInterval;

  window.setInterval = function(fn, intv){
    assert.equal(intv, 400);
    return 'mock-interval';
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.warnIcon = true;
  navaid.warnAlarm = true;
  navaid.audio = {muted: true};

  $('#warning').hide();
  assert.notOk($('#warning').is(':visible'));

  navaid.warnOn();

  assert.ok($('#warning').is(':visible'));
  assert.equal(navaid.warnInterval, 'mock-interval');
  assert.notOk(navaid.audio.muted);

  window.setInterval = setInterval;
});

QUnit.test('warnOn (not warnIcon, warnAlarm)', function(assert){
  assert.expect(4);

  var setInterval = window.setInterval;

  window.setInterval = function(fn, intv){
    assert.ok(false);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.warnIcon = false;
  navaid.warnAlarm = true;
  navaid.audio = {muted: true};

  $('#warning').hide();
  assert.notOk($('#warning').is(':visible'));

  navaid.warnOn();

  assert.notOk($('#warning').is(':visible'));
  assert.notOk(navaid.warnInterval);
  assert.notOk(navaid.audio.muted);

  window.setInterval = setInterval;
});

QUnit.test('warnOn (warnIcon, not warnAlarm)', function(assert){
  assert.expect(5);

  var setInterval = window.setInterval;

  window.setInterval = function(fn, intv){
    assert.equal(intv, 400);
    return 'mock-interval';
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.warnIcon = true;
  navaid.warnAlarm = false;
  navaid.audio = {muted: true};

  $('#warning').hide();
  assert.notOk($('#warning').is(':visible'));

  navaid.warnOn();

  assert.ok($('#warning').is(':visible'));
  assert.equal(navaid.warnInterval, 'mock-interval');
  assert.ok(navaid.audio.muted);

  window.setInterval = setInterval;
});

QUnit.test('warnOn (not warnIcon, not warnAlarm)', function(assert){
  assert.expect(4);

  var setInterval = window.setInterval;

  window.setInterval = function(fn, intv){
    assert.ok(false);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.warnIcon = false;
  navaid.warnAlarm = false;
  navaid.audio = {muted: true};

  $('#warning').hide();
  assert.notOk($('#warning').is(':visible'));

  navaid.warnOn();

  assert.notOk($('#warning').is(':visible'));
  assert.notOk(navaid.warnInterval);
  assert.ok(navaid.audio.muted);

  window.setInterval = setInterval;
});

QUnit.test('beginNavigation', function(assert){
  assert.expect(7);

  var done = assert.async();

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.setCourse = function(feature, direction){
    assert.equal(feature, 'mock-feature');
    assert.equal(direction, 'mock-direction');
  };
  navaid.navSource.addFeature = function(feature){
    assert.ok(feature === navaid.navFeature);
  };
  navaid.getPosition = function(){
    return 'mock-position';
  };
  navaid.nextWaypoint = function(position){
    assert.equal(position, 'mock-position');
  };

  navaid.navForm.show();
  assert.ok(navaid.navForm.is(':visible'));

  var btn = $('<a></a>');
  btn.data('feature', 'mock-feature');
  btn.data('direction', 'mock-direction');

  navaid.beginNavigation({target: btn.get(0)});

  assert.ok(navaid.navBtn.hasClass('stop'));

  setTimeout(function(){
    assert.notOk(navaid.navForm.is(':visible'));
    done();
  }, 1000);
});

QUnit.test('setCourse (line, forward)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.course = new ol.geom.Point();

  var feature = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [1, 1]])
  });

  navaid.setCourse(feature, 'fwd');

  assert.deepEqual(navaid.course.getCoordinates(), feature.getGeometry().getCoordinates());
});

QUnit.test('setCourse (line, reverse)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.course = new ol.geom.Point();

  var feature = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [1, 1]])
  });

  navaid.setCourse(feature, 'rev');

  assert.deepEqual(navaid.course.getCoordinates(), feature.getGeometry().getCoordinates().reverse());
});

QUnit.test('setCourse (point)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.course = new ol.geom.Point();

  var feature = new ol.Feature({
    geometry: new ol.geom.Point([0, 0])
  });

  navaid.setCourse(feature, 'rev');

  assert.deepEqual(navaid.course.getCoordinates(), feature.getGeometry().getCoordinates());
});

QUnit.test('setCourse (polygon)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.course = new ol.geom.Point();

  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([[0, 0], [1, 1], [0, 1], [0, 0]])
  });

  navaid.setCourse(feature, 'rev');

  assert.deepEqual(
    navaid.course.getCoordinates(),
    ol.extent.getCenter(feature.getGeometry().getExtent())
  );
});

QUnit.test('nextWaypoint (no navFeature, no course)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = null;
  navaid.course = null;

  navaid.inCoords = function(){
    assert.ok(false);
  };
  navaid.isOnSeg = function(){
    assert.ok(false);
  };

  navaid.nextWaypoint('mock-position');

  assert.notOk(navaid.navFeature);
});

QUnit.test('nextWaypoint (has navFeature, no course)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = 'mock-feature';
  navaid.course = null;

  navaid.inCoords = function(){
    assert.ok(false);
  };
  navaid.isOnSeg = function(){
    assert.ok(false);
  };

  navaid.nextWaypoint('mock-position');

  assert.equal(navaid.navFeature, 'mock-feature');
});

QUnit.test('nextWaypoint (no navFeature, has course)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = null;
  navaid.course = 'mock-course';

  navaid.inCoords = function(){
    assert.ok(false);
  };
  navaid.isOnSeg = function(){
    assert.ok(false);
  };

  navaid.nextWaypoint('mock-position');

  assert.notOk(navaid.navFeature);
});

QUnit.test('nextWaypoint (has navFeature, course is point)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = new ol.Feature({
    geometry: new ol.geom.LineString()
  });
  navaid.course = [0, 0];

  navaid.inCoords = function(){
    assert.ok(false);
  };
  navaid.isOnSeg = function(){
    assert.ok(false);
  };

  navaid.nextWaypoint([1, 1]);

  assert.deepEqual(
    navaid.navFeature.getGeometry().getCoordinates(),
    [[1, 1], [0, 0]]
  );
});

QUnit.test('nextWaypoint (has navFeature, course is line, next waypoint is vertex)', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = new ol.Feature({
    geometry: new ol.geom.LineString()
  });
  navaid.course = new ol.geom.LineString([[0, 0], [0, 1], [3, 3], [4, 4]]);
  navaid.course.getClosestPoint = function(coord){
    assert.deepEqual(coord, [1, 1]);
    return [3, 3];
  }

  navaid.inCoords = function(coord, coords){
    assert.deepEqual(coord, [3, 3]);
    assert.deepEqual(coords, navaid.course.getCoordinates());
    return 2;
  };
  navaid.isOnSeg = function(){
    assert.ok(false);
  };

  navaid.nextWaypoint([1, 1]);

  assert.deepEqual(
    navaid.navFeature.getGeometry().getCoordinates(),
    [[1, 1], [3, 3]]
  );
});

QUnit.test('nextWaypoint (has navFeature, course is line, next waypoint not vertex)', function(assert){
  assert.expect(7);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = new ol.Feature({
    geometry: new ol.geom.LineString()
  });
  navaid.course = new ol.geom.LineString([[0, 0], [0, 1], [3, 3], [4, 4]]);
  navaid.course.getClosestPoint = function(coord){
    assert.deepEqual(coord, [1, 1]);
    return [2, 2];
  }

  navaid.inCoords = function(coord, coords){
    assert.deepEqual(coord, [2, 2]);
    assert.deepEqual(coords, navaid.course.getCoordinates());
    return -1;
  };

  var segCalls = [];
  navaid.isOnSeg = function(start, end, waypoint){
    segCalls.push([start, end, waypoint]);
    if (start[0] == 0 && start[1] == 1 && end[0] == 3 && end[1] == 3){
      return true;
    }
  };

  navaid.nextWaypoint([1, 1]);

  assert.deepEqual(
    navaid.navFeature.getGeometry().getCoordinates(),
    [[1, 1], [3, 3]]
  );

  assert.equal(segCalls.length, 2);
  assert.deepEqual(segCalls[0], [[0, 0], [0, 1], [2, 2]]);
  assert.deepEqual(segCalls[1], [[0, 1], [3, 3], [2, 2]]);
});

QUnit.test('inCoords', function(assert){
  assert.expect(5);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal(navaid.inCoords([0, 0], [[1, 1], [2, 2], [3, 3]]), -1);
  assert.equal(navaid.inCoords([0, 1], [[1, 1], [2, 2], [3, 3]]), -1);
  assert.equal(navaid.inCoords([1, 1], [[1, 1], [2, 2], [3, 3]]), 0);
  assert.equal(navaid.inCoords([2, 2], [[1, 1], [2, 2], [3, 3]]), 1);
  assert.equal(navaid.inCoords([3, 3], [[1, 1], [2, 2], [3, 3]]), 2);
});

QUnit.test('toggleNav (on)', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});
  navaid.navFeature = 'mock-feature';

  navaid.navSource.clear = function(){
    assert.ok(false);
  };
  navaid.warnOff = function(){
    assert.ok(false);
  };
  navaid.showNavigation = function(){
    assert.ok(true);
  };
  navaid.dia.yesNo = function(){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(args){
    assert.ok(false);
  };

  navaid.navBtn.removeClass('stop');
  navaid.toggleNav();

  assert.notOk(navaid.navBtn.hasClass('stop'));
  assert.equal(navaid.navFeature,'mock-feature');
});

QUnit.test('toggleNav (off, no)', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = 'mock-feature';

  navaid.navSource.clear = function(){
    assert.ok(false);
  };
  navaid.warnOff = function(){
    assert.ok(false);
  };
  navaid.showNavigation = function(){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(args){
    assert.equal(args.message, 'Stop navigation?');
    args.callback(false);
  };

  navaid.navBtn.addClass('stop');
  navaid.toggleNav();

  assert.ok(navaid.navBtn.hasClass('stop'));
  assert.equal(navaid.navFeature,'mock-feature');
});

QUnit.test('toggleNav (off, no)', function(assert){
  assert.expect(5);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.navFeature = 'mock-feature';

  navaid.navSource.clear = function(){
    assert.ok(true);
  };
  navaid.warnOff = function(){
    assert.ok(true);
  };
  navaid.showNavigation = function(){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(args){
    assert.equal(args.message, 'Stop navigation?');
    args.callback(true);
  };

  navaid.navBtn.addClass('stop');
  navaid.toggleNav();

  assert.notOk(navaid.navBtn.hasClass('stop'));
  assert.notOk(navaid.navFeature);
});

QUnit.test('showNavigation/addNavChoices', function(assert){
  assert.expect(37);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var div = navaid.navForm.find('.nav-features')
  navaid.source = new ol.source.Vector();

  var clickedBtn;
  navaid.beginNavigation = function(event){
    clickedBtn = event.target;
  };
  navaid.trash = function(event){
    clickedBtn = event.target;
  };

  navaid.showNavigation();

  assert.equal(div.html(), '<p class="none">No stored locations</p>');

  var f0 = new ol.Feature({
    geometry: new ol.geom.Point([0, 0])
  });
  f0.setId('c');
  var f1 = new ol.Feature({
    geometry: new ol.geom.LineString([[0, 0], [1, 1]])
  });
  f1.setId('a');
  var f2 = new ol.Feature({
    geometry: new ol.geom.Polygon([[0, 0], [1, 1], [2, 2], [0, 0]])
  });
  f2.setId('navaid-track-11');
  var f3 = new ol.Feature({
    geometry: new ol.geom.Point([1, 1])
  });
  f3.setId('d');
  var f4 = new ol.Feature({
    geometry: new ol.geom.Point([2, 2])
  });
  f4.setId('b');
	var f5 = new ol.Feature({
    geometry: new ol.geom.Polygon([[0, 0], [1, 1], [2, 2], [0, 0]])
  });

  navaid.source.addFeatures([f0, f1, f2, f3, f4, f5]);

  navaid.showNavigation();

  assert.equal(div.find('a').length, 10);

  assert.equal($('#nav-choice-navaid-track-11').length, 0);
  assert.equal($('#nav-choice-navaid-track-11-fwd').length, 0);
  assert.equal($('#nav-choice-navaid-track-11-rev').length, 0);


  assert.ok($('#nav-choice-a-fwd').get(0) === div.find('a').get(0));
  assert.ok($('#nav-choice-a-fwd').data('feature') === f1);
  assert.ok($('#nav-choice-a-fwd').data('direction') === 'fwd');
  assert.ok($('#nav-choice-a-fwd').next().hasClass('trash'));
  assert.ok($('#nav-choice-a-fwd').next().data('feature') === f1);

  assert.ok($('#nav-choice-a-rev').get(0) === div.find('a').get(2));
  assert.ok($('#nav-choice-a-rev').data('feature') === f1);
  assert.ok($('#nav-choice-a-rev').data('direction') === 'rev');
  assert.ok($('#nav-choice-a-rev').next().hasClass('trash'));
  assert.ok($('#nav-choice-a-rev').next().data('feature') === f1);

  assert.ok($('#nav-choice-b').get(0) === div.find('a').get(4));
  assert.ok($('#nav-choice-b').data('feature') === f4);
  assert.ok($('#nav-choice-b').next().hasClass('trash'));
  assert.ok($('#nav-choice-b').next().data('feature') === f4);

  assert.ok($('#nav-choice-c').get(0) === div.find('a').get(6));
  assert.ok($('#nav-choice-c').data('feature') === f0);
  assert.ok($('#nav-choice-c').next().hasClass('trash'));
  assert.ok($('#nav-choice-c').next().data('feature') === f0);

  assert.ok($('#nav-choice-d').get(0) === div.find('a').get(8));
  assert.ok($('#nav-choice-d').data('feature') === f3);
  assert.ok($('#nav-choice-d').next().hasClass('trash'));
  assert.ok($('#nav-choice-d').next().data('feature') === f3);

  $('#nav-choice-a-fwd').trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-a-fwd').get(0));
  $('#nav-choice-a-fwd').next().trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-a-fwd').next().get(0));

  $('#nav-choice-a-rev').trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-a-rev').get(0));
  $('#nav-choice-a-rev').next().trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-a-rev').next().get(0));

  $('#nav-choice-b').trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-b').get(0));
  $('#nav-choice-b').next().trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-b').next().get(0));

  $('#nav-choice-c').trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-c').get(0));
  $('#nav-choice-c').next().trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-c').next().get(0));

  $('#nav-choice-d').trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-d').get(0));
  $('#nav-choice-d').next().trigger('click');
  assert.ok(clickedBtn === $('#nav-choice-d').next().get(0));
});

QUnit.test('navSettings (firstLaunch)', function(assert){
  assert.expect(12);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.firstLaunch = true;

  var stored = [];
  navaid.storage.setItem = function(key, item){
    stored.push([key, item]);
  };

  navaid.navSettings();

  assert.ok(navaid.warnIcon);
  assert.ok(navaid.warnAlarm);
  assert.equal(navaid.offCourse, 20);
  assert.equal(stored[0][0], navaid.iconStore);
  assert.ok(stored[0][1]);
  assert.equal(stored[1][0], navaid.alarmStore);
  assert.ok(stored[1][1]);
  assert.equal(stored[2][0], navaid.degreesStore);
  assert.equal(stored[2][1], '20');
  assert.ok($('#off-course-icon').is(':checked'));
  assert.ok($('#off-course-alarm').is(':checked'));
  assert.equal($('#off-course-degrees').val(), 20);
});

QUnit.test('navSettings (from storage)', function(assert){
  assert.expect(6);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.firstLaunch = false;

  navaid.storage.getItem = function(key){
    if (key == navaid.iconStore) return 'true';
    if (key == navaid.alarmStore) return 'false';
    if (key == navaid.degreesStore) return '25';
  };

  navaid.navSettings();

  assert.ok(navaid.warnIcon);
  assert.notOk(navaid.warnAlarm);
  assert.equal(navaid.offCourse, 25);
  assert.ok($('#off-course-icon').is(':checked'));
  assert.notOk($('#off-course-alarm').is(':checked'));
  assert.equal($('#off-course-degrees').val(), 25);
});

QUnit.test('navSettings (from input)', function(assert){
  assert.expect(9);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.firstLaunch = false;

  navaid.warnIcon = true;
  navaid.warnAlarm = false;
  navaid.offCourse = 20;

  $('#off-course-icon').prop('checked', false);
  $('#off-course-alarm').prop('checked', true);
  $('#off-course-degrees').val(25);

  var stored = [];
  navaid.storage.setItem = function(key, item){
    stored.push([key, item]);
  };

  navaid.navSettings('mock-event');

  assert.notOk(navaid.warnIcon);
  assert.ok(navaid.warnAlarm);
  assert.equal(navaid.offCourse, 25);
  assert.equal(stored[0][0], navaid.iconStore);
  assert.notOk(stored[0][1]);
  assert.equal(stored[1][0], navaid.alarmStore);
  assert.ok(stored[1][1]);
  assert.equal(stored[2][0], navaid.degreesStore);
  assert.equal(stored[2][1], '25');
});

QUnit.test('center', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([[0, 0], [1, 1], [2, 2], [0, 0]])
  });

  assert.deepEqual(
    navaid.center(feature),
    ol.extent.getCenter(feature.getGeometry().getExtent())
  );
});

QUnit.test('dms', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  assert.equal(navaid.dms(nyc.ol.Basemap.CENTER), '40° 42′ 22″ N 73° 58′ 43″ W');
});

QUnit.test('infoHtml/nameHtml/pointHtml', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(nyc.ol.Basemap.CENTER)
  });
  feature.setId('NYC Point');
  assert.equal(
    navaid.infoHtml(feature).html(),
    '<div>40° 42′ 22″ N 73° 58′ 43″ W</div><div><b>NYC Point</b></div>'
  );
});

QUnit.test('infoHtml/nameHtml/lineHtml', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({
    geometry: new ol.geom.LineString([
      [nyc.ol.Basemap.EXTENT[0], nyc.ol.Basemap.EXTENT[1]],
      [nyc.ol.Basemap.EXTENT[2], nyc.ol.Basemap.EXTENT[3]]
    ])
  });
  feature.setId('NYC Line');
  assert.equal(
    navaid.infoHtml(feature).html(),
    '<div><b>Start:</b></div><div>40° 29′ 36″ N 74° 15′ 34″ W</div><div><b>End:</b></div><div>40° 55′ 06″ N 73° 41′ 45″ W</div><div><b>NYC Line</b></div>'
  );
});

QUnit.test('infoHtml/nameHtml/lineHtml (un-named track)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({
    geometry: new ol.geom.LineString([
      [nyc.ol.Basemap.EXTENT[0], nyc.ol.Basemap.EXTENT[1]],
      [nyc.ol.Basemap.EXTENT[2], nyc.ol.Basemap.EXTENT[3]]
    ])
  });
  feature.setId('navaid-track-12');
  assert.equal(
    navaid.infoHtml(feature).html(),
    '<div><b>Start:</b></div><div>40° 29′ 36″ N 74° 15′ 34″ W</div><div><b>End:</b></div><div>40° 55′ 06″ N 73° 41′ 45″ W</div><button>Add name...</button>'
  );
});
QUnit.test('infoHtml/nameHtml/polygonHtml', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

//[-8266522, 4937867, -8203781, 5000276]
  var feature = new ol.Feature({
    geometry: new ol.geom.Polygon([[
      ol.extent.getBottomLeft(nyc.ol.Basemap.EXTENT),
      ol.extent.getTopLeft(nyc.ol.Basemap.EXTENT),
      ol.extent.getTopRight(nyc.ol.Basemap.EXTENT),
      ol.extent.getBottomRight(nyc.ol.Basemap.EXTENT),
      ol.extent.getBottomLeft(nyc.ol.Basemap.EXTENT)
    ]])
  });
  feature.setId('NYC Polygon');
  assert.equal(
    navaid.infoHtml(feature).html(),
    '<div><b>Center:</b></div><div>40° 42′ 22″ N 73° 58′ 40″ W</div><div><b>NYC Polygon</b></div>'
  );
});

QUnit.test('infoHtml (no name)', function(assert){
  assert.expect(1);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(nyc.ol.Basemap.CENTER)
  });
  assert.equal(
    navaid.infoHtml(feature).html(),
    '<div>40° 42′ 22″ N 73° 58′ 43″ W</div><button>Add name...</button>'
  );
});

QUnit.test('featureInfo (no feature)', function(assert){
  assert.expect(1);

  this.TEST_MAP.forEachFeatureAtPixel = function(pix, fn){
    assert.equal(pix, 'mock-pixel');
  };

  this.TEST_MAP.getCoordinateFromPixel = function(pix){
    assert.ok(false);
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.infoHtml = function(feature){
    assert.ok(false);
  };
  navaid.popup.show = function(options){
    assert.ok(false);
  };

  navaid.featureInfo({pixel: 'mock-pixel'});
});

QUnit.test('featureInfo (has feature)', function(assert){
  assert.expect(5);

  this.TEST_MAP.forEachFeatureAtPixel = function(pix, fn){
    assert.equal(pix, 'mock-pixel');
    return 'mock-feature';
  };

  this.TEST_MAP.getCoordinateFromPixel = function(pix){
    assert.equal(pix, 'mock-pixel');
    return 'mock-coordinate';
  };

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.infoHtml = function(feature){
    assert.equal(feature, 'mock-feature');
    return 'mock-html';
  };
  navaid.popup.show = function(options){
    assert.equal(options.html, 'mock-html');
    assert.equal(options.coordinates, 'mock-coordinate');
  };

  navaid.featureInfo({pixel: 'mock-pixel'});
});

QUnit.test('restoreFeatures (get from store, has stored)', function(assert){
  assert.expect(6);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var format = new ol.format.GeoJSON();
  var geoJsonString = '{"type":"FeatureCollection","features":[{"type":"Feature","id":"after-0","geometry":{"type":"Point","coordinates":[-73.62460819692423,40.61323216067703]},"properties":null},{"type":"Feature","id":"after-1","geometry":{"type":"LineString","coordinates":[[-72.86105839223671,40.9293983447119],[-73.34445682973671,41.18620835500599],[-73.57516972036173,40.867116304827164],[-73.71799198598671,40.90864418063305]]},"properties":null}]}';
  var geoJsonFeatures = format.readFeatures(geoJsonString, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  var feature = new ol.Feature();
  feature.setId('before');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.storage.getItem = function(key){
    assert.equal(key, navaid.featuresStore);
    return geoJsonString;
  };
  navaid.storage.setItem = function(key){
    assert.ok(false);
  };

  navaid.restoreFeatures();

  assert.equal(navaid.source.getFeatures().length, 2);
  assert.equal(navaid.source.getFeatures()[0].getId(), 'after-0');
  assert.deepEqual(
    navaid.source.getFeatures()[0].getGeometry().getCoordinates(),
    geoJsonFeatures[0].getGeometry().getCoordinates()
  );
  assert.equal(navaid.source.getFeatures()[1].getId(), 'after-1');
  assert.deepEqual(
    navaid.source.getFeatures()[1].getGeometry().getCoordinates(),
    geoJsonFeatures[1].getGeometry().getCoordinates()
  );
});

QUnit.test('restoreFeatures (get from store, nothing stored)', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature();
  feature.setId('before');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.storage.getItem = function(key){
    assert.equal(key, navaid.featuresStore);
  };
  navaid.storage.setItem = function(key){
    assert.ok(false);
  };

  navaid.restoreFeatures();

  assert.equal(navaid.source.getFeatures().length, 1);
  assert.ok(navaid.source.getFeatures()[0] === feature);
});

QUnit.test('restoreFeatures (get from store, bad storage)', function(assert){
  assert.expect(5);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var error = console.error;
  console.error = function(ex){
    assert.equal(ex.name, 'SyntaxError');
    assert.equal(ex.message, 'Unexpected token b in JSON at position 0');
  };

  var feature = new ol.Feature();
  feature.setId('before');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.storage.getItem = function(key){
    assert.equal(key, navaid.featuresStore);
    return 'bad-storage';
  };
  navaid.storage.setItem = function(key){
    assert.ok(false);
  };

  navaid.restoreFeatures();

  assert.equal(navaid.source.getFeatures().length, 1);
  assert.ok(navaid.source.getFeatures()[0] === feature);

  console.error = error;
});

QUnit.test('restoreFeatures (stored as argument)', function(assert){
  assert.expect(7);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var format = new ol.format.GeoJSON();
  var geoJsonString = '{"type":"FeatureCollection","features":[{"type":"Feature","id":"after-0","geometry":{"type":"Point","coordinates":[-73.62460819692423,40.61323216067703]},"properties":null},{"type":"Feature","id":"after-1","geometry":{"type":"LineString","coordinates":[[-72.86105839223671,40.9293983447119],[-73.34445682973671,41.18620835500599],[-73.57516972036173,40.867116304827164],[-73.71799198598671,40.90864418063305]]},"properties":null}]}';
  var geoJsonFeatures = format.readFeatures(geoJsonString, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  var feature = new ol.Feature();
  feature.setId('before');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.storage.getItem = function(key){
    assert.ok(false);
  };
  navaid.storage.setItem = function(key, item){
    assert.equal(key, navaid.featuresStore);
    assert.equal(item, geoJsonString);
  };

  navaid.restoreFeatures(geoJsonString);

  assert.equal(navaid.source.getFeatures().length, 2);
  assert.equal(navaid.source.getFeatures()[0].getId(), 'after-0');
  assert.deepEqual(
    navaid.source.getFeatures()[0].getGeometry().getCoordinates(),
    geoJsonFeatures[0].getGeometry().getCoordinates()
  );
  assert.equal(navaid.source.getFeatures()[1].getId(), 'after-1');
  assert.deepEqual(
    navaid.source.getFeatures()[1].getGeometry().getCoordinates(),
    geoJsonFeatures[1].getGeometry().getCoordinates()
  );
});

QUnit.test('restoreFeatures (bad storage passed as argument)', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var error = console.error;
  console.error = function(ex){
    assert.equal(ex.name, 'SyntaxError');
    assert.equal(ex.message, 'Unexpected token b in JSON at position 0');
  };

  var feature = new ol.Feature();
  feature.setId('before');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.storage.getItem = function(key){
    assert.ok(false);
  };
  navaid.storage.setItem = function(key){
    assert.ok(false);
  };

  navaid.restoreFeatures('bad-storage');

  assert.equal(navaid.source.getFeatures().length, 1);
  assert.ok(navaid.source.getFeatures()[0] === feature);

  console.error = error;
});

QUnit.test('updateCurrentTrack', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var track = new ol.geom.LineString([[0, 0], [1, 1], [2, 2]]);
  navaid.track = track;
  navaid.trackFeature = new ol.Feature();

  navaid.nextWaypoint = function(position){
    assert.deepEqual(position, [2, 2]);
  };
  navaid.updateDash = function(){
    assert.ok(true);
  };

  navaid.updateCurrentTrack();

  assert.ok(navaid.trackFeature.getGeometry() === track);
});

QUnit.test('waypoint', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature();
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.getPosition = function(position){
    return [0, 0];
  };

  navaid.waypoint();

  assert.equal(navaid.source.getFeatures().length, 2);
  assert.ok(navaid.source.getFeatures()[1] === feature);
  assert.deepEqual(navaid.source.getFeatures()[0].getGeometry().getCoordinates(), [0, 0]);
});

QUnit.test('nameFeature (name entered)', function(assert){
  assert.expect(5);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.updateStorage = function(){
    assert.ok(true);
  };
  navaid.dia.input = function(options){
    assert.notOk(options.message);
    assert.equal(options.placeholder, 'Enter a name...');
    options.callback('the-name');
  };
  navaid.dia.ok = function(options){
    assert.ok(false);
  };

  var feature = new ol.Feature();
  feature.setId('un-named');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.nameFeature(feature);

  assert.equal(feature.getId(), 'the-name');
  assert.ok(navaid.source.getFeatures()[0] === feature);
});

QUnit.test('nameFeature (name not entered)', function(assert){
  assert.expect(5);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.updateStorage = function(){
    assert.ok(true);
  };
  navaid.dia.input = function(options){
    assert.notOk(options.message);
    assert.equal(options.placeholder, 'Enter a name...');
    options.callback('');
  };
  navaid.dia.ok = function(options){
    assert.ok(false);
  };

  var feature = new ol.Feature();
  feature.setId('un-named');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.nameFeature(feature);

  assert.equal(feature.getId(), 'un-named');
  assert.equal(navaid.source.getFeatures().length, 0);
});

QUnit.test('nameFeature (name exists)', function(assert){
  assert.expect(6);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.updateStorage = function(){
    assert.ok(false);
  };
  navaid.dia.input = function(options){
    assert.notOk(options.message);
    assert.equal(options.placeholder, 'Enter a name...');
    options.callback('the-name');
  };
  navaid.dia.ok = function(options){
    assert.equal(options.message, '<b>the-name</b> is already assigned');
    navaid.nameFeature = function(feat){
      assert.ok(feat == feature);
    };
    options.callback();
  };

  var feature = new ol.Feature();
  feature.setId('the-name');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.nameFeature(feature);

  assert.equal(feature.getId(), 'the-name');
  assert.equal(navaid.source.getFeatures().length, 1);
});

QUnit.test('trash (yes)', function(assert){
  assert.expect(3);

  var done = assert.async();

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.dia.yesNo = function(options){
    assert.equal(options.message, 'Delete <b>the-name</b>?');
    options.callback(true);
  };

  var feature = new ol.Feature({geometry: new ol.geom.Point([0, 0])});
  feature.setId('the-name');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.showNavigation();

  $('#nav-choice-the-name').next().trigger('click');

  assert.equal(navaid.source.getFeatures().length, 0);

  setTimeout(function(){
    assert.equal($('#nav-choice-the-name').length, 0);
    done();
  }, 1000);
});

QUnit.test('trash (no)', function(assert){
  assert.expect(4);

  var done = assert.async();

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.dia.yesNo = function(options){
    assert.equal(options.message, 'Delete <b>the-name</b>?');
    options.callback(false);
  };

  var feature = new ol.Feature({geometry: new ol.geom.Point([0, 0])});
  feature.setId('the-name');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  navaid.showNavigation();

  $('#nav-choice-the-name').next().trigger('click');

  assert.ok(navaid.source.getFeatures()[0] === feature);

  setTimeout(function(){
    assert.equal($('#nav-choice-the-name').length, 1);
    assert.ok($('#nav-choice-the-name').next().hasClass('trash'));
    done();
  }, 1000);
});

QUnit.test('updateStorage', function(assert){
  assert.expect(2);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  var feature = new ol.Feature({geometry: new ol.geom.Point([0, 0])});
  feature.setId('the-name');
  navaid.source.clear();
  navaid.source.addFeature(feature);

  var geoJson = new ol.format.GeoJSON().writeFeatures([feature], {
    featureProjection: this.TEST_MAP.getView().getProjection()
  });

  navaid.storage.setItem = function(key, item){
    assert.equal(key, navaid.featuresStore);
    assert.equal(item, JSON.stringify(geoJson));
  };

  navaid.updateStorage();
});

QUnit.test('importExport (clear yes)', function(assert){
  assert.expect(3);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.storage.getItem = function(key){
    assert.ok(false);
  };
  navaid.storage.removeItem = function(key){
    assert.equal(key, navaid.featuresStore);
  };
  navaid.storage.saveGeoJson = function(fileName, json){
    assert.ok(false);
  };
  navaid.storage.readTextFile = function(callback){
    assert.ok(false);
  };
  navaid.restoreFeatures = function(store){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(options){
      assert.equal(options.message, 'Delete all location data?');
      options.callback(true);
  };

  var feature = new ol.Feature();
  navaid.source.clear();
  navaid.source.addFeature(feature)

  $('#navigation-settings button.empty').trigger('click');

  assert.equal(navaid.source.getFeatures().length, 0);
});

QUnit.test('importExport (clear no)', function(assert){
  assert.expect(2);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.storage.getItem = function(key){
    assert.ok(false);
  };
  navaid.storage.removeItem = function(key){
    assert.ok(false);
  };
  navaid.storage.saveGeoJson = function(fileName, json){
    assert.ok(false);
  };
  navaid.storage.readTextFile = function(callback){
    assert.ok(false);
  };
  navaid.restoreFeatures = function(store){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(options){
      assert.equal(options.message, 'Delete all location data?');
      options.callback(false);
  };

  var feature = new ol.Feature();
  navaid.source.clear();
  navaid.source.addFeature(feature)

  $('#navigation-settings button.empty').trigger('click');

  assert.ok(navaid.source.getFeatures()[0] === feature);
});

QUnit.test('importExport (export)', function(assert){
  assert.expect(4);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.storage.getItem = function(key){
    assert.equal(key, navaid.featuresStore);
    return 'mock-json';
  };
  navaid.storage.removeItem = function(key){
    assert.ok(false);
  };
  navaid.storage.saveGeoJson = function(fileName, json){
    assert.equal(fileName, 'locations.json');
    assert.equal(json, 'mock-json');
  };
  navaid.storage.readTextFile = function(callback){
    assert.ok(false);
  };
  navaid.restoreFeatures = function(store){
    assert.ok(false);
  };
  navaid.dia.yesNo = function(options){
    assert.ok(false);
  };

  var feature = new ol.Feature();
  navaid.source.clear();
  navaid.source.addFeature(feature)

  $('#navigation-settings button.export').trigger('click');

  assert.ok(navaid.source.getFeatures()[0] === feature);
});

QUnit.test('importExport (import)', function(assert){
  assert.expect(2);

  var navaid = new tk.NavAid({map: this.TEST_MAP});

  navaid.storage.getItem = function(key){
    assert.ok(false);
  };
  navaid.storage.removeItem = function(key){
    assert.ok(false);
  };
  navaid.storage.saveGeoJson = function(fileName, json){
    assert.ok(false);
  };
  navaid.storage.readTextFile = function(callback){
    callback('mock-json');
  };
  navaid.restoreFeatures = function(store){
    assert.equal(store, 'mock-json');
  };
  navaid.dia.yesNo = function(options){
    assert.ok(false);
  };

  var feature = new ol.Feature();
  navaid.source.clear();
  navaid.source.addFeature(feature)

  $('#navigation-settings button.import').trigger('click');

  assert.ok(navaid.source.getFeatures()[0] === feature);
});
