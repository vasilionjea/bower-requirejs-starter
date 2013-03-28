# Bower - RequireJS starter template

A RequireJS starter template with the Bower package manager for medium to large size projects.

Note: 
If you have no idea what this is, this short video will get you started: http://goo.gl/XIwt9

## Tools
Tools that are used include:
- [Bower](https://github.com/twitter/bower) for package management
- [RequireJS](http://requirejs.org) for module loading/dependency management
- A bash file for deploying with the RequireJS optimizer and for some cleanup

Bower & RequireJS must be installed globaly via NPM like so:

    sudo npm install -g bower requirejs

Note: 
If you want to verify that they were installed, you can check via the following commands after restarting the Terminal.app/iTerm.app:

    which bower #=> /usr/local/bin/bower
    which r.js  #=> /usr/local/bin/r.js



## Bower
- The `directory:` key in the `.bowerrc` file tells Bower where to install "packages"
- The `component.json` file under the app's root directory tells Bower what dependencies our applicaiton has so we can install them all with one command like so: `bower install`. By specifying `null` for a version, we're asking for the latest version of that lib... I think!
 


## RequireJS
The only srcipt tag that we add explicitly in the page is the following:

    <script src="js/vendor/require.js" data-main="js/app.js"></script>



## Build Process/Deployment
_"RequireJS includes [an optimization tool](http://requirejs.org/docs/optimization.html)
you can run as part of your packaging steps for deploying your code. The optimization 
tool can combine and minify your JavaScript files to allow for better performance."_

Make sure that the `build.sh` file has the right permissions. If not change permissions with the following:

    chmod +x build.sh

Once you're in the directory where the `.sh` file is, run the build file like so:

    ./build.sh
