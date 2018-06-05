/**
 * Created by Li Li on 2018-06-04.
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

  ns.CbAccordionResponsive = function(e) {
    var $target = $(e.target);
    if ($target.attr('aria-controls')) {
      var $content_target = $target.attr('aria-controls');
      $.each( [ '.lili-accordion-responsive-nav.lili-top [class*="col-"]',
        '.lili-accordion-responsive-nav.lili-bottom [class*="col-"]'], function( i, l ){
        $(l).each(function() {
          var $active = $(this).find('button[aria-controls='+$content_target+']');
          if ($active.length == 0) {
            $(this).removeClass('active');
            $(this).find('button').removeClass('active');
          }
          else {
            $(this).addClass('active');
            $active.addClass('active');
          }
        });
      });

      // show content
      $('.lili-accordion-responsive-content .row > [class*="col-"]').addClass('hidden');
      $('#'+$content_target).removeClass('hidden');
    }
  }

  $(function() {
    $('.lili-accordion-responsive-nav [class*="col-"]').on('click',ns.CbAccordionResponsive);

  });

}($));