import "../../lib/utilities";
import "../../lib/templating-engine";

export var ControllerBase = Object.extend({

    constructor: function ControllerBase(element) {
        console.log("controller ",this," for ",element);
        this.element = null;
        this.initialized = false;
        if (element !== undefined) this.init(element);
    },

    init: function (element) {
        console.log("controllerbase init");
        if (this.initialized) return false;
        this.initialized = true;
        this.element = element;
        return true;
    },

    getElement: function (name) {
        if (name.constructor !== String || name.length === 0) throw new TypeError("invalid parameter");
        var e = this.element;
        name.split("!").forEach(function(part) {
            e = findElement(e,part);
            if (e === null) throw new Error("element " + name + " not found");
        })
        return e;
    },

    addEvent: function (name,event,callback) {
        if (arguments.length === 4) this.addEventOnSelector.apply(this,arguments);
        var that = this;
        this.getElement(name).addEventListener(event,function(event) {
            callback.call(that,event,this);
        });
    },

    addEventOnSelector: function (name,selector,event,callback) {
        var that = this;
        this.getElement(name).addEventListenerOnSelector(event,selector,function(event) {
            callback.call(that,event,this);
        });
    }

})


var nameRegex = /^[a-zA-Z0-9\-]+$/;

function findElement(e,name) {
    var found, i;
    if (name.match(nameRegex)) {
        found = e.children[name];
    } else {
        for (i = 0; i < e.children.length; i++) {
            if (e.children[i].matches(name)) {
                found = e.children[i];
                break;
            }
        }
    }
    if (found) return found;
    for (i = 0; i < e.children.length; i++) {
        var ch = e.children[i];
        found = findElement(ch,name);
        if (found) return found;
    }
    return null;
}


ControllerBase.elements = [];
ControllerBase.getController = function() {
    console.log(this.elements);
    if (this.elements && this.elements instanceof Array && this.elements.length > 0 && this.elements[0].controller)
        return this.elements[0].controller;
    else
        return null;
}

export default e => new ControllerBase(e);
