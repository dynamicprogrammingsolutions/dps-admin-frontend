function extend(o, p, c) {
    for(var prop in p) {
        if (p.hasOwnProperty(prop)) {
            if (c) {
                console.log("copying "+prop);
            }
            o[prop] = c?clone(p[prop]):p[prop];
        }
    }
    return o;
}

function clone(obj) {
    if (null == obj || typeof obj !== "object") return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Object.getOwnPropertyDescriptors = function(obj) {
    var descriptors = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            descriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop);
        }
    }
    return descriptors;
};

Function.prototype.extend = function(proto) {
    var superclass = this;
    var constructor;

    if (!proto.hasOwnProperty('constructor')) {
        Object.defineProperty(proto, 'constructor', {
            value: function () {
                superclass.apply(this, arguments);
            },
            writable: true,
            configurable: true,
            enumerable: false
        });
    }
    constructor = proto.constructor;

    var prototype = this.prototype || Object.prototype;
    constructor.prototype = Object.create(prototype, Object.getOwnPropertyDescriptors(proto));

    extend(constructor, superclass, true);

    return constructor;
};

function abstractFunction() {
    throw new Error("Cannot call abstract function");
}

function addEventListenerOnSelector(element,event,selector,callback)
{
    element.addEventListener(event,function(event) {
        var current = event.target;
        while(current !== element) {
            //console.log(current);
            if (current.matches(selector)) {
                //console.log("calling: ",current);
                callback.call(current,event);
                break;
            }
            if (current.parentElement instanceof HTMLElement) {
                current = current.parentNode;
            } else {
                break;
            }
        }
    })
}

HTMLElement.prototype.addEventListenerOnSelector = function(event,selector,callback) {
    addEventListenerOnSelector(this,event,selector,callback);
}
