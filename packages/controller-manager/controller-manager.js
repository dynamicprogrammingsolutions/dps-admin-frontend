import loglevel from 'loglevel';
const logger = loglevel.getLogger('controller-manager');
logger.setLevel('INFO');

const resolvers = [];

function register(...params) {
    logger.info('registering module, params: ',params);
    if (params.length === 2 && typeof params[0] === "string" && (typeof params[1] === "function" || typeof params[1] === "object")) {
        _registerSingleModule(params[0],params[1]);
    }
    if (params.length === 1 && typeof params[0] === 'function') {
        _registerResolver(params[0]);
    }
}

function _registerSingleModule(name,module) {
    logger.info('registering single module: ',name);
    let initFunction = _getInitFunctionFromModule(module);
    _registerResolver((n) => {
        if (n === name) {
            return initFunction;
        } else {
            return null;
        }
    })
}

function _getInitFunctionFromModule(module) {
    let initFunction = null;
    if (typeof module === "object" && module.default !== undefined) {
        module = module.default;
    }
    if (typeof module === "function") {
        initFunction = module;
    } else if (typeof module === "object" && module.init !== undefined && typeof module.init === "function") {
        initFunction = module;
    } else {
        throw TypeError("Cannot resolve init function from module");
    }
    return initFunction;
}

function _registerResolver(resolver) {
    logger.info('registering resolver: ',resolver);
    resolvers.push(resolver);
}

function load(rootElement) {
    logger.info('loading from root: ',rootElement);
    let elements = rootElement.querySelectorAll("[data-controller]");
    elements.forEach((el) => {
        console.log('resolving controller for element: ',el);
        for (const resolver of resolvers) {
            let ret = resolver(el.dataset.controller);
            console.log('trying resolver: ',resolver,' returned: ',ret);
            if (ret !== null && ret !== false && ret !== undefined) {
                _handleResolverReturn(ret,el);
                break;
            }
        }
    })
}

function _handleResolverReturn(ret,el) {
    if (ret instanceof Promise) {
        ret.then((module) => {
            let initFunction = _getInitFunctionFromModule(module);
            initFunction(el);
        })
    } else {
        try {
            let initFunction = _getInitFunctionFromModule(ret);
        } catch (e) {
            throw new TypeError("Resolver has to return a promise or a controller module");
        }
    }
}

export default { register, load }