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
