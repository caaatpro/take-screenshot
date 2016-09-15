/*jshint evil:true */

// Here chrome.tabs.sendMessage

function capture() {
  return function(result) {
    return new Promise(function(resolve, reject) {
      console.log('capture');
      chrome.extension.sendMessage({
        'msg': 'capture',
        'originalParams': {}
      });
      setTimeout(function () {
        resolve(result);
      }, 1000);
    });
  };
}
function captureStop() {
  return function(result) {
    return new Promise(function(resolve, reject) {
      console.log('captureStop');
      chrome.extension.sendMessage({
        'msg': 'captureStop',
        'originalParams': {}
      });
      resolve(result);
    });
  };
}
function captureStart() {
  return function(result) {
    return new Promise(function(resolve, reject) {
      console.log('captureStart');
      chrome.extension.sendMessage({
        'msg': 'captureStart',
        'originalParams': {}
      });
      resolve(result);
    });
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  switch (request.msg) {
    case 'getPageDetails':
      console.log('getPageDetails');

      var size = {
        width: Math.max(
          document.documentElement.clientWidth,
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth
        ),
        height: Math.max(
          document.documentElement.clientHeight,
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        )
      };

      chrome.extension.sendMessage({
        'msg': 'setPageDetails',
        'size': size,
        'scrollBy': window.innerHeight,
        'originalParams': {
          'overflow': document.querySelector('body').style.overflow,
          'scrollTop': document.documentElement.scrollTop
        }
      });
      break;

    case 'scrollPage':
      console.log('scrollPage');
      var lastCapture = false;

      window.scrollTo(0, request.scrollTo);

      // first scrolling
      if (request.scrollTo === 0) {
        document.querySelector('body').style.overflow = 'hidden';
      }

      // last scrolling
      if (request.size.height <= window.scrollY + request.scrollBy) {
        lastCapture = true;
        request.scrollTo = request.size.height - request.scrollBy;
      }

      chrome.extension.sendMessage({
        'msg': 'capturePage',
        'position': request.scrollTo,
        'lastCapture': lastCapture
      });
      break;

    case 'resetPage':
      console.log('resetPage');
      window.scrollTo(0, request.originalParams.scrollTop);
      document.querySelector('body').style.overflow = request.originalParams.overflow;
      break;

    case 'start':
      console.log('start');
      chrome.storage.sync.get({
        actionFile: ''
      }, function(items) {
        // console.log(items.actionFile);
        if (items.actionFile === '') {
          alert('File is empty');
        } else {
          eval(items.actionFile);
        }
      });

      break;

    case 'log':
      console.log(request.text);

      break;
  }
});
