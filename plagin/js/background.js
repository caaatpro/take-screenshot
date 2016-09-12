// Here chrome.extension.sendMessage

var takeScreenshot = {
    /**
     * @description ID of current tab
     * @type {Number}
     */
    tabId: null,

    /**
     * @description PDF
     * @type {Object}
     */
    doc: null,

    /**
     * @description Canvas element
     * @type {Object}
     */
    screenshotCanvas: null,

    htmlContent: '',

    /**
     * @description 2D context of screenshotCanvas element
     * @type {Object}
     */
    screenshotContext: null,

    /**
     * @description Number of pixels by which to move the screen
     * @type {Number}
     */
    scrollBy: 0,

    /**
     * @description Sizes of page
     * @type {Object}
     */
    size: {
        width: 0,
        height: 0
    },

    /**
     * @description Keep original params of page
     * @type {Object}
     */
    originalParams: {
        overflow: "",
        scrollTop: 0
    },

    /**
     * @description Initialize plugin
     */
    initialize: function() {
        this.screenshotCanvas = document.createElement("canvas");
        this.screenshotContext = this.screenshotCanvas.getContext("2d");

        doc = new jsPDF('l', 'pt', [1024, 768]);

        this.bindEvents();
    },

    /**
     * @description Bind plugin events
     */
    bindEvents: function() {
        // handle chrome requests
        chrome.runtime.onMessage.addListener(function(request, sender, callback) {
            if (request.msg === "setPageDetails") {

                this.size = request.size;
                this.scrollBy = request.scrollBy;
                this.originalParams = request.originalParams;

                this.screenshotCanvas.width = this.size.width;
                this.screenshotCanvas.height = this.size.height;

                this.scrollTo(0);
            } else if (request.msg === "capturePage") {
                this.capturePage(request.position, request.lastCapture);
            } else if (request.msg === "capture") {
                var self = this;
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    self.tabId = tabs[0].id;

                    chrome.tabs.sendMessage(tabs[0].id, {
                        "msg": "getPageDetails"
                    });
                });
            } else if (request.msg === "captureStop") {
/*                var newWindow = window.open();
                newWindow.document.write(this.htmlContent);
                this.htmlContent = "";*/
                doc.save('45.pdf');
            }
        }.bind(this));
    },

    /**
     * @description Send request to scroll page on given position
     * @param {Number} position
     */
    scrollTo: function(position) {
        chrome.tabs.sendMessage(this.tabId, {
            "msg": "scrollPage",
            "size": this.size,
            "scrollBy": this.scrollBy,
            "scrollTo": position
        });
    },

    /**
     * @description Save pdf to file
     */
    saveImg: function() {

        var canvas = document.createElement("canvas");
        var canvasContext = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 768;


        var w = this.screenshotCanvas.width / 2 - 512;

        canvasContext.drawImage(this.screenshotCanvas, w, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

        doc.addPage();
        doc.addImage(canvas.toDataURL("image/jpeg"), 'JPEG', 0, 0, 1024, 768);
    },

    /**
     * @description Takes screenshot of visible area and merges it
     * @param {Number} position
     * @param {Boolean} lastCapture
     */
    capturePage: function(position, lastCapture) {
        var self = this;

        // setTimeout(function () {
        chrome.tabs.captureVisibleTab(null, {
            "format": "png"
        }, function(dataURI) {
            var image = new Image();

            if (typeof dataURI !== "undefined") {
                image.onload = function() {
                    self.screenshotContext.drawImage(image, 0, position);

                    if (lastCapture) {
                        self.saveImg();
                    } else {
                        self.scrollTo(position + self.scrollBy);
                    }
                };

                image.src = dataURI;
            }
        });
        // }, 300);
    }
};


takeScreenshot.initialize();
