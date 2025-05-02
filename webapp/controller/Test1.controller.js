sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast, DateFormat) {
    "use strict";
    var that;
    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
            that = this;
            var oRouter = that.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("Test1"); 
            oRoute.attachPatternMatched(that._onRouteMatched, that);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var employeeId = oArgs.employeeId;
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfo", {
                success: function (oData) {
                    var oEmployee = oData.results.find(emp => emp.ID === employeeId);
                    var oEmployeeModel = new JSONModel(oEmployee);
                    that.getView().setModel(oEmployeeModel, "employeeDetails");
                }.bind(that),
                error: function (oError) {
                    console.log("Error fetching employee: ", oError);
                }
            });
        },

        onEmployeeInfo: function () {
            if (!that.PersonalInfo) {
                that.PersonalInfo = sap.ui.xmlfragment("sample.Fragments.Employe", that);
                that.getView().addDependent(that.PersonalInfo);
            }
            var oEmployeeModel = that.getView().getModel("employeeDetails");
            var employeeIds = oEmployeeModel.getProperty("/ID");
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new Filter("EmployeeID", FilterOperator.EQ, employeeIds)],
                success: function (oData) {
                    var contacts = oData.results;
                    that.getView().setModel(new JSONModel(contacts), "emergencyContacts");
                    that.getView().setModel(new JSONModel({}), "emergencyContact");
                    var combinedData = {
                        employee: oEmployeeModel.getData(),
                        oEmergencyContact: {}
                    };
                    that.getView().setModel(new JSONModel(combinedData), "combinedData");
                    that.PersonalInfo.open();
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching emergency contacts: ", err);
                }
            });
        },

        onContactSelectionChange: function (oEvent) {
            var selected = oEvent.getParameter("selectedItem").getBindingContext("emergencyContacts").getObject();
            that.getView().getModel("emergencyContact").setData(selected);
            var employee = that.getView().getModel("employeeDetails").getData();
            var combined = {
                employee: employee,
                oEmergencyContact: selected
            };
            that.getView().setModel(new JSONModel(combined), "combinedData");
        },

        onCancleDialog: function () {
            that.PersonalInfo.close();
        },

        formatDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                return oFormatter.format(oDate);
            }
        },
        onEmpLeave: function () {
            if (!that.LeaveInfo) {
                that.LeaveInfo = sap.ui.xmlfragment("sample.Fragments.EmployeeLeave", that);
                that.getView().addDependent(that.LeaveInfo);
            }
            var oEmployeeModel = that.getView().getModel("employeeDetails");
            var employeeId = oEmployeeModel.getProperty("/ID");
            var oModel = that.getOwnerComponent().getModel();

            oModel.read("/EmployeeLeaveLog", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    var oLeaveModel = new JSONModel({ leaves: oData.results});
                    that.LeaveInfo.setModel(oLeaveModel);
                    that.LeaveInfo.open();
                },
                error: function () {
                    MessageToast.show("Failed to load leave data");
                }
            });
        },
        onCancle: function(){
            that.LeaveInfo.close();
        }
    });
});




