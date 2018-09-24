import $ from "jquery"
import {AbstractCrudController} from "./include/abstract-crud-controller"

export var CrudController = AbstractCrudController.extend({

    constructor: function CrudController(element) {
        this.messagesResource = null;
        AbstractCrudController.apply(this,arguments);
    },

    init: function (element) {
        if (!AbstractCrudController.prototype.init.apply(this,arguments)) return false;
        this.messagesResource = element.dataset.messages;
    },

    reinit: function (resource) {
        if (this.controls.editSection) this.controls.editSection.classList.add("hidden");
        if (this.controls.createSection) this.controls.createSection.classList.add("hidden");
        this.element.dataset.resource = resource;
        this.resource = resource;
        var tableController = this.controls.table.controller;
        tableController.reinit.call(tableController, resource);
    },

    ajax: function (url, method, data, callback, onerror) {
        var runRequest = function () {
            $.ajax({
                url: url,
                method: method,
                contentType: "application/json",
                processData: false,
                data: data ? JSON.stringify(data) : null,
                success: function (data) {
                    callback.bind(this)(data);
                }.bind(this),
                error: function (xhr) {
                    if (xhr.status == 401) {
                        var login = LoginController.getController();
                        if (login) login.login.call(login,runRequest);
                    } else {
                        if (onerror) {
                            onerror(xhr);
                        }
                    }
                }.bind(this)
            })
        }.bind(this);
        runRequest();
    },

    /**
     *
     * @param {XMLHttpRequest} xhr
     */
    getMessages: function (xhr) {
        var messages = MessagesController.getController();
        if (messages) messages.getMessages(xhr);
    },

    modifyItem: function (id) {
        var form = $(this.element).find(".edit-item .item-form")[0];
        $(this.element).find(".create-item").addClass("hidden");
        this.ajax(this.resource + "/" + id, "GET", null, function (data) {
            this.convertItemToForm.bind(this)(form, data);
            $(this.element).find(".section.edit-item").removeClass("hidden");
            this.getMessages();
        }, function (xhr) {
            this.getMessages(xhr);
        }.bind(this))
    },


    showItem: function (id) {

        console.log("showing item "+id);

        var showItem = $(this.element).find(".show-section")[0];
        this.ajax(this.resource + "/" + id, "GET", null, function (data) {
            this.shownData = data;
            showItem.innerHTML = "";
            showItem.innerHTML = this.convertItemToShow.bind(this)(data);
        })
    },

    deleteItem: function(id) {
        this.ajax(this.resource + "/" + id, "DELETE", null, function () {
            this.refreshTable(500)
            this.getMessages()
        }.bind(this), function (xhr) {
            this.getMessages(xhr)
        }.bind(this));
    },

    submitNewItem: function(item,successCallback) {
        var that = this;
        this.ajax(this.resource, "POST", item, function (data) {
            successCallback.call(that,data);
        }, function (xhr) {
            this.getMessages(xhr);
        }.bind(this))
    },

    submitModifyItem: function(item,successCallback) {
        var that = this;
        this.ajax(this.resource + "/" + item.id, "PUT", item, function (data) {
            successCallback.call(that,data);
        }, function (xhr) {
            this.getMessages(xhr);
        }.bind(this));
    },

    convertItemToShow: function (data) {
        var template = this.element.children["tpl-show-item"];
        return TemplateEngine.applyTemplate(template, data);
    },

    convertFormToItem: function (form) {
        $(form).find(".markdown-editor").each(function (i, v) {
            v.simpleMDE.toTextArea();
        })

        $(form).find(".htmleditor").each(function (i, v) {
            $(v).val($(v).trumbowyg('html'));
        })

        var result = {};
        $.each($(form).find(':input'), function (i, v) {
            var name = $(v).attr('name');
            var value = $(v).val();
            if (name) {
                if ($(v).attr("type") === "radio") {
                    if ($(v).is(":checked")) {
                        result[name] = value;
                    }
                }
                if ($(v).attr("type") === "checkbox") {
                    if (value !== "on" && !result[name]) {
                        result[name] = [];
                    }
                    if ($(v).is(":checked")) {
                        if (value === "on") {
                            result[name] = true;
                        } else {
                            result[name].push({id: value});
                        }
                    } else {
                        if (value === "on") {
                            result[name] = false;
                        }
                    }
                }
                if ($(v).is("textarea") || ($(v).is("input") && (["text", "password", "hidden"].includes($(v).attr("type"))))) {
                    result[name] = value;
                }
            }
        })
        console.log(result);
        return result;

    },

    convertItemToForm: function (form, data) {

        this.emptyForm(form);

        $(form).find(".markdown-editor").each(function (i, v) {
            v.simpleMDE.toTextArea();
        })

        $.each($(form).find(':input'), function (i, v) {
            var name = $(v).attr('name');
            if (data[name]) {
                if ($(v).attr("type") === "radio") {
                    if (data[name] === $(v).val()) {
                        $(v).prop("checked", true);
                    }
                } else if ($(v).attr("type") !== "checkbox") {
                    $(v).val(data[name]);
                } else {
                    if (Array.isArray(data[name])) {
                        data[name].forEach(function (t) {
                            if (t.id && t.id == $(v).val()) {
                                $(v).prop("checked", true);
                            }
                        })
                    } else {
                        if (data[name] === true) {
                            $(v).prop("checked", true);
                        }
                    }
                }
            } else {
                if ($(v).attr("type") != "checkbox" && $(v).attr("type") != "radio") {
                    $(v).val('');
                }
            }
        });

        $(form).find(".htmleditor").each(function (i, v) {
            $(v).trumbowyg('html', $(v).val())
        })

        $(form).find(".markdown-editor").each(function (i, v) {
            v.simpleMDE = new SimpleMDE({
                element: v,
                spellChecker: false
            });
        })

    },

    emptyForm: function (form) {

        $(form).find(".markdown-editor").each(function (i, v) {
            v.simpleMDE.toTextArea();
        })

        $.each($(form).find(':input'), function (i, v) {
            if ($(v).attr("type") == "file") {
                var oldInput = v;
                var newInput = document.createElement("input");
                newInput.type = "file";
                newInput.id = oldInput.id;
                newInput.name = oldInput.name;
                newInput.className = oldInput.className;
                newInput.style.cssText = oldInput.style.cssText;
                oldInput.parentNode.replaceChild(newInput, oldInput);
                return;
            }
            if ($(v).attr("type") == "checkbox" || $(v).attr("type") == "radio") {
                $(v).prop("checked", false);
                return;
            }
            $(v).val('');
        });

        $(form).find(".htmleditor").each(function (i, v) {
            $(v).trumbowyg('html', $(v).val())
        });

        $(form).find(".markdown-editor").each(function (i, v) {
            v.simpleMDE = new SimpleMDE({
                element: v,
                spellChecker: false
            });
        })

    }

});

window.CrudController = CrudController;

export default e => new CrudController(e);

