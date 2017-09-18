var tk = window.tk || {};

tk.NavAid = function(options){
  nyc.ol.Tracker.call(this, options);

  this.draw = new nyc.ol.Draw({
    map: this.map,
    restore: false,
    showEveryTrackPositon: false
  });
  this.draw.on(nyc.ol.FeatureEventType.ADD, this.nameFeature, this);

  this.namedStore = 'navaid-presistent';
  this.popup = new nyc.ol.Popup(map);
  this.getNamedFeatures();
  this.firstRun = false;
  this.startingZoomLevel = options.startingZoomLevel || 14;
  this.on(nyc.ol.Tracker.EventType.UPDATED, this.updateCurrentTrack, this);
  this.setTracking(true);

  var trackIdx = this.storage.getItem('navaid-track-index') || 0;
  trackIdx = (trackIdx * 1) + 1;
  this.storage.setItem('navaid-track-index', trackIdx);
  this.trackFeature = new ol.Feature();
  this.storeNamed('navaid-track-' + trackIdx, this.trackFeature);

  this.captureBtn = $('<a class="capture ctl ctl-btn" data-role="button"></a>');
  $('body').append(this.captureBtn).trigger('create');
  this.captureBtn.click($.proxy(this.waypoint, this));

  this.navBtn = $('<a class="nav ctl ctl-btn" data-role="button"></a>');
  $('body').append(this.navBtn).trigger('create');
  this.navBtn.click($.proxy(this.toggleNav, this));

  this.dash = $(tk.NavAid.DASH_HTML);
  $('body').append(this.dash).trigger('create');

  this.source = new ol.source.Vector();
  this.map.addLayer(
    new ol.layer.Vector({
      source: this.source,
      style: [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 4
          })
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
          })
        })
      ]
    })
);

  this.map.on('click', this.featureInfo, this);
};

tk.NavAid.prototype.updateView = function(position){
  if (!$('.popup').is(':visible')){
    nyc.ol.Tracker.prototype.updateView.call(this, position);
  }
};

tk.NavAid.prototype.updateDash = function(){
  var feature = this.navFeature;
  var speed = this.getSpeed() || 0;
  var bearing = ((this.getHeading() || 0) * 180 / Math.PI) + '&deg;';
  var distance = feature ? feature.getGeometry().getLength() : 0;
  var arrival = feature ? this.remainingTime(distance, speed) : '';
  speed = (speed * 3.6 * 0.621371).toFixed(2) + ' mph';
  $('#speed span').html(speed);
  $('#heading span').html(bearing);
  $('#arrival span').html(arrival)[arrival ? 'show' : 'hide']();
};

tk.NavAid.prototype.remainingTime = function(distance, speed){
  if (distance && speed){
    var seconds = distance / speed;
    var hr = Math.floor(seconds / 3600);
  	var min = Math.floor((seconds - (hr * 3600))/60);
  	var sec = Math.floor(seconds - (hr * 3600) - (min * 60));
  	if (hr < 10){
      hr = '0' + hr;
    }
  	if (min < 10){
      min = '0' + min;
    }
  	if (sec < 10){
      sec = '0' + sec;
    }
  	return hr + ':' + min + ':' + sec;
  }
  return '';
};

tk.NavAid.prototype.navigate = function(){
  var origin = this.getPosition();
  var geom = this.navFeature.getGeometry();
  var destination = geom.getLastCoordinate();
  geom.setCoordinates([origin, destination]);
};

tk.NavAid.prototype.beginNavigation = function(event){
  var feature = $(event.target).data('feature');
  var origin = this.getPosition();
  var destination = this.center(feature);
  this.navFeature = new ol.Feature({
    geometry: new ol.geom.LineString([origin, destination]),
  });
  this.navList.slideToggle();
  this.source.addFeature(this.navFeature);
  this.on(nyc.ol.Tracker.UPDATED, this.navigate, this);
};

tk.NavAid.prototype.toggleNav = function(){
  var me = this, btn = me.navBtn;
  if (btn.hasClass('stop')){
    new nyc.Dialog().yesNo({
      message: 'Stop navigation?',
      callback: function(yesNo){
        if (yesNo){
          me.source.clear();
          me.un(nyc.ol.Tracker.UPDATED, me.navigate, me);
          btn.toggleClass('stop');
        }
      }
    });
  }else{
    me.showNavList();
    btn.toggleClass('stop');
  }
};

