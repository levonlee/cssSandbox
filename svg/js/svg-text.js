/**
 * Created by Li Li on 2018-07-18.
 */
(function($) {
  this.myApp = this.myApp || {};

  var ns = this.myApp;

  ns.debugState = true;

  ns.debug = function() {
    if (ns.debugState) {
      for (var i=0; i<arguments.length; i++) {
        console.log(arguments[i]);
      }
    }
  }

  ns.setViewbox = function($el, $v) {
    //$el.removeAttr('viewBox'); // Hard lesson.. Don't remove and change.. just set it
    $el[0].setAttribute('viewBox', '0 0 ' + $v + ' 19');
  }

  ns.cbCustomText = function(e) {
    var $target = $(e.target);
    ns.changeText($target.val())
  }

  ns.cbSelectionText = function(e) {
    var $elCustomText = $('#lili-custom-text'),
        $target = $(e.target),
        val = $target.text();
    $elCustomText.val(val);
    ns.changeText(val);
  }

  ns.changeText = function(val) {
    var oldLength = 6, // 'Fit Me' length = 6
      oldSvgViewBox = 45, // <svg viewBox="0 0 45 18">
      perLetter =  oldSvgViewBox / oldLength,
      valSvgViewBox = val.length * perLetter,
      $elContainer = $('.lili-text-container'),
      $elSvg = $('.lili-text-container svg'),
      $elSvgText = $('.lili-text-container svg text'),
      $elCustomText = $('#lili-custom-text');

    $elContainer.removeClass('lili-text-container-transform');

    //$elCustomText.val(val);
    $elSvgText.text(val); // .html(val) does not work on IE11
    ns.setViewbox($elSvg,valSvgViewBox);

    ns.debug('per letter length: ' + perLetter,
      'new string length: ' + val.length,
      'valSvgViewBox: ' + valSvgViewBox);

    // Can't use jQuery width()
    //var svgWidth = $('.lili-text-container svg').width();
    var svgWidth = $elSvg[0].getBoundingClientRect().width,
      svgTextWidth = $elSvgText[0].getBoundingClientRect().width,
      //containerWidth = $elContainer.width();
      containerWidth = $elContainer[0].getBoundingClientRect().width;

    ns.debug('Before inc loop: svgWidth',svgWidth,
      'svgTextWidth',svgTextWidth,
      'containerWidth',containerWidth,
      'valSvgViewBox',valSvgViewBox);

    var actionInc = 0,
      actionMax = 1000,
      actionDec = 0,
      actionStep = 1;

    while ((svgTextWidth > svgWidth) && (actionInc < actionMax)) {
      ++actionInc;
      valSvgViewBox = valSvgViewBox + actionStep;

      ns.setViewbox($elSvg,valSvgViewBox);

      svgWidth = $elSvg[0].getBoundingClientRect().width;
      svgTextWidth = $elSvgText[0].getBoundingClientRect().width;
      containerWidth = $elContainer[0].getBoundingClientRect().width;
    }

    ns.debug('After inc loop of '+ actionInc + ' times: svgWidth',svgWidth, 'svgTextWidth',svgTextWidth, 'containerWidth',containerWidth, 'valSvgViewBox',valSvgViewBox);

    if (actionInc === 0) {
      ns.debug('Before dec loop: svgWidth',svgWidth,
        'svgTextWidth',svgTextWidth,
        'containerWidth',containerWidth,
        'valSvgViewBox',valSvgViewBox);

      while ((svgTextWidth < svgWidth) && (actionDec < actionMax)) {
        ++actionDec;
        valSvgViewBox = valSvgViewBox - actionStep;

        ns.setViewbox($elSvg,valSvgViewBox);

        svgWidth = $elSvg[0].getBoundingClientRect().width;
        svgTextWidth = $elSvgText[0].getBoundingClientRect().width;
        containerWidth = $elContainer[0].getBoundingClientRect().width;
      }
      ns.debug('After dec loop of '+ actionDec + ' times: svgWidth',svgWidth, 'svgTextWidth',svgTextWidth, 'containerWidth',containerWidth, 'valSvgViewBox',valSvgViewBox);
    }

    $elContainer.addClass('lili-text-container-transform');

  }

  $(function() {

    $('.changeText').on('click',ns.cbSelectionText);
    $('#lili-custom-text').on('change keyup paste', ns.cbCustomText);

  });

}($));