#!/bin/bash
echo "Building project, please wait..."

# RequireJS optimization tool
r.js -o local/build/config.js

# Remove stuff that aren't needed anymore (cleanup)
cd remote/
rm -rf build/ build.txt .bowerrc component.json

cd css/
rm -rf normalize.css style.css

cd ../js/
rm -rf app/ plugins/ 

cd vendor/
rm -rf jquery/ backbone/ underscore/