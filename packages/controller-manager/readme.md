# Controller Manager

## Description

With this package you can dynamically load controllers using webpack.

## Installation

    npm install @dynamicprogrammingsolutions/controller-manager --save

## Usage

Follwing is the simplest usage

In `./main.js`:

    import resolver from './controllers/resolver.js';
    import controllerManager from '@dynamicprogrammingsolutions/controller-manager'
    
    controllerManager.register(resolver);
    controllerManager.load(document);

In `./controllers/resolver.js`:

    export default (name) => {
        /* you may apply regex and other sophisticated filters to decide
        whether you can handle this request */
        if (name === 'mycontrller') {
            return import('./' + mycontroller');
            /* note: you have to hardcode the prefix for webpack to be able to detect which
            files may be loaded dynamically. You may also add magic comments.
            More info: https://webpack.js.org/guides/code-splitting/#dynamic-imports */
        }
        /* If you return null or undefined it will go to the next resolver */
    }

In `./controllers/mycontroller.js`:

    export default (el) => {
        el.innerText = 'Hello World';
    }
    
In `index.html`:

    <body>
        <div data-controller="mycontroller"></div>
    </body>