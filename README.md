# Bower - RequireJS starter template

A RequireJS starter template with the Bower package manager for medium to large size projects.
NOTE: *** If you have no idea what this is watch this short video: http://goo.gl/XIwt9 ***

## Tools
Tools that are used include:
[1] Bower for package manager
[2] Require js for module loading/dependency management
[3] A bash file for deploying with the RequireJS optimizer and for some cleanup

Bower & RequireJS must be installed globaly via NPM like so:
`sudo npm install -g bower requirejs`

NOTE: If you want to verify that they were installed, you can check via the following commands:
`which bower # => /usr/local/bin/bower`
`which r.js  # => /usr/local/bin/r.js`


## BOWER
[1] The directory: key in the '.bowerrc' file tells Bower where to install "packages"
[2] The 'component.json' file under the app's root directory tells Bower what dependencies our applicaiton has so we can install them all with one command like so: `bower install`
NOTE: By specifying `null` for a version, we're asking for the latest version of that lib... I think!


## RequireJS
[1] The only srcipt tag that we add explicitly in the page is the following: 
`<script src="js/vendor/require.js" data-main="js/app.js"></script>`


## Build Process/Deployment
[QUOTE]: "RequireJS includes [an optimization tool: http://requirejs.org/docs/optimization.html]
you can run as part of your packaging steps for deploying your code. The optimization 
tool can combine and minify your JavaScript files to allow for better performance."

Make sure that the build.sh file has the right permissions. If not change permission with the following:
`chmod +x build.sh`

Once you're in the directory where the `.sh` file is, run the build file like so:
`./build.sh`