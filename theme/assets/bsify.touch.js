var Swipe = function () {
  this.threshold = 5;
  this.xDown = null;                                                        
  this.yDown = null;
  this.add_event_listeners();
};

Swipe.prototype.add_event_listeners = function () {
  var _this = this;
  if (Element.prototype.addEventListener) {
    document.addEventListener('touchstart', function (evt) {
      _this.handleTouchStart(evt);
    }, false);
    document.addEventListener('touchmove', function (evt) {
      _this.handleTouchMove(evt);
    }, false);
  }
};

Swipe.prototype.handleTouchStart = function (evt) {                                         
  this.xDown = evt.touches[0].clientX;                                      
  this.yDown = evt.touches[0].clientY;                                      
};                                                

Swipe.prototype.handleTouchMove = function (evt) {
  if ( ! this.xDown || ! this.yDown ) return;
  
  var current_target = evt.targetTouches[0].target;
  
  var xUp = evt.touches[0].clientX;                                    
  var yUp = evt.touches[0].clientY;
  
  var xDiff = this.xDown - xUp;
  var yDiff = this.yDown - yUp;
  
  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
    if ( xDiff > 0 ) {
      if (xDiff > this.threshold) {
        $(current_target).trigger('swipeLeft');
      }
    } else {
      if (xDiff * -1 > this.threshold) {
        $(current_target).trigger('swipeRight');
      }
    }
  } else {
    if ( yDiff > 0 ) {
      if (yDiff > this.threshold) {
        $(current_target).trigger('swipeUp');
      }
    } else {
      if (yDiff * -1 > this.threshold) {
        $(current_target).trigger('swipeDown');
      }
    }                                                                 
  }
  /* reset values */
  this.xDown = null;
  this.yDown = null;                                             
};

new Swipe();