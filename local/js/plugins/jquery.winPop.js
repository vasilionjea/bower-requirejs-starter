/* Name: winPop
 * Description: Creates a Popup window with specific HTML & CSS, or a Web page from a URL
 * Author: Billy Onjea (github.com/vasilionjea)
 * License: Same as jQuery
 */
;(function ($, window, undefined) {
	"use strict";

	/* Default Settings */
	var defaults = {
		/*
		 * Popup Size
		 */
		width: 600,
		height: 400,


		/*
		 * Popup Positioning
		 */
		top: 0,
		left: 0,

		// Centers popup in relation to the Browser (IE Note: Works in IE9 and up) - overrides top & left
		center: true,


		/*
		 * Popup Meta
		 */
		title: 'Untitled Document', // Popup document title
		name: 'newWindow', // Popup name (no spaces are allowed)


		/*
		 * Popup Contents
		 */
		// The stuff that goes between <head></head> in the popup's document
		head: '',

		/* The stuff that goes between <body></body> in the new window's document
		 * TODO: Allow for these different methods to add content to the window's document
		 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		 * { IMPLEMENTED }
		 * [0] If the body option isn't set by user (in this case it is an object by default),
		 * then grab the innerHTML of the element that called winPop.
		 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		 * { IMPLEMENTED }
		 * [1] If the body option is set by user and is an object, see if we have an
		 * elem property, and if so, get that element's innerHTML/outerHTML -or- the
		 * innerText depending on the method prop - and fallback to step 0.
		 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		 * { NOT IMPLEMENTED YET }
		 * [2] If the body option is set by the user and it is a string, check if the
		 * string is a valid URL. If valid, the popup's location is changed to the
		 * provided URL & unrelated props are ignored.
		 *
		 * NOTE: if the node that called winPop is an <a> tag, we don't retrieve
		 * the HREF and substitute it for the URL because the anchor's inner-content
		 * might have been the intended content for the Popup. Instead you must 
		 * provide the URL as a string explicitly -or- by retrieving the HREF on
		 * your own like this: 
		 *     $('a.linkPopup').attr('href');
		 *     $('a[href="http://www.google.com/"]').attr('href');
		 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		*/
		// The default body options if body isn't set by user
		body: {
			elem: '',
			method: 'html'
		},       


		/*
		 * Events
		 */
		// The event that pops up the window	
		eventName: 'click',

		// An element that triggers the event. If not provided the element that called winPop triggers the [eventName] event
		delegateElem : '',


		/*
		 * Callbacks 
		 */
		// Runs before setting the popup props & before opening the popup - Gives access to the options object
		callBefore: undefined,

		// Runs after the popup has been opened - Gives access to the new popup window object
		callAfter: undefined
	};

	//= Browser window wrapper/constructor
	///////////////////////////////////////////////////////////////////////////////
	var _Window = function (name, props, doc) {
		this.name = name;
		this.props = props;

		// the '_Window._document' object
		this._document = doc;

		// The actual browser window
		this.browser = null;

		this.init();
	};

	// _Window Prototype
	$.extend(_Window.prototype, {
		init: function () {
			this.renderDocument();
		},

		renderDocument: function () {
			// ~ TODO ~
			// Q: Which one is faster? Array join -OR- String concatenation?
			// A: [http://jsperf.com/reddit-array-join-vs-string-concatenation/2] 
			///// [http://jsperf.com/string-plus-concat-vs-array-join]
			this._document.contents = [
				'<!doctype html>\n',
				'<html lang="en">\n',
					'<head>\n',
						'<title>' + this._document._title + '</title>\n',
						this._document._head + '\n',
					'</head>\n',

					'<body>\n',
						this._document._body + '\n',
					'</body>\n',
				'</html>\n'
			].join('');
		},

		/* Two major things happen here:
		 * [1] The 'browser' property is populated with an actual browser window, and a new 
		 * browser window is opened (closing the previous one first)
		 *
		 * [2] The browser window document is filled with the contents from the _document object
		 */
		openWindow: function () {
			var browserWinDoc;

			// Close old browser window first before opening this one
			if (this.browser !== null) {
				this.browser.close();

				// Closing a window doesn't remove the Window object, so we're forcing the browser prop back to null
				this.browser = null;
			}

			this.browser = window.open('', this.name, this.props);
			this.browser.focus();

			browserWinDoc = this.browser.document;

			browserWinDoc.open();
			browserWinDoc.write(this._document.contents);
			browserWinDoc.close();
		}
	});

	//= Popup constructor
	///////////////////////////////////////////////////////////////////////////////
	var Popup = function (triggerElem, opts) {
		// The element that initiated the Popup - TODO: Change to 'el' & $el
		this.trigger = triggerElem;
		this.$trigger = $(triggerElem);

		// Merge defaults with user options, but keep defaults untouched
		this.options = $.extend({}, defaults, opts);
	};

	// Popup Prototype
	$.extend(Popup.prototype, {
		init: function () {
			this.render();
			this.hookEvents();
		},

		render: function () {
			var winProps, winBody = '';

			// Let the callback do its thing first
			this.callBeforeOpen();

			// Window properties
			winProps = this.setWinProps();

			// When the body option is an object
			if ($.type(this.options.body) === "object") {
				winBody = this.fromBodyObject();
			}

			// Get a new window passing its options
			this._window = this.createWindow({
				name: this.options.name,
				props: winProps,
				title: this.options.title,
				head: this.options.head,
				body: winBody
			});
		},

		setWinProps: function () {
			var winProps = '';

			// Center popup window in relation to the Browser
			if (this.options.center === true && ('outerWidth' in window)) {
				this.options.left = (window.outerWidth / 2) - (this.options.width / 2);
				this.options.top = (window.outerHeight / 2) - (this.options.height / 2);
			}

			winProps  = "width=" + this.options.width;
			winProps += ",height=" + this.options.height;
			winProps += ",left=" + this.options.left;
			winProps += ",top=" + this.options.top;

			return winProps;		
		},

		fromBodyObject: function () {
			var $providedElem, winBody = '', elemContents = '';
			var body_options = this.options.body;

			// Let's figure out where we're going to get our popup content from
			var providedElem = body_options.elem;
			var providedMethod = (body_options.method && body_options.method.toLowerCase()) || defaults.body.method;			
			var allowedMethod = (providedMethod === 'outerhtml' || providedMethod === 'html' || providedMethod === 'text');

			// Small util to avoid DRY
			var getElemContents = function ($el) {
				// Allow only html() & text() methods to be called
				if (!allowedMethod) { throw new Error(providedMethod + ' isn\'t a valid option. Please choose between html & text.'); }

				var elcontent = '';

				if (providedMethod === 'outerhtml') {
					// Wrap a temporary element so we can retrieve the outer html of this element
					// We can't just use parent() because other siblings will be included in parent's html
					elcontent = $el.wrap('<div />').parent().html();

					// Remove the wrapper once done
					$el.unwrap('<div />');
				}

				if (providedMethod === 'html') {
					elcontent = $el.html();
				}

				if (providedMethod === 'text') {
					elcontent = $el.text();
				}

				return elcontent;
			};

			// Procceed if an element was provided (used when we want the content of a specific element)
			if (providedElem) {
				$providedElem = this.$trigger.find(providedElem);

				// If the provided element isn't a child of trigger look in the whole document
				if ($providedElem.length === 0) {
					// This would work well if the $(providedElem) is an #ID, but not so well
					// for element & class selectors because it would grab everything in the
					// page that matches those selectors (probably not what you intended)
					$providedElem = $(providedElem); 
				}

				// Assume that $providedElem contains node(s) and move on
				$providedElem.each(function () {
					elemContents = getElemContents($(this));

					if (elemContents) {
						winBody += elemContents;
					}
				});
			} else {
				// If an element wasn't provided, but the body option is still an object use the
				// trigger's outerHTML, HTML, or TEXT as the default value for the popup content
				winBody = getElemContents(this.$trigger);
			}

			return winBody;
		},

		// Returns an instance of the _Window object with the chosen properties
		createWindow: function (win) {
			// Creates a new window for this Popup
			var newWindow = new _Window(win.name, win.props, {
				_title: win.title,
				_head: win.head,
				_body: win.body
			});

			return newWindow;
		},

		// The event that opens the Popup window ('click' is recommended... don't be malicious!)
		hookEvents: function () {
			var popup = this;

			popup.$trigger.on(popup.options.eventName, (popup.options.delegateElem || popup.$trigger), function (e) {
				e.preventDefault();
				popup.open();
			});
		},

		// Allows for modifications to the options object via a callback
		callBeforeOpen: function () {
			if (this.options.callBefore && $.isFunction(this.options.callBefore)) {
				this.options.callBefore(this.options);
			}
		},

		// The actual Browser window is opened by the _window.openWindow() method
		open: function () {
			this._window.openWindow();

			// Once opened let this callback do its thing
			this.callAfterOpen();
		},

		// Gives access to the Browser window via a callback 
		// (could be used to attach more things to its document, move it, close it...)
		callAfterOpen: function () {
			if (this.options.callAfter && $.isFunction(this.options.callAfter)) {
				this.options.callAfter(this._window.browser);
			}
		}
	});

	$.fn.winPop = function (opts, method) {
		return this.each(function () {
			// Create & Initialize
			(new Popup(this, opts)).init();
		});
	};
}(jQuery, window));