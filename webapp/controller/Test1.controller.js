sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
], function (Controller, JSONModel, Filter, FilterOperator, DateFormat) {
    "use strict";

    return Controller.extend("sample.controller.Test1", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Test1").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var employeeId = oEvent.getParameter("arguments").employeeId;
            var oModel = this.getOwnerComponent().getModel();

            // --- Load EmployeeInfo ---
            oModel.read("/EmployeeInfo", {
                success: function (oData) {
                    var employee = oData.results.find(emp => emp.ID === employeeId);
                    if (employee) {
                        this.getView().setModel(new JSONModel({items: employee}), "employeeDetails");
                        this._loadEmergencyContact(employeeId);
                        this._loadLeaveSummary(employeeId);
                        this._loadLeaveLogs(employeeId);
                        this._loadPayslips(employeeId);
                    }
                }.bind(this),
                error: function (err) {
                    console.log("Error fetching EmployeeInfo:", err);
                }
            });
        },
        _loadEmergencyContact: function (employeeId) {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfoEmergencyContact", {
                filters: [new Filter("EmployeeID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    this.getView().setModel(new JSONModel({items: oData.results}), "emergencyContact");
                }.bind(this),
                error: function (err) {
                    console.log("Error fetching Emergency Contact:", err);
                }
            });
        },
        _loadLeaveSummary: function (employeeId) {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeLeaveSet", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                this.getView().setModel(new JSONModel({items: oData.results}), "leaveSummary");
                }.bind(this),
                error: function (err) {
                    console.log("Error fetching Leave Summary:", err);
                }
            });
        },
        _loadLeaveLogs: function (employeeId) {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeeLeaveLog", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    this.getView().setModel(new JSONModel(oData.results), "leaveLogs");
                }.bind(this),
                error: function (err) {
                    console.log("Error fetching Leave Logs:", err);
                }
            });
        },
        _loadPayslips: function (employeeId) {
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/EmployeePayslips", {
                filters: [new Filter("EmployeeID_ID", FilterOperator.EQ, employeeId)],
                success: function (oData) {
                    this.getView().setModel(new JSONModel(oData.results), "payslips");
                }.bind(this),
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
            return "";
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
    });
});


