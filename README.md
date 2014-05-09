ImagePreloader
==============

ImagePreloader is an image preloader particularly designed to work with canvas.

# Overview

Basically, you provide an object with a list of urls and you get back another object where the urls have been replaced with the corresponding images, ready to be drawn somewhere.

Simple example:

```javascript
var imagePreloader = new ImagePreloader();
var assets = {
	sprite: 'http://domain.whatever.com/assets/sprite1.png',
	background: 'http://domain.whatever.com/assets/bg.png',
	button: 'http://domain.whatever.com/assets/btn.png'
};
imagePreloader.add(assets);
imagePreloader.on('finished', function (data) {
	// the images are in data.images, matching the
	// provided object structure, so you can simply do:
	assets = data.images;
	// and now you have image objects instead of strings, you can for example:
	whateverContext.drawImage(assets.sprite, 0, 0);
});
imagePreloader.start();
```

# In depth

## .start() parameters

You can provide completely optional parameters to the start method:

- `ttl`: the maximum time you want to wait on one image before having the onerror triggered (ms). Default value is 3000ms.
- `maxParallel`: the maximum number of images you want to allow to be loaded in parallel (if you want to avoid something else to be blocked). Default value is 5.
- `placeholderImgData`: what data image you want for failed images. Default is an empty 1x1 transparent png.

Example:
```javascript
imagePreloader.start({
	ttl: 10000,
	maxParallel: 2,
	placeholderImgData: 'data:image/png;base64,iVBORw0KGgo....'
});
```

## events

You can listen for:

### finished

Sent back object contains:

- `loaded`: number of images successfully loaded
- `error`: number of images where loading failed
- `errKeys`: array containing the list of keys who failed
- `images`: object, matching the original urls object structure, where strings have been replaced by images objects

### loaded

Called every-time a picture is successfully loaded, you can use it for progress bars. Sent back object contains:

- `currentKey`: which key have been loaded
- `loaded`: number of images successfully loaded so far
- `error`: number of failed images so far
- `total`: total number of images we are processing

### error

Called every-time a picture fails to load, you can use it for progress bars. Sent back object contains:

- `currentKey`: which key failed
- `loaded`: number of images successfully loaded so far
- `error`: number of failed images so far
- `total`: total number of images we are processing
- errorMsg: string error message