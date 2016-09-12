

var slide;

function toSlide (slideId) {
  return function(result) {
    return new Promise(function(resol, reject) {
      $('#slide-frame').prop('src', 'slide-'+slideId+'.html');
      $('#slide-frame').on('load', function () {
        slide = $('#slide-frame').contents();
        resol(result);
      });
    });
  };
}

function click(el, delay) {
  return function(result) {
    return new Promise(function(resolve, reject) {
      slide.find(el)[0].click();
      setTimeout(function() {
        resolve(result);
      }, delay);
    });
  };
}

function delay(milliseconds) {
  return function(result) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(result);
      }, milliseconds);
    });
  };
}
new Promise(function(resolve, reject) {
  resolve();
})

  // slide-00
  .then(toSlide('00'))
  .then(delay(1000))
  .then(capture())
  .then(click('.foot-note-trigger', 500))
  .then(capture())

  // slide-01
  .then(toSlide('01'))
  .then(delay(3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 0))

/*  .then(click('.tab-2', 3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 0))

  .then(click('.tab-3', 3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 0))

  .then(click('.tab-4', 3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))

  .then(click('.logo', 1500))
  .then(capture())*/
/*
  // slide-02
  .then(toSlide('02'))
  .then(delay(12000))
  .then(capture())

  // slide-03
  .then(toSlide('03'))
  .then(delay(4000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-04
  .then(toSlide('04'))
  .then(delay(3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-05
  .then(toSlide('05'))
  .then(delay(4000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-06
  .then(toSlide('06'))
  .then(delay(4000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-07
  .then(toSlide('07'))
  .then(delay(4000))
  .then(capture())
  .then(click('.accordeon-trigger--two', 3000))
  .then(capture())
  .then(click('.accordeon-trigger--three', 3000))
  .then(capture())

  // slide-08
  .then(toSlide('08'))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))
  .then(click('.control-list .item:nth-child(1)', 1000))
  .then(capture())
  .then(click('.control-list .item:nth-child(2)', 1000))
  .then(capture())
  .then(click('.control-list .item:nth-child(3)', 1000))
  .then(capture())
  .then(click('.control-list .item:nth-child(4)', 1000))
  .then(capture())
  .then(click('.control-list .item:nth-child(5)', 1000))
  .then(capture())
  .then(click('.state-2-link', 1000))
  .then(capture())
  .then(click('.point-1', 1000))
  .then(capture())
  .then(click('.point-2', 1000))
  .then(capture())
  .then(click('.point-3', 1000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-09
  .then(toSlide('09'))
  .then(capture())
  .then(function () {
    window.frames.slideframe.postMessage('less', "*");
  })
  .then(delay(1000))
  .then(capture())
  .then(function () {
    window.frames.slideframe.postMessage('equal', "*");
  })
  .then(delay(1000))
  .then(capture())
  .then(delay(1000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-10
  .then(toSlide('10'))
  .then(delay(12000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-11
  .then(toSlide('11'))
  .then(delay(6000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-12
  .then(toSlide('12'))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-13
  .then(toSlide('13'))
  .then(delay(3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))
  .then(click('.tab-2', 3000))
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-14
  .then(toSlide('14'))
  .then(delay(5000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-15
  .then(toSlide('15'))
  .then(delay(5000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))
  .then(click('.arrow--right', 1000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-17
  .then(toSlide('17'))
  .then(delay(7000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))
  .then(click('.hint-design-icon-action', 3000))
  .then(capture())

  // slide-18
  .then(toSlide('18'))
  .then(delay(6000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-19
  .then(toSlide('19'))
  .then(delay(3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-20
  .then(toSlide('20'))
  .then(delay(5000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-21
  .then(toSlide('21'))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-22
  .then(toSlide('22'))
  .then(delay(3000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-23
  .then(toSlide('23'))
  .then(capture())
  .then(click('.left-side', 1000))
  .then(click('.right-side', 1000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-24
  .then(toSlide('24'))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())
  .then(click('.hint-close', 3000))
  .then(click('.tab-link[data-state="2"]', 1000))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())

  // slide-25
  .then(toSlide('25'))
  .then(capture())
  .then(click('.hint-icon-action', 3000))
  .then(capture())*/


  .then(captureStop())
;
