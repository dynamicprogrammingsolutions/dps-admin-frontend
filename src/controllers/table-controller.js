import {ControllerBase} from "./include/controller-base";
import $ from 'jquery';
import '../lib/templating-engine'

export var TableController = ControllerBase.extend({

    constructor: function TableController(element) {
        this.resource = null;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.init(element);
    },

    init: function(element) {

        if (this.initialized) return;

        ControllerBase.prototype.init.apply(this,arguments);

        console.log("table-controller initialized");
        console.log("resource: "+element.dataset.resource);

        $(element).find(".tblNav").on("click","a",function(event) {
            event.preventDefault();
            this.pageClick.bind(this)(event);
        }.bind(this));

        this.resource = element.dataset.resource;

        if (this.resource) {
            this.refresh();
        }

    },

    reinit: function(resource) {
        this.element.dataset.resource = resource;
        this.resource = resource;
        if (this.resource) {
            this.refresh();
        }
    },

    refresh: function(delay) {

        var table = this.element.children["table"];
        var template = this.element.children["tpl-row"];
        var body = table.querySelector("tbody");
        var itemsPerPage = this.itemsPerPage;
        var currentPage = this.currentPage;
        this.element.children["table"].classList.add("loading");

        var refresh = function() {
            $.ajax({
                url: this.resource+"/count",
                success: function(data) {
                    var count = data;
                    //console.log("itemsPerPage: ",itemsPerPage);
                    var maxPages = Math.floor(((count-1)/itemsPerPage)+1);
                    //console.log("count: ",count," maxPages: ",maxPages);
                    if (currentPage < 1) currentPage = 1;
                    if (currentPage > maxPages) currentPage = maxPages;
                    var start = (currentPage-1)*itemsPerPage;
                    if (start >= count || start < 0) {
                        currentPage = 1;
                        start = 0;
                    }
                    this.currentPage = currentPage;
                    //console.log("page: ",currentPage);
                    //console.log("start: ",start," count: ",count);

                    $.ajax({
                        url:  this.resource+"?first="+start+"&max="+itemsPerPage,
                        success: function(data) {
                            //console.log(data);
                            while(body.firstChild) {
                                body.removeChild(body.firstChild);
                            }
                            data.forEach(function (t, number, ts) {
                                var element = document.createElement("tr");
                                element.innerHTML = TemplateEngine.applyTemplate(template,t,this.convertData);
                                body.appendChild(element);
                            }.bind(this));

                            this.refreshPagination(maxPages,currentPage);

                            this.tableLoaded();

                            //controller.addEvents(body);
                        }.bind(this),
                        error: function(err) {

                            console.log(err);

                            var messages = MessagesController.getController();
                            if (messages) messages.getMessages(err);

                            this.element.children["table"].classList.remove("loading");

                        }.bind(this)
                    });

                }.bind(this),
                error: function(err) {
                    console.log(err);

                    var messages = MessagesController.getController();
                    if (messages) messages.getMessages(err);

                    this.element.children["table"].classList.remove("loading");

                }.bind(this)
            })
        }.bind(this)

        if (delay) {
            window.setTimeout(function() {
                refresh();
            }.bind(this),delay)
        } else {
            refresh();
        }

    },

    tableLoaded: function() {

    },

    refreshPagination: function(maxPages, currentPage) {

        var pagination = this.element.children["pagination"];
        var nav = pagination.children["tblNav"];
        var currentNode = nav.children["tablePrevPage"];
        $(nav).find('.tablePage').remove();
        var tmp = pagination.children["tblPage"];

        for (var i = 1; i <= maxPages; i++) {
            var element = TemplateEngine.createElement(tmp,{page:i});
            $(currentNode).after(element);
            currentNode = element;
            if (i == currentPage) {
                currentNode.classList.add("current");
            }
        }

        if (currentPage == 1) {
            nav.children["tablePrevPage"].classList.add('disabled');
        } else {
            nav.children["tablePrevPage"].classList.remove('disabled');
        }

        if (currentPage == maxPages) {
            nav.children["tableNextPage"].classList.add('disabled');
        } else {
            nav.children["tableNextPage"].classList.remove('disabled');
        }

        this.element.children["table"].classList.remove("loading");

    },

    pageClick: function(event) {
        if ($(event.currentTarget).hasClass("tablePage")) {
            this.currentPage = event.currentTarget.dataset.page;
            this.refresh();
        } else if ($(event.currentTarget).hasClass("tablePrevPage")) {
            this.currentPage--;
            this.refresh();
        } else if ($(event.currentTarget).hasClass("tableNextPage")) {
            this.currentPage++;
            this.refresh();
        }
    },

    convertData: function(d) {
        if (d === true) return '<input class="intable" type="checkbox" disabled checked>';
        if (d === false) return '<input class="intable" type="checkbox" disabled>';
        return d;
    }

});

window.TableController = TableController;

export default e => new TableController(e);
