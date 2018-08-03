/**
 * Created by Li Li on 2018-08-01.
 */
	//basic illustration of TweenMax's repeat, repeatDelay, yoyo and onRepeat
var box = document.getElementById("greenBox"),
	box2 = document.getElementById("greenBox2"),
	box3 = document.getElementById("greenBox3"),
	count = 0,
	tween,
tween2;

tween = TweenMax.to(box, 2, {left:"700px", repeat:10, yoyo:true, onRepeat:onRepeat, repeatDelay:0.5, ease:Linear.easeNone});
tween2 = TweenMax.to(box2, 2, {x:700, repeat:10, yoyo:true, repeatDelay:0.5, ease:Linear.easeNone});

function onRepeat() {
	count++;
	box.innerHTML = count;
	TweenLite.set(box, {backgroundColor:"hsl(" + Math.random() * 255 + ", 90%, 60%)"});
}

box3.addEventListener('mouseenter', function(event) {
	TweenLite.killTweensOf(box3);
	TweenLite.to(box3, 1, {css:'background-color:red', ease:Sine.easeOut});
});
box3.addEventListener("mouseleave", function(event) {
	TweenLite.killTweensOf(box3);
	TweenLite.to(box3, 1, {css:'background-color:#6fb936', ease:Sine.easeOut});
});
