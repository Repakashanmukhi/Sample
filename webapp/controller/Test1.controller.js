sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
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
                        var oEmployeeModel = new sap.ui.model.json.JSONModel(oEmployee);
                        this.getView().setModel(oEmployeeModel, "employeeDetails");
                }.bind(this),
                error: function (oError) {
                    console.log("Error fetching employee: ", oError);
                }
            });
        },
        onEmployeInfo: function () {
            var oEmployeeModel = this.getView().getModel("employeeDetails");
            console.log("Employee Model Data:", oEmployeeModel.getData());
            var oDialog = new sap.m.Dialog({
                title: "Employee Information",
                content: new sap.ui.layout.form.SimpleForm({
                    editable: false,
                    layout: "ResponsiveGridLayout",
                    content: [
                        new sap.m.Label({ text: "First Name" }),
                        new sap.m.Text({ text: "{employeeDetails>/FirstName}" }),

                        new sap.m.Label({ text: "Email" }),
                        new sap.m.Text({ text: "{employeeDetails>/Email}" }),
        
                        new sap.m.Label({ text: "Phone Number" }),
                        new sap.m.Text({ text: "{employeeDetails>/Phone}" }),
        
                        new sap.m.Label({ text: "Blood Group" }),
                        new sap.m.Text({ text: "{employeeDetails>/BloodGroup}" }),
        
                        new sap.m.Label({ text: "Department" }),
                        new sap.m.Text({ text: "{employeeDetails>/Department}" }),
        
                        new sap.m.Label({ text: "Position" }),
                        new sap.m.Text({ text: "{employeeDetails>/Position}" }),
        
                        new sap.m.Label({ text: "Salary" }),
                        new sap.m.Text({ text: "{employeeDetails>/Salary}" })
                    ]
                }),
                beginButton: new sap.m.Button({
                    text: "Close",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });
        
            oDialog.setModel(oEmployeeModel, "employeeDetails");
            oDialog.open();
        },          
        onEmergencyContact: function () {
            var oEmpModel = this.getView().getModel("employeeDetails");
            var employeeEmail = oEmpModel.getProperty("/Email"); 
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new sap.ui.model.Filter("ContactEmail", sap.ui.model.FilterOperator.EQ, employeeEmail)],  
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oEmergencyContact = oData.results[0];
                        var oEmergencyContactModel = new sap.ui.model.json.JSONModel(oEmergencyContact);
                        var oDialog = new sap.m.Dialog({
                            title: "Emergencv Contact Information",
                            content: new sap.ui.layout.form.SimpleForm({
                                editable: false,
                                layout: "ResponsiveGridLayout",
                                content: [
                                    new sap.m.Label({ text: "Contact Name" }),
                                    new sap.m.Text({ text: "{/ContactName}" }),
                        
                                    new sap.m.Label({ text: "Contact Phone" }),
                                    new sap.m.Text({ text: "{/ContactPhone}" }),
                        
                                    new sap.m.Label({ text: "Relationship" }),
                                    new sap.m.Text({ text: "{/Relationship}" }),
                                ]
                        
                            }),
                            beginButton: new sap.m.Button({
                                text: "Close",
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            afterClose: function () {
                                oDialog.destroy();
                            }
                        });
        
                        oDialog.setModel(oEmergencyContactModel);
                        oDialog.open();
                    }
                },
                 
                error: function (oError) {
                    console.log("Error fetching emergency contact: ", oError);
                    sap.m.MessageToast.show("Error fetching emergency contact information.");
                }
            });
        }
        
    });
});
