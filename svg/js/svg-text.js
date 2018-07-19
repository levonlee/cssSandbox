/**
 * Created by Li Li on 2018-07-18.
 */
(function($) {
  this.myApp = this.myApp || {};

  var ns = this.myApp;

  ns.debugState = true;

  ns.debug = function(msg) {
    if (ns.debugState) {
      console.log(msg);
    }
  }

  ns.changeText = function(event) {
    var $target = $(event.target),
      oldLength = 6, // 'Fit Me' length = 6
      oldSvgViewBox = 45, // <svg viewBox="0 0 45 18">
      perLetter =  oldSvgViewBox / oldLength,
      val = $target.text(),
      valSvgViewBox = val.length * perLetter;
    $('.lili-text-container svg text').html(val);
    console.log('per letter length: ' + perLetter);
    console.log('new string length: ' + val.length);
    console.log('valSvgViewBox: ' + valSvgViewBox);

    $('.lili-text-container svg').removeAttr('viewBox');
    $('.lili-text-container svg')[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');

    var svgWidth = $('.lili-text-container svg').width();
    var svgTextWidth = $('.lili-text-container svg text')[0].getBoundingClientRect().width;
    var containerWidth = $('.lili-text-container').width();

    console.log('Before inc loop: svgWidth',svgWidth,'svgTextWidth',svgTextWidth,'containerWidth',containerWidth);

    var actionInc = 0;
    var actionDec = 0;

    while (svgTextWidth > svgWidth && actionInc < 100) {
      ++actionInc;
      ++valSvgViewBox;
      $('.lili-text-container svg').removeAttr('viewBox');
      $('.lili-text-container svg')[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');
      svgWidth = $('.lili-text-container svg').width();
      svgTextWidth = $('.lili-text-container svg text')[0].getBoundingClientRect().width;
      containerWidth = $('.lili-text-container').width();
      console.log('svgWidth',svgWidth,'svgTextWidth',svgTextWidth,'containerWidth',containerWidth);
    }

    if (actionInc === 0) {
      console.log('Before dec loop: svgWidth',svgWidth,'svgTextWidth',svgTextWidth,'containerWidth',containerWidth);
      while (svgTextWidth < svgWidth && actionDec < 100) {
        ++actionDec;
        --valSvgViewBox;
        $('.lili-text-container svg').removeAttr('viewBox');
        $('.lili-text-container svg')[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');
        svgWidth = $('.lili-text-container svg').width();
        svgTextWidth = $('.lili-text-container svg text')[0].getBoundingClientRect().width;
        containerWidth = $('.lili-text-container').width();
        console.log('svgWidth',svgWidth,'svgTextWidth',svgTextWidth,'containerWidth',containerWidth);
      }
    }

  }

  $(function() {

    $('.changeText').on('click',ns.changeText);

  });

}($));