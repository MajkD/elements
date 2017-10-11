# ELEMENTS

Working name of a WIP game project building an "engine" for developing a platformer game in html5, using electron for launching game as a separate app.

# Install
npm install

# Start Game
./node_modules/.bin/electron main.js

#Start Game Debug Mode
./node_modules/.bin/electron main.js debug-game

#Start Camera Debug Mode
./node_modules/.bin/electron main.js debug-camera

# Start Editor
./node_modules/.bin/electron main.js editor


# Package
electron-packager /Users/mdanielsson/play/elements elements --all --electron-version=1.6.8 --out=/Users/mdanielsson/Desktop/testbuild --overwrite

electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=/Users/mdanielsson/Desktop/testbuild

# Attach Debugger
lldb ~/Desktop/testbuild/elements-darwin-x64/elements.app
run
