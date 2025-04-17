sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    var that;
    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
            that=this;
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
            var that = this;
            if (!that.PersonalInfo) {
                that.PersonalInfo = sap.ui.xmlfragment("sample.Fragments.Employe", that);
            }
            that.getView().addDependent(that.PersonalInfo); 
            var oFormData = new sap.ui.model.json.JSONModel({
                ContactName: "",
                ContactPhone: "",
                ContactEmail: "",
                Relationship: ""
            });
            that.PersonalInfo.setModel(oFormData, "formData"); 
            var oEmpModel = this.getView().getModel("employeeDetails");
            var employeeEmail = oEmpModel.getProperty("/Email");
            var oModel = this.getOwnerComponent().getModel();
            
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new sap.ui.model.Filter("ContactEmail", sap.ui.model.FilterOperator.EQ, employeeEmail)],
                success: function (oData) {
                    if (oData.results && oData.results.length > 0) {
                        var oEmergencyContact = oData.results[0];
                        oFormData.setData({
                            ContactName: oEmergencyContact.ContactName,
                            ContactPhone: oEmergencyContact.ContactPhone ,
                            ContactEmail: oEmergencyContact.ContactEmail,
                            Relationship: oEmergencyContact.Relationship
                        });
                    }
                },
                error: function (oError) {
                    console.log("Error fetching emergency contact: ", oError);
                    sap.m.MessageToast.show("Error fetching emergency contact information.");
                }
            });
            that.PersonalInfo.open();
        },
        onCancleDialog: function(){
            that.PersonalInfo.close();
        }
        
    });
});
