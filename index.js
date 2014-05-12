var inherit = require('util').inherits;
var EventEmitter = require('EventEmitter');

var defaultTtl = 15000;
var defaultMaxParallel = 5;
var emptyImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

function ImagePreloader() {
	this.urlList = {};
	this.imgList = {};
	this._keyMap = [];

	this.loading = 0;
	this.loaded = 0;
	this.error = 0;
	this.errKeys = [];

	this.ttl = defaultTtl;
	this.maxParallel = defaultMaxParallel;
	this.placeholderImgData = emptyImg;
}

inherit(ImagePreloader, EventEmitter);
module.exports = ImagePreloader;

function loadNext() {
	var that = this;
	var ttlTimeout;
	var processed = false;
	var done = this.loaded + this.error + this.loading;

	// let's not go over the limit
	if (this.loading >= this.maxParallel) {
		return;
	}

	// no more pictures to process
	if (this._keyMap.length <= done) {
		return;
	}

	this.loading++;

	var key = this._keyMap[done];
	var img = this.imgList[key] = new Image();
	var url = this.urlList[key];

	function onLoad() {
		callback();
	}

	function onError() {
		callback('unable to load picture');
	}

	function onTimeout() {
		callback('picture loading timed out');
	}

	function clearTtlTimeout() {
		if (ttlTimeout) {
			clearTimeout(ttlTimeout);
			ttlTimeout = null;
		}
	}

	function callback(err) {
		img.removeEventListener('load', onLoad);
		img.removeEventListener('error', onError);
		img.removeEventListener('abort', onError);
		clearTtlTimeout();

		var toLoad = that._keyMap.length;
		if (!processed) {
			if (err) {
				that.imgList[key].src = that.placeholderImgData;
				that.error++;
				that.errKeys.push(key);
				that.emit('error', {loaded: that.loaded, error: that.error, total: toLoad, errorMsg: err, currentKey: key});
			} else {
				that.loaded++;
				that.emit('loaded', {loaded: that.loaded, error: that.error, total: toLoad, currentKey: key});
			}
			that.loading--;
			processed = true;
		}
		if (that.loaded + that.error === toLoad) {
			that.emit('finished', {loaded: that.loaded, error: that.error, errKeys: that.errKeys, total: toLoad, images: that.imgList});
		} else {
			loadNext.call(that);
		}
	}

	img.addEventListener('load', onLoad, false);
	img.addEventListener('error', onError, false);
	img.addEventListener('abort', onError, false);
	ttlTimeout = setTimeout(onTimeout, this.ttl);

	if (url) {
		img.src = url;
	} else {
		onError();
	}

	loadNext.call(this);
}

ImagePreloader.prototype.add = function (urlList) {
	for (var key in urlList) {
		if (urlList.hasOwnProperty(key)) {
			this.urlList[key] = urlList[key];
		}
	}
};

ImagePreloader.prototype.start = function (options) {
	options = options || {};

	if (options.ttl !== undefined) {
		this.ttl = options.ttl;
	} else {
		this.ttl = defaultTtl;
	}

	if (options.maxParallel !== undefined) {
		this.maxParallel = options.maxParallel;
	} else {
		this.maxParallel = defaultMaxParallel;
	}

	if (options.placeholderImgData !== undefined) {
		this.placeholderImgData = options.placeholderImgData;
	} else {
		this.placeholderImgData = emptyImg;
	}

	this.imgList = {};
	this._keyMap = Object.keys(this.urlList);

	this.loading = 0;
	this.loaded = 0;
	this.error = 0;
	this.errKeys = [];

	loadNext.call(this);
};