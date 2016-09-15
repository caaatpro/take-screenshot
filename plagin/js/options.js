function startScreenshot() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      'msg': 'start',
      'originalParams': {}
    });
  });
}

function readSingleFile(evt) {
  var f = evt.target.files[0];

  if (f) {
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;

      chrome.storage.sync.set({
        actionFile: contents
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'File is read.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });
    };
    r.readAsText(f);
  } else {
    alert('Failed to load file');
  }
}
document.getElementById('actionFile').addEventListener('change', readSingleFile, false);
document.getElementById('start').addEventListener('click', startScreenshot);
