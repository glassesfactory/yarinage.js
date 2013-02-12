/*
  msgpack yari tori suru
*/

var Yarinage;

Yarinage = (function() {

  Yarinage.prototype.xhr = null;

  Yarinage.prototype.success = null;

  Yarinage.prototype.error = null;

  function Yarinage(options) {
    this.success = options && options.success ? options.success : null;
    this.error = options && options.error ? options.error : null;
  }

  Yarinage.prototype.load = function(url, options) {
    var async, contentType, method,
      _this = this;
    method = options && options.method ? options.method : 'GET';
    contentType = options && options.contentType ? options.contentType : 'application/x-msgpack';
    async = options && options.async ? options.async : true;
    this.success = options && options.success ? options.success : this.success;
    this.error = options && options.error ? options.error : this.error;
    this.xhr = this._setupXHR(method, url, async, true);
    this.xhr.onreadystatechange = function() {
      var rv;
      if (_this.xhr.readyState === 4 && (_this.xhr.status === 200 || _this.xhr.status === 304)) {
        if (_this.success) {
          rv = msgpack.unpack(new Uint8Array(_this.xhr.response));
          return _this.success.apply(_this, [rv]);
        }
      } else if (_this.xhr.readyState === 4 && _this.xhr.status !== 200) {
        if (_this.error) {
          return _this.error.apply(_this, _this.xhr);
        }
      } else if (_this.xhr.readyState === 4) {
        if (_this.xhr.status === 400) {
          return _this.error.apply(_this, _this.xhr);
        }
      }
    };
    return this.xhr.send();
  };

  Yarinage.prototype.upload = function(url, data, options) {
    var async, buffer, contentType, method, packed;
    method = options && options.method ? options.method : 'POST';
    contentType = options && options.contentType ? options.contentType : 'application/x-msgpack; charset=x-user-defined';
    async = options && options.async ? options.async : true;
    this.success = options && options.success ? options.success : this.success;
    this.error = options && options.error ? options.error : this.error;
    packed = msgpack.pack(data);
    buffer = new Uint8Array(packed).buffer;
    this.xhr = this._setupXHR(method, url, async);
    if (options && options.responseType) {
      this.xhr.responseType = options.responseType;
    }
    this.xhr.setRequestHeader('Content-Type', contentType);
    this.xhr.send(buffer);
    return this.xhr;
  };

  Yarinage.prototype._setupXHR = function(method, url, async, load) {
    var xhr,
      _this = this;
    xhr = this._createXHR();
    if (xhr === null) {
      throw new Error('your browser だめぽ');
    }
    xhr.open(method, url, async);
    if (load === true) {
      xhr.responseType = 'arraybuffer';
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
        if (_this.success) {
          return _this.success.apply(_this, [xhr.response]);
        }
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        if (_this.error) {
          return _this.error.apply(_this, [xhr]);
        }
      } else if (xhr.readyState === 4) {
        if (xhr.status === 400) {
          return _this.error.apply(_this, [xhr]);
        }
      } else if (xhr.readyState === 3 && xhr.status === 400) {
        return _this.error.apply(_this, [xhr]);
      }
    };
    return xhr;
  };

  Yarinage.prototype._createXHR = function() {
    if (window.ActiveXObject) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          return null;
        }
      }
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      return null;
    }
  };

  Yarinage.prototype.destory = function() {
    this.xhr = null;
    this.success = null;
    return this.error = null;
  };

  return Yarinage;

})();
