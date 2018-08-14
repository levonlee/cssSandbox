$(function() {
	var $owl1 = $('#lili-ex-1');
	$owl1.owlCarousel({
		loop:true,
		margin:10,
		nav:false,
		dots:false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:3 // 600/3 = 200 per item
			},
			1000:{
				items:5 // 1000/5 = 200 per item
			}
		},
		autoplay:true, // default false
		autoplayTimeout:1000, // default 5000
		autoplayHoverPause:true // default false
	});
	$('.lili-play').on('click',function(){
		$owl1.trigger('play.owl.autoplay',[1000]);
	})
	$('.lili-stop').on('click',function(){
		$owl1.trigger('stop.owl.autoplay');
	})
	var $owl2 = $('#lili-ex-2');
	$owl2.owlCarousel({
		loop:true,
		margin:10,
		nav:false,
		dots:false,
		items:1,
		autoplay:true, // default false
		autoplayTimeout:1000, // default 5000
		autoplayHoverPause:true // default false
	});
	$('.lili-play-2').on('click',function(){
		$owl2.trigger('play.owl.autoplay',[1000]);
	})
	$('.lili-stop-2').on('click',function(){
		$owl2.trigger('stop.owl.autoplay');
	})
});