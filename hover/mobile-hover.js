/**
 * Created by Li Li on 2018-03-15.
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

  ns.meetTheTeamShow = function(event) {
    ns.debug(['meetTheTeamShow',event.type]);
    var $target = $(event.target);
    ns.debug(['meetTheTeamShow:event:target',$target]);
    var iter = 0;
    var itermax = 10;
    var goto = '';
    var $parent = '';

    while (iter < itermax ) {
      if ($target.hasClass('item-thumbnail')) {
        $parent = $target.parents('.item-group');
        $parent = $parent.eq(0);
        ns.debug(['meetTheTeamShow:parent',$parent]);
        ns.debug(['meetTheTeamShow:thumbnail:target',$target]);
        var $thumbnails = $parent.find('.item-group-thumbnails .item-thumbnail');
        goto =$target.index($thumbnails);
        break;
      }
      else {
        $target = $target.parent();
        iter++;
      }
    }
    if (goto !=='') {
      ns.debug(['meetTheTeamShow:goto', goto]);
      var $divContent = $parent.children('.item-group-content').eq(goto);
      var $divThumbnailsContent = $parent.children('.item-group-thumbnails,.item-group-title');
      if (!$parent.hasClass('opened')) {
        // open only when it's not opened
        ns.meetTheTeamHideAll();
        $parent.addClass('opened');
        // the column group might be smaller so set the background color to match the content div color
        // only change for column group has shorter text
        if ($parent.hasClass('item-small')) {
          var $grandParent = $parent.parent();
          $grandParent.addClass('bg-red');
        }
        $divContent.addClass('show');
        $divContent.removeClass('hidden');
      }
    }

  }

  ns.meetTheTeamHide = function(event) {
    ns.debug(['meetTheTeamHide', event.type]);
    var $target = $(event.target);
    ns.debug(['meetTheTeamHide:event:target', $target]);
    var iter = 0;
    var itermax = 10;
    var goto = '';
    var $parent = '';

    while (iter < itermax ) {
      if ($target.hasClass('item-group-content')) {
        $parent = $target.parents('.item-group');
        $parent = $parent.eq(0);
        ns.debug(['meetTheTeamHide:parent', $parent]);
        goto =$target.index($parent.find('.item-group-content'));
        break;
      }
      else {
        $target = $target.parent();
        iter++;
      }
    }
    if (goto !=='') {
      ns.debug(['meetTheTeamHide:goto', goto]);
      var $divContent = $parent.children('.item-group-content').eq(goto);
      var $divThumbnailsContent = $parent.children('.item-group-thumbnails,.item-group-title');
      if ($parent.hasClass('opened')) {
        // close only when it's opened
        $parent.removeClass('opened');
        $divContent.removeClass('show');
        $divContent.addClass('hidden');
      }
    }

  }

  ns.meetTheTeamEventHideAll = function(event) {
    ns.debug(['meetTheTeamEventHideAll',event.type]);
    event.stopPropagation();
    ns.meetTheTeamHideAll();
  }

  ns.meetTheTeamHideAll = function() {
    var $allContent = $('.lili-ex-3 .row .item-group .item-group-content');
    var $allParents = $('.lili-ex-3 .row .item-group');
    $allParents.removeClass('opened');
    var $grandParents = $allParents.parent();
    $grandParents.removeClass('bg-red');
    $allContent.removeClass('show');
    $allContent.addClass('hidden');
  }

  $(function() {
    if (!Modernizr.touchevents) {
      // for non touch screen device, hide the close button
      //$('.lili-ex-3 .row .item-group .item-group-content .lili-close').hide();
    }
    var showEvents = 'click touchstart mouseenter mouseleave';
    showEvents = 'click touchstart';
    $('.lili-ex-3 .row .item-group .item-group-thumbnails .item-thumbnail').on(showEvents,ns.meetTheTeamShow);
    //$('.lili-ex-3 .row .item-group .item-group-content').on('mouseleave',ns.meetTheTeamHide);
    $('.lili-ex-3 .row .item-group .item-group-content .lili-close').on('click touchstart',ns.meetTheTeamEventHideAll);

  });

}($));