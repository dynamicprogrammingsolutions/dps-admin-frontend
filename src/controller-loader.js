export var loadControllers = (e) => {

    import('jquery').then(($)=> {
        $ = $.default;
        $(e).find("[data-controller]").each((i,e) => {
            if (e.controller === undefined) {
                import(
                    /* webpackInclude: /\/controllers\/[a-zA-Z0-9\.\-_]+\.js$/ */
                    /* webpackChunkName: "controllers/[request]" */
                    /* webpackMode: "lazy" */
                "./controllers/" + e.dataset.controller).then((c) => {
                    e.controller = c.default(e) || null;
                });
            }
        })
    })
}