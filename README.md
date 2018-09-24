# DPS Admin Frontend

This is general admin framework for our web applications.

To install and build run in terminal:
  
    npm install

Build for development:

    npm run build-dev
  
Build for production:

    npm run build-production
  
Build for development and watch changes:

    npm run watch
  
Check package.json for individual tasks

File structure after installation and building:

    .
    ├── src           # js ES6 sources
    ├── styles-dev    # css & less & sass sources and compiled files for development
    │    └── *        # include files for less and sass
    ├── scripts_dev   # compiled ES5 js files for development
    ├── scripts       # compiled and minified js files for production
    ├── styles        # compiled and minified css files for production
    └── node_modules  # you know it
    
    