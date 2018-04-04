/**
 * Created by Li Li on 2018-04-04.
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

  ns.toggleFlipCard = function(event) {
    ns.debug(['toggleFlipCard',event.type]);
    var $target = $(event.target);
    ns.debug(['toggleFlipCard:event:target',$target]);

    var $parent = $target;

    if (!$target.hasClass('flip-card-item')) {
      $parent = $target.parents('.flip-card-item').eq(0);
    }

    ns.debug(['toggleFlipCard:parent',$parent]);

    $parent.toggleClass('flipped');

  }

  $(function() {
    $('.flip-card-item').click(ns.toggleFlipCard);
  });

}($));