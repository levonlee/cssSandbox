/**
 * Created by Li Li on 2018-07-25.
 */

var cbGeneral = function(ev) {
	// Event object: http://hammerjs.github.io/api/#event-object
	var r = ev.type +" gesture detected."
	event.target.textContent = r;
	console.log(r);
	console.log('ev.distance', ev.distance); // the first event happens at pan.threshold and events continue to be emitted every single pan
	//console.log(ev.scale);
	console.log('ev.deltaX',ev.deltaX); // distance^2 = deltaX^2 + deltaY^2
	console.log('ev.deltaY',ev.deltaY);
	console.log('ev.isFirst',ev.isFirst);

}

var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// let the pan gesture support all directions.
// this will block the vertical scrolling on a touch-device while on the element
//mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
//mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

// listen to events...
mc.on("panleft panright panup pandown tap press", cbGeneral);

// https://cdn.rawgit.com/hammerjs/hammer.js/master/tests/manual/visual.html
var myElement2 = document.getElementById('myElement2');

// create a Manager which contains all recognizer instances
var mc2 = new Hammer.Manager(myElement2);

// Add one recognizer at a time
mc2.add(new Hammer.Pan({
	threshold: 70, // 10
	pointers: 1, // 1
	direction: Hammer.DIRECTION_ALL })
);

mc2.add(new Hammer.Swipe({
	direction: Hammer.DIRECTION_VERTICAL
})).recognizeWith(mc2.get('pan'));

mc2.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc2.get('pan'));
mc2.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc2.get('pan'), mc2.get('rotate')]);

var mcRecTap1 = new Hammer.Tap({ event: 'doubletap', taps: 2 }),
	mcRecTap2 = new Hammer.Tap();

//mc2.add(mcRecTap1);
mc2.add([mcRecTap1, mcRecTap2]);

// may later remove a recognizer
// mc2.remove(mcRecTap);
// mc2.remove([mcRecTap1, mcRecTap2]);

mc2.on("pan panstart panmove panend pancancel panleft panright panup pandown", cbGeneral);
//mc2.on("panleft", cbGeneral);

//mc2.on("rotatestart rotatemove", cbGeneral);
//mc2.on("pinchstart pinchmove", cbGeneral);
//mc2.on("swipe", cbGeneral);
//mc2.on("swipeup", cbGeneral); //
//mc2.on("tap", cbGeneral);
//mc2.on("doubletap", cbGeneral);

var gThreshold = 70;
var gsDistance = 0;
var gsStep = 0;
var gs360X = 0; // first image
var gs360XTemp = 0; // first image
var g360XMax = 3; // +3 or -3

var fReturnValueInBoundary = function(v, min, max) {
	if (v < min) {
		return min;
	}
	if (v > max) {
		return max;
	}
	return v;
}

var cbChangePicture = function(s) {
	gs360XTemp = fReturnValueInBoundary(gs360X + s, -g360XMax, g360XMax);
	myElement3.src = 'http://via.placeholder.com/300x250/?text=300x250x' + gs360XTemp;
}

var cbPanX = function(e) {
	if (e.type === 'panend') {
		console.log(e.type);
		console.log('old gs360X',gs360X);
		gs360X = gs360XTemp;
		console.log('new gs360X',gs360X);
		gsDistance = gsStep = 0;
	}
	else {
		var step = parseInt(e.deltaX/gThreshold);
		if (step !==gsStep) {
			gsStep = step;
			console.log('gsStep is changed',gsStep);
			cbChangePicture(gsStep);
		}
	}
}

var myElement3 = document.getElementById('myElement3'),
	mc3 = new Hammer.Manager(myElement3);
mc3.add(new Hammer.Pan({
	threshold: gThreshold,
	direction: Hammer.DIRECTION_ALL })
);
//mc3.on("panstart panleft panright panup pandown pancancel panend", cbGeneral);
mc3.on("panstart panleft panright panup pandown pancancel panend", cbPanX);