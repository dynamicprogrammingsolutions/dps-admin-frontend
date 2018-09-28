export default (name) => {
    console.log('executing controller: '+name);
    const regex = /^[a-zA-Z0-9_\-]+$/;
    const regexResult = regex.exec(name);
    if (regexResult)
        return import(
            /* webpackInclude: /\/controllers\/[a-zA-Z0-9\.\-_]+\.js$/ */
            /* webpackChunkName: "controllers/[request]" */
            /* webpackMode: "lazy" */
            './'+name+'.js');
}