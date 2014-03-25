ImagePreloader
==============

Preload your images with the ImagePreloader

### Usage example

```javascript
var imagePreloader = new ImagePreloader();
var urlList = {
	whatever1: 'http://domain/path/to/image1.png',
	whatever2: 'http://domain/path/to/image2.png',
	whatever3: 'http://domain/path/to/image3.png',
	whatever4: 'http://domain/path/to/image4.png',
	whatever5: 'http://domain/path/to/image5.png',
	whatever6: 'http://domain/path/to/image6.png'
};
imagePreloader.add(urlList);

var stepCb = function (data) {
	var loaded = data.loaded;
	var error = data.error;
	var total = data.total;
	console.log('loadInProgress: ' + (loaded + error) + '/' + total);
};

var finalCb = function (data) {
	var loaded = data.loaded;
	var error = data.error;
	var total = data.total;
	var images = data.images;
	console.log('All (' + total + ') pictures have been processed. ' + loaded + ' have been loaded and ' + error + ' have not.');
	if (images.whatever1) {
		document.body.appendChild(images.whatever1);
	}
};

imagePreloader.on('error', stepCb);
imagePreloader.on('loaded', stepCb);
imagePreloader.on('finished', finalCb);

var notMandatory = {
	ttl: 5000,
	maxParallel: 3
}
imagePreloader.start(notMandatory);
```