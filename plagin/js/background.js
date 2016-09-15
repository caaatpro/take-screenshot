// Here chrome.extension.sendMessage

var takeScreenshot = {
    /**
     * @description ID of current tab
     * @type {Number}
     */
    tabId: null,

    winId: null,

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
        overflow: '',
        scrollTop: 0
    },

    newWin: null,

    zip: null,

    slide: null,

    slides: [],

    /**
     * @description Initialize plugin
     */
    initialize: function() {
        this.bindEvents();
    },

    /**
     * @description Bind plugin events
     */
    bindEvents: function() {
        // handle chrome requests
        chrome.runtime.onMessage.addListener(function(request, sender, callback) {
            if (request.msg === 'setPageDetails') {

                this.size = request.size;
                this.scrollBy = request.scrollBy;
                this.originalParams = request.originalParams;

                this.screenshotCanvas.width = this.size.width;
                this.screenshotCanvas.height = this.size.height;

                this.scrollTo(0);
            } else if (request.msg === 'capturePage') {
                this.capturePage(request.position, request.lastCapture);
            } else if (request.msg === 'capture') {
                chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
                chrome.browserAction.setBadgeText({
                    text: this.slide.replace('slide-', '')
                });

                chrome.tabs.sendMessage(this.tabId, {
                    'msg': 'getPageDetails'
                });
            } else if (request.msg === 'captureStop') {

                var pdf = this.doc.output('blob');

                this.zip.file('slides.pdf', pdf, {binary: true});

                this.zip.generateAsync({type:'blob'})
                .then(function(content) {
                    saveAs(content, 'thumbnails.zip');
                });
            } else if (request.msg === 'slidename') {
                this.slide = request.slide;
            } else if (request.msg === 'captureStart') {
                this.screenshotCanvas = document.createElement('canvas');
                this.screenshotContext = this.screenshotCanvas.getContext('2d');

                this.doc = new jsPDF('l', 'pt', [1024, 768], 'NONE');
                this.doc.deletePage(1);

                // newWin = window.open('about:blank', 'status', 'width=200,height=400');

                this.zip = new JSZip();

                this.slides = [];

                var self = this;
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    self.tabId = tabs[0].id;
                });
                chrome.windows.getCurrent(function(win) {
                    self.winId = win.id;
                });
            }
        }.bind(this));
    },

    /**
     * @description Send request to scroll page on given position
     * @param {Number} position
     */
    scrollTo: function(position) {
        chrome.tabs.sendMessage(this.tabId, {
            'msg': 'scrollPage',
            'size': this.size,
            'scrollBy': this.scrollBy,
            'scrollTo': position
        });
    },

    /**
     * @description Save pdf to file
     */
    saveImg: function() {

        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 768;


        var w = this.screenshotCanvas.width / 2 - 512;

        canvasContext.drawImage(this.screenshotCanvas, w, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

        // newWin.document.write('<img src=''+canvas.toDataURL('image/jpeg')+''>');

        this.doc.addPage();
        this.doc.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, canvas.width, canvas.height);

        if (this.slides.indexOf(this.slide) === -1) {
            canvas.width = 200;
            canvas.height = 150;
            canvasContext.drawImage(this.screenshotCanvas, w, 0, 1024, 768, 0, 0, 200, 150);

            var data = canvas.toDataURL('image/jpeg', 1.0);
            data = data.substr(data.indexOf(',')+1);

            this.zip.file(this.slide+'.jpg', data, {base64: true});
            this.slides.push(this.slide);
        }
    },

    /**
     * @description Takes screenshot of visible area and merges it
     * @param {Number} position
     * @param {Boolean} lastCapture
     */
    capturePage: function(position, lastCapture) {
        var self = this;

        chrome.tabs.captureVisibleTab(self.winId, {
            'format': 'png'
        }, function(dataURI) {
            var image = new Image();

            if (typeof dataURI !== 'undefined') {
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
    }
};


takeScreenshot.initialize();
