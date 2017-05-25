# Start Game
./node_modules/.bin/electron main.js

#Start Game Debug Mode
./node_modules/.bin/electron main.js game-debug

# Start Editor
./node_modules/.bin/electron main.js editor


# Package
electron-packager /Users/mdanielsson/play/elements elements --all --electron-version=1.6.8 --out~/Desktop/testbuild --overwrite

# Attach Debugger
lldb ~/Desktop/testbuild/elements.app
run