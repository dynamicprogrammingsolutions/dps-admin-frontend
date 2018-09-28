//import {loadControllers} from "./controller-loader.js"
import resolver from './controllers/resolver.js';
import controllerManager from '../packages/controller-manager'

import(
    /* webpackChunkName: "node_modules/jquery" */
'jquery').then(($) => {
    $ = $.default;
    window['$'] = $;
    window['jQuery'] = $;

    controllerManager.register(resolver);
    controllerManager.load(document);

    //loadControllers(document);

})

