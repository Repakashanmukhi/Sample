sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, ColumnListItem, Text, Filter, FilterOperator) => {
    "use strict";
    var that;
    return Controller.extend("sample.controller.Test", {
        onInit() {
            that = this;
            var oResourceModel = that.getOwnerComponent().getModel("i18n");
            var oResourceBundle = oResourceModel.getResourceBundle();
            var sTitle = oResourceBundle.getText("title");
            that.byId("Text").setText(sTitle);
            var sGreeting = oResourceBundle.getText("greeting");
            that.byId("greetingText").setText(sGreeting);

            // Fetching the data without binding in view only using id's 
            var oUnique = that.getOwnerComponent().getModel();
            var sDepartment = "SAP UI5"; 
            var oDepartmentFilter = new Filter("Department", FilterOperator.EQ, sDepartment);
            oUnique.read("/EmployeeInfo", {
                filters: [oDepartmentFilter], 
                success: function (oData) {
                    console.log(oData);  
                    var oEmployeeModel = new sap.ui.model.json.JSONModel(oData.results);  
                    var oTable = that.getView().byId("employeeTable");
                    oTable.setModel(oEmployeeModel);
                    oTable.bindItems({
                        path: "/",  
                        template: new ColumnListItem({
                            cells: [
                                new Text({ text: "{ID}" }),
                                new Text({ text: "{FirstName} {LastName}" }),
                                new Text({ text: "{Email}" }),
                                new Text({ text: "{Phone}" }),
                                new Text({ text: "{BloodGroup}" }),
                                new Text({ text: "{Department}" }),
                                new Text({ text: "{Position}" }),
                                new Text({ text: "{Salary}" }),
                                new Text({ text: "{path: 'JoiningDate', formatter: '.formatJoiningDate'}" })
                            ]
                        })
                    });
                },
                error: function (oError) {
                    console.log("Error fetching data: ", oError);
                }
            });
        },

        formatJoiningDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                return oFormatter.format(oDate);
            }
        }
    });
});



