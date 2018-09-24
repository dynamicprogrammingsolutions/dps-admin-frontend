import {loadControllers} from "./controller-loader.js"

import(
    /* webpackChunkName: "node_modules/jquery" */
'jquery').then(($) => {
    $ = $.default;
    window['$'] = $;
    window['jQuery'] = $;

    loadControllers(document);

})

