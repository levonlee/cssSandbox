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
      valSvgViewBox = val.length * perLetter,
      $elContainer = $('.lili-text-container'),
      $elSvg = $('.lili-text-container svg'),
      $elSvgText = $('.lili-text-container svg text');

    $('.lili-text-container svg text').html(val);
    console.log('per letter length: ' + perLetter,
      'new string length: ' + val.length,
      'valSvgViewBox: ' + valSvgViewBox);

    $elSvg.removeAttr('viewBox');
    $elSvg[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');

    // Can't use jQuery width()
    //var svgWidth = $('.lili-text-container svg').width();
    var svgWidth = $elSvg[0].getBoundingClientRect().width;
    var svgTextWidth = $elSvgText[0].getBoundingClientRect().width;
    //var containerWidth = $elContainer.width();
    var containerWidth = $elContainer[0].getBoundingClientRect().width;

    console.log('Before inc loop: svgWidth',svgWidth,
      'svgTextWidth',svgTextWidth,
      'containerWidth',containerWidth,
      'valSvgViewBox',valSvgViewBox);

    var actionInc = 0;
    var actionMax = 10000;
    var actionDec = 0;

    while (svgTextWidth > svgWidth && actionInc < actionMax) {
      ++actionInc;
      valSvgViewBox = valSvgViewBox + .5;

      $elSvg.removeAttr('viewBox');
      $elSvg[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');
      svgWidth = $elSvg[0].getBoundingClientRect().width;
      svgTextWidth = $elSvgText[0].getBoundingClientRect().width;
      containerWidth = $elContainer[0].getBoundingClientRect().width;

      console.log('svgWidth',svgWidth,
        'svgTextWidth',svgTextWidth,
        'containerWidth',containerWidth,
        'valSvgViewBox',valSvgViewBox);
    }

    if (actionInc === 0) {
      console.log('Before dec loop: svgWidth',svgWidth,
        'svgTextWidth',svgTextWidth,
        'containerWidth',containerWidth,
        'valSvgViewBox',valSvgViewBox);

      while (svgTextWidth < svgWidth && actionDec < actionMax) {
        ++actionDec;
        valSvgViewBox = valSvgViewBox - .5;

        $elSvg.removeAttr('viewBox');
        $elSvg[0].setAttribute('viewBox', '0 0 ' + valSvgViewBox + ' 19');
        svgWidth = $elSvg[0].getBoundingClientRect().width;
        svgTextWidth = $elSvgText[0].getBoundingClientRect().width;
        containerWidth = $elContainer[0].getBoundingClientRect().width;

        console.log('svgWidth',svgWidth,'svgTextWidth',svgTextWidth,'containerWidth',containerWidth,'valSvgViewBox',valSvgViewBox);
      }
    }

  }

  $(function() {

    $('.changeText').on('click',ns.changeText);

  });

}($));