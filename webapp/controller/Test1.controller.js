sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
], function (Controller, JSONModel, Filter, FilterOperator, DateFormat) {
    "use strict";
    var that;
    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
            that = this;
            var oRouter = that.getOwnerComponent().getRouter();
            oRouter.getRoute("Test1").attachPatternMatched(that._onRouteMatched, that);
        },

        _onRouteMatched: function (oEvent) {
            var employeeId = oEvent.getParameter("arguments").employeeId;
            var oModel = that.getOwnerComponent().getModel();

            // --- Load EmployeeInfo ---
            oModel.read("/EmployeeInfo", {
                success: function (oData) {
                    var employee = oData.results.find(emp => emp.ID === employeeId);
                    if (employee) {
                        that.getView().setModel(new JSONModel({items: employee}), "employeeDetails");
                        that._loadEmergencyContact(employeeId);
                        that._loadLeaveSummary(employeeId);
                        that._loadLeaveLogs(employeeId);
                        that._loadPayslips(employeeId);
                    }
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching EmployeeInfo:", err);
                }
            });
        },
        _loadEmergencyContact: function (employeeId) {
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new Filter("EmployeeID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    that.getView().setModel(new JSONModel({items: oData.results}), "emergencyContact");
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching Emergency Contact:", err);
                }
            });
        },
        _loadLeaveSummary: function (employeeId) {
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeLeaveSet", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                that.getView().setModel(new JSONModel({items: oData.results}), "leaveSummary");
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching Leave Summary:", err);
                }
            });
        },
        _loadLeaveLogs: function (employeeId) {
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeLeaveLog", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    that.getView().setModel(new JSONModel(oData.results), "leaveLogs");
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching Leave Logs:", err);
                }
            });
        },
        _loadPayslips: function (employeeId) {
            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeePayslips", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    that.getView().setModel(new JSONModel(oData.results), "payslips");
                }.bind(that),
                error: function (err) {
                    console.log("Error fetching Payslips:", err);
                }
            });
        },
        formatDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                return oFormatter.format(oDate);
            }
        },
        formatStatus: function(status) { 
            switch (status) { 
                case "Approved": 
                    return "Success"; 
                case "Rejected": 
                    return "Error"; 
                case "Hold": 
                    return "Warning"; 
            } 
        },
        onNavBack: function(){
            that.getOwnerComponent().getRouter().navTo("Test")
        }
    });
});
