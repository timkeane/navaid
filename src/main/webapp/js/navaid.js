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
  this.setTracking(true);
  this.on(nyc.ol.Tracker.UPDATED, this.updateCurrentTrack, this);

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

  this.source = new ol.source.Vector();
  this.map.addLayer(new ol.layer.Vector({source: this.source}));

  this.map.on('click', this.featureInfo, this);
};

tk.NavAid.prototype.navigate = function(event){
  var feature = $(event.target).data('feature');
  var origin = this.getPosition();
  var destination = this.center(feature);
  var feature = new ol.Feature({
    geometry: new ol.geom.LineString([origin, destination]),
  });
  var style = [
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
  ];
  feature.setStyle(style);
  this.source.clear();
  this.navList.slideToggle();
  this.source.addFeature(feature);
};
tk.NavAid.prototype.toggleNav = function(){
  var me = this, btn = me.navBtn;
  if (btn.hasClass('stop')){
    new nyc.Dialog().yesNo({
      message: 'Stop navigation?',
      callback: function(yesNo){
        if (yesNo){
          me.source.clear();
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
      a.click($.proxy(me.navigate, me));
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
      var btn = $('<button>Add name...</button>');
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
