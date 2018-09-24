import {ControllerBase} from "./include/controller-base";

export var LoginController = ControllerBase.extend({

    constructor: function LoginController() {
        this.resource = null;
        this.modal = null;
        this.callback = null;
        ControllerBase.apply(this,arguments);
    },

    show: function() {
        this.modal.classList.add("shown");
    },

    hide: function() {
        this.modal.classList.remove("shown");
    },

    login: function(callback) {
        console.log(this);
        if (callback) this.callback = callback;
        this.show();
    },

    init: function(element) {

        if (!ControllerBase.prototype.init.apply(this,arguments)) return false;

        this.modal = element.parentNode;
        this.url = element.dataset.url;

        console.log("login controller initialized ",element,this.modal,this.url);

        this.element.querySelector("button").addEventListener("click",function(event) {

            var form = this.element.querySelector(".login form");
            var credentials = {
                username: form.username.value,
                password: form.password.value
            };
            form.username.value = "";
            form.password.value = "";
            console.log(credentials);

            $.ajax({
                url: this.url,
                method: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(credentials),
                success: function() {
                    this.hide();
                    if (this.callback) {
                        this.callback();
                    }
                }.bind(this),
                fail: function(status, data) {
                    console.log(status, data);
                }.bind(this)
            })
        }.bind(this));

    }

})

export default e => {
    return new LoginController(e);
}