tk.NavAid.prototype.showNavList = function(){
var me = this;
if (!me.navList){
    me.navList = $(tk.NavAid.NAV_HTML);
    $('body').append(me.navList).trigger('create');
  }

  var names = [];
  for (var name in me.namedFeatures){
    names.push(name);
  };
  names.sort();

  var div = this.navList.find('.nav-features').empty();
  $.each(names, function(_, name){
    if (name.indexOf('navaid-track') == -1){
      var feature = me.namedFeatures[name];
      var a = $('<a data-role="button">' + name + '</a>');
      a.data('feature', feature);
      a.click($.proxy(me.beginNavigation, me));
      div.append(a).trigger('create');
    }
  });

  me.navList.slideToggle();
};

tk.NavAid.prototype.center = function(feature){
  var extent = feature.getGeometry().getExtent();
  return ol.extent.getCenter(extent);
};

tk.NavAid.prototype.dms = function(feature){
  var center = this.center(feature);
  center = proj4(this.view.getProjection().getCode(), 'EPSG:4326', center);
  return ol.coordinate.toStringHDMS(center);
};

tk.NavAid.prototype.infoHtml = function(feature){
  var name = feature.get('name');
  if (name){
    var me = this, html = $('<div></div>');
    html.append('<div>' + me.dms(feature) + '</div>')
    if (name.indexOf('navaid-track') == 0){
      var btn = $('<button>Name this track...</button>');
      btn.click(function(){
        me.nameFeature(feature);
      });
      html.append(btn);
    }else{
      html.append('<div><b>' + name + '</b></div>')
    }
    return html;
  }
};

tk.NavAid.prototype.featureInfo = function(event){
  var feature = this.map.forEachFeatureAtPixel(event.pixel, function(feature){
    return feature;
  });
  if (feature){
    var html = this.infoHtml(feature);
    if (html){
      this.popup.show({
        html: html,
        coordinates: this.center(feature)
      });
    }
  }
};

tk.NavAid.prototype.getNamedFeatures = function(){
  var features = [], stored = this.storage.getItem(this.namedStore);
  this.namedGeoJson = stored ? JSON.parse(stored) : {};
  this.namedFeatures = {};
  for (var name in this.namedGeoJson){
    var feature = this.geoJson.readFeature(this.namedGeoJson[name], {
      dataProjection: 'EPSG:4326',
      featureProjection: this.view.getProjection()
    });
    this.namedFeatures[name] = feature;
    features.push(feature);
  }
  this.draw.addFeatures(features);
};

tk.NavAid.prototype.updateCurrentTrack = function(){
  this.trackFeature.setGeometry(this.track);
  this.updateDash();
};

tk.NavAid.prototype.waypoint = function(event){
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(this.getPosition())
  });
  this.nameFeature(feature);
};

tk.NavAid.prototype.nameFeature = function(feature){
  var me = this;
  new nyc.Dialog().input({
    placeholder: 'Enter a name...',
    callback: function(name){
      if (!(name in me.namedFeatures)){
        me.storeNamed(name, feature);
      }else{
        new nyc.Dialog().ok({
            message: name + ' is already assigned',
            callback: function(){
              me.nameFeature(feature);
            }
        });
      }
    }
  });
};

tk.NavAid.prototype.storeNamed = function(name, feature){
  feature.set('name', name);
  this.namedFeatures[name] = feature;
  this.namedGeoJson[name] = this.geoJson.writeFeature(feature, {
    featureProjection: this.view.getProjection()
  });
  this.storage.setItem(this.namedStore, JSON.stringify(this.namedGeoJson));
  if ($.inArray(feature, this.draw.source.getFeatures()) == -1){
    this.draw.addFeatures([feature]);
  }
};

tk.NavAid.prototype.restore = function(){};

nyc.inherits(tk.NavAid, nyc.ol.Tracker);

tk.NavAid.NAV_HTML = '<div class="nav-list ui-page-theme-a">' +
  '<a class="cancel" data-role="button" onclick="$(this).parent().slideToggle();">Cancel</a>' +
  '<form class="ui-filterable">' +
    '<input id="named-feature" data-type="search">' +
  '</form>' +
  '<div class="nav-features" data-role="controlgroup" data-filter="true" data-input="#named-feature"></div>' +
'</div>';

tk.NavAid.DASH_HTML = '<div class="nav-dash">' +
  '<div id="speed"><span></span></div>' +
  '<div id="heading"><span></span></div>' +
  '<div id="arrival"><span></span></div>' +
'</div>';
