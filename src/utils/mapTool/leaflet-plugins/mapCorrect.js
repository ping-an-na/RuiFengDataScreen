L.CoordConver = function () {
  function a(b, c) {
    var d =
        -100 +
        2 * b +
        3 * c +
        0.2 * c * c +
        0.1 * b * c +
        0.2 * Math.sqrt(Math.abs(b)),
      d = d + (2 * (20 * Math.sin(6 * b * e) + 20 * Math.sin(2 * b * e))) / 3,
      d = d + (2 * (20 * Math.sin(c * e) + 40 * Math.sin((c / 3) * e))) / 3;
    return (d +=
      (2 * (160 * Math.sin((c / 12) * e) + 320 * Math.sin((c * e) / 30))) / 3);
  }
  function f(b, c) {
    var d =
        300 +
        b +
        2 * c +
        0.1 * b * b +
        0.1 * b * c +
        0.1 * Math.sqrt(Math.abs(b)),
      d = d + (2 * (20 * Math.sin(6 * b * e) + 20 * Math.sin(2 * b * e))) / 3,
      d = d + (2 * (20 * Math.sin(b * e) + 40 * Math.sin((b / 3) * e))) / 3;
    return (d +=
      (2 * (150 * Math.sin((b / 12) * e) + 300 * Math.sin((b / 30) * e))) / 3);
  }
  this.getCorrdType = function (b) {
    var c = "wgs84";
    switch (b.split(".")[0]) {
      case "Geoq":
      case "GaoDe":
      case "Google":
        c = "gcj02";
        break;
      case "Baidu":
        c = "bd09";
        break;
      case "OSM":
      case "TianDiTu":
        c = "wgs84";
    }
    return c;
  };
  this.bd09_To_gps84 = function (b, c) {
    var d = this.bd09_To_gcj02(b, c);
    return this.gcj02_To_gps84(d.lng, d.lat);
  };
  this.gps84_To_bd09 = function (b, c) {
    var d = this.gps84_To_gcj02(b, c);
    return this.gcj02_To_bd09(d.lng, d.lat);
  };
  this.gps84_To_gcj02 = function (b, c) {
    var d = a(b - 105, c - 35),
      k = f(b - 105, c - 35),
      l = (c / 180) * e,
      g = Math.sin(l),
      g = 1 - n * g * g,
      m = Math.sqrt(g),
      d = (180 * d) / (((h * (1 - n)) / (g * m)) * e),
      k = (180 * k) / ((h / m) * Math.cos(l) * e);
    return { lng: b + k, lat: c + d };
  };
  this.gcj02_To_gps84 = function (b, c) {
    var d = a(b - 105, c - 35),
      k = f(b - 105, c - 35),
      l = (c / 180) * e,
      g = Math.sin(l),
      g = 1 - n * g * g,
      m = Math.sqrt(g),
      d = (180 * d) / (((h * (1 - n)) / (g * m)) * e),
      k = (180 * k) / ((h / m) * Math.cos(l) * e);
    return { lng: 2 * b - (b + k), lat: 2 * c - (c + d) };
  };
  this.gcj02_To_bd09 = function (b, c) {
    var d = Math.sqrt(b * b + c * c) + 2e-5 * Math.sin(c * p),
      a = Math.atan2(c, b) + 3e-6 * Math.cos(b * p);
    return { lng: d * Math.cos(a) + 0.0065, lat: d * Math.sin(a) + 0.006 };
  };
  this.bd09_To_gcj02 = function (b, c) {
    var d = b - 0.0065,
      a = c - 0.006,
      e = Math.sqrt(d * d + a * a) - 2e-5 * Math.sin(a * p),
      d = Math.atan2(a, d) - 3e-6 * Math.cos(d * p);
    return { lng: e * Math.cos(d), lat: e * Math.sin(d) };
  };
  var e = 3.141592653589793,
    h = 6378245,
    n = 0.006693421622965943,
    p = (3e3 * e) / 180;
};
L.coordConver = function () {
  return new L.CoordConver();
};
L.TileLayer.ChinaProvider.include({
  addTo: function (a) {
    a.options.corrdType || (a.options.corrdType = this.options.corrdType);
    a.addLayer(this);
    return this;
  },
});
L.tileLayer.chinaProvider = function (a, f) {
  f = f || {};
  f.corrdType = L.coordConver().getCorrdType(a);
  return new L.TileLayer.ChinaProvider(a, f);
};
L.GridLayer.include({
  _setZoomTransform: function (a, f, e) {
    var h = f;
    void 0 != h &&
      this.options &&
      ("gcj02" == this.options.corrdType
        ? (h = L.coordConver().gps84_To_gcj02(f.lng, f.lat))
        : "bd09" == this.options.corrdType &&
          (h = L.coordConver().gps84_To_bd09(f.lng, f.lat)));
    f = this._map.getZoomScale(e, a.zoom);
    e = a.origin
      .multiplyBy(f)
      .subtract(this._map._getNewPixelOrigin(h, e))
      .round();
    L.Browser.any3d
      ? L.DomUtil.setTransform(a.el, e, f)
      : L.DomUtil.setPosition(a.el, e);
  },
  _getTiledPixelBounds: function (a) {
    var f = a;
    void 0 != f &&
      this.options &&
      ("gcj02" == this.options.corrdType
        ? (f = L.coordConver().gps84_To_gcj02(a.lng, a.lat))
        : "bd09" == this.options.corrdType &&
          (f = L.coordConver().gps84_To_bd09(a.lng, a.lat)));
    a = this._map;
    var e = a._animatingZoom
        ? Math.max(a._animateToZoom, a.getZoom())
        : a.getZoom(),
      e = a.getZoomScale(e, this._tileZoom),
      f = a.project(f, this._tileZoom).floor();
    a = a.getSize().divideBy(2 * e);
    return new L.Bounds(f.subtract(a), f.add(a));
  },
});