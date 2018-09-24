import {ControllerBase} from './controller-base'

export var AbstractCrudController = ControllerBase.extend({
    constructor: function AbstractCrudController(element) {
        this.resource = null;
        this.controls = {};
        ControllerBase.apply(this,arguments);
    },

    init: function(element) {
        console.log("abstract-crud-controller.init()");

        if (!ControllerBase.prototype.init.apply(this,arguments)) return false;

        this.resource = element.dataset.resource;

        this.setControls();

        this.addEvent(".new-item","click",this.onNewItem);
        this.addEvent("create-item!.submit-item","click",this.onSubmitNewItem);
        this.addEvent("edit-item!.submit-item","click",this.onSubmitModifyItem);
        this.addEvent("itemtable",".show-item","click",this.onShowItem); //TODO: not working
        this.addEvent("itemtable",".modify-item","click",this.onModifyItem);
        this.addEvent("itemtable",".delete-item","click",this.onDeleteItem);

    },

    setControls: function () {
        this.controls.editSection = this.element.children["edit-item"];
        if (this.controls.editSection)
            this.controls.editForm = this.controls.editSection.children["item-form"];
        this.controls.createSection = this.element.children["create-item"];
        if (this.controls.createSection)
            this.controls.createForm = this.controls.createSection.children["item-form"];
        this.controls.showSection = this.element.children["show-item"];
        this.controls.table = this.element.children['itemtable'];
    },

    refreshTable: function (delay) {
        $(this.element).find(".itemtable")[0].controller.refresh(delay);
    },

    onNewItem: function (event) {
        $(this.element).find(".edit-item").addClass("hidden");
        $(this.element).find(".create-item").removeClass("hidden");
    },


    onModifyItem: function (event,target) {
        var id = target.dataset.id;
        this.modifyItem(id);
    },

    onShowItem: function (event,target) {
        var id = target.dataset.id;
        this.showItem(id);
    },

    onSubmitNewItem: function (event) {
        var form = $(this.element).find(".create-item .item-form")[0];
        var item = this.convertFormToItem(form);
        var that = this;
        this.submitNewItem(item,function(data) {
            this.onNewItemAdded.call(that,data);
        })
    },

    onNewItemAdded: function(data) {
        this.emptyForm(form);
        $(this.element).find(".section.create-item").addClass("hidden");
        this.refreshTable();
        this.getMessages();
    },

    onSubmitModifyItem: function (event) {
        var form = $(this.element).find(".section.edit-item .item-form")[0];
        var item = this.convertFormToItem(form);
        var that = this;
        this.submitModifyItem(item,function(data) {
            this.onItemModified.call(that,data,item);
        });
    },

    onItemModified: function(data,item) {
        this.emptyForm(form);
        $(this.element).find(".section.edit-item").addClass("hidden");
        this.refreshTable();
        if (this.shownData && item.id == this.shownData.id) {
            console.log("update shown item")
            this.showItem(item.id);
        }
        this.getMessages();
    },

    onDeleteItem: function (event,target) {
        var id = target.dataset.id;
        this.deleteItem(id);
    },


    modifyItem: function(id) {
        abstractFunction();
    },

    showItem: function(id) {
        abstractFunction();
    },

    deleteItem: function(id) {
        abstractFunction();
    },

    submitNewItem: function(item,successCallback) {
        abstractFunction();
    },

    submitModifyItem: function(item,successCallback) {
        abstractFunction();
    },

    convertItemToShow: function (data) {
        abstractFunction();
    },

    convertFormToItem: function (form) {
        abstractFunction();
    },

    convertItemToForm: function (form, data) {
        abstractFunction();
    }

})

window.AbstractCrudController = AbstractCrudController;
