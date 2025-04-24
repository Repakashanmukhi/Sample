sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";
    var that;
    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("Test1");
            oRoute.attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var employeeId = oArgs.employeeId;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfo", {
                success: function (oData) {
                    var oEmployee = oData.results.find(emp => emp.ID === employeeId);
                    var oEmployeeModel = new JSONModel(oEmployee);
                    this.getView().setModel(oEmployeeModel, "employeeDetails");
                }.bind(this),
                error: function (oError) {
                    console.log("Error fetching employee: ", oError);
                }
            });
        },
        onEmployeeInfo: function () {
            var that = this;
            if (!that.PersonalInfo) {
                that.PersonalInfo = sap.ui.xmlfragment("sample.Fragments.Employe", that);
                that.getView().addDependent(that.PersonalInfo);
            }
            var oEmployeeModel = this.getView().getModel("employeeDetails");
            var employeeEmail = oEmployeeModel.getProperty("/Email");
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new sap.ui.model.Filter("ContactEmail", sap.ui.model.FilterOperator.EQ, employeeEmail)],
                success: function (oData) {
                    var contacts = oData.results;
                    that.getView().setModel(new sap.ui.model.json.JSONModel(contacts), "emergencyContacts");
                    that.getView().setModel(new sap.ui.model.json.JSONModel({}), "emergencyContact");
                    var combinedData = {
                        employee: oEmployeeModel.getData(),
                        oEmergencyContact: {}
                    };
                    that.getView().setModel(new sap.ui.model.json.JSONModel(combinedData), "combinedData");
                    that.PersonalInfo.open();
                },
                error: function (err) {
                    console.log("Error fetching emergency contacts: ", err);
                }
            });
        },
        onContactSelectionChange: function (oEvent) {
            var selected = oEvent.getParameter("selectedItem").getBindingContext("emergencyContacts").getObject();
            var oContactModel = this.getView().getModel("emergencyContact");
                oContactModel.setData(selected);  
            var employee = this.getView().getModel("employeeDetails").getData();
            var combined = {
                employee: employee,
                oEmergencyContact: selected
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(combined), "combinedData");
        },
        onCancleDialog: function () {
            if (this.PersonalInfo) {
                this.PersonalInfo.close();
            }
        }
    });
});




