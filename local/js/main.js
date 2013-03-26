// Set up paths and dependencies of modules, libs, & plugins that will be used throughout the app
require.config({
    /*
     * Never include a ".js" extension since the paths config could be for a directory
     */
	paths: {
        // Vendors
        'jquery': 'vendor/jquery/jquery',
        'underscore': 'vendor/underscore/underscore',
        'backbone': 'vendor/backbone/backbone',

		// Paths for jQuery plugins
		'jquery.winPop': 'plugins/jquery.winPop',

        // The JS app directory
        'app': 'app/'
	},


    /*
     * Non-AMD scripts that have a single global object
     */
	shim: {
        'backbone': {
            // These dependencies should be loaded before loading backbone.js
            deps: ['underscore', 'jquery'],
            // Backbone's global namespace
            exports: 'Backbone'
        },

		'underscore': {
			exports: '_'
		},

		// Loading a jQuery Plugins
        'jquery.winPop': {
            deps: ['jquery']
        }
	}
});


// Start the main app logic
requirejs(['jquery', 'app/person', 'backbone', 'underscore', 'jquery.winPop'], function($, Person, Backbone, _, winPop) {
    // All vendor libs are loaded and can be used here now...
    console.log('jQuery: ', $);
    console.log('Backbone: ', Backbone);
    console.log('Underscore: ', _);

    // The person module is available as well
    (new Person('Joe', 'Doe')).sayHello().sayHolla();

    // The jQuery plugin is available too: $('#elem').winPop({...options...});
    console.log('winPop: ', jQuery.fn.winPop);
});