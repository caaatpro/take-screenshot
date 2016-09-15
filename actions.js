/* Example File for plagin take-screenshot */
/* global capture, chrome, captureStart, captureStop */
/* jshint strict: false */

var slide;

function toSlide (slideId) {
  return function(result) {
    return new Promise(function(resol) {
      $('#slide-frame').prop('src', 'slide-'+slideId+'.html');
      $('#slide-frame').on('load', function () {
        slide = $('#slide-frame').contents();
        resol(result);
      });

      // set slide name
      chrome.extension.sendMessage({
        'msg': 'slidename',
        'slide': 'slide-'+slideId,
        'originalParams': {}
      });
    });
  };
}

function click(el, delay) {
  return function(result) {
    return new Promise(function(resolve) {
      slide.find(el)[0].click();
      setTimeout(function() {
        resolve(result);
      }, delay);
    });
  };
}

function delay(milliseconds) {
  return function(result) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(result);
      }, milliseconds);
    });
  };
}
new Promise(function(resolve) {
  resolve();
})

  .then(captureStart())

  // slide-00
  .then(toSlide('00'))
  .then(delay(1000))
  .then(capture())

  // slide-01
  .then(toSlide('01'))
  .then(delay(2000))
  .then(capture())
  .then(click('.re_notes__trigger', 500))
  .then(capture())
  .then(click('.re_notes__trigger', 500))
  .then(click('.js-instruction-trigger', 1000))
  .then(capture())

  // slide-02
  .then(toSlide('02'))
  .then(delay(3000))
  .then(capture())
  .then(click('.re_notes__trigger', 500))
  .then(capture())


  .then(captureStop())
;
