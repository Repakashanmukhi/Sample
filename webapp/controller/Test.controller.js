sap.ui.define([ 
    "sap/ui/core/mvc/Controller", 
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator", 
], function (Controller, Filter, FilterOperator) { 
    "use strict"; 
    var that;
    return Controller.extend("sample.controller.Test", { 
        onInit: function () { 
            that = this;
            that.oEventBus = that.getOwnerComponent().getEventBus();
            var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle(); 
            var sTitle = oResourceModel.getText("title"); 
            this.byId("Text").setText(sTitle); 


            var oModel = that.getOwnerComponent().getModel();
            oModel.read("/EmployeeInfo", {  
                success: function (oData) {
                    var oEmployeeModel = new sap.ui.model.json.JSONModel({ event: oData.results });
                    that.byId("employeeList").setModel(oEmployeeModel);
                },
                error: function (oError) {
                    console.log("Error fetching data: ", oError);
                }
            }); 
        }, 
        onInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sId = oEvent.getSource().getId();
            var sValue = oInput.getValue();
            var oInput1 = this.byId("input1");
            var oInput2 = this.byId("input2");
            var oInput3 = this.byId("input3");
            [oInput1, oInput2, oInput3].forEach(function(input) {
                input.setValueState("None");
            });
            if (!Number.isInteger(+sValue)) {
                oInput.setValueState("Error");
                oInput.setValueStateText("Please enter only integer values.");
            } else {
                var iValue = parseInt(sValue);
                if (iValue < 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Number should be greater than or equal to 0.");
                } else if (iValue > 104) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Number should be less than or equal to 104.");
                } else if (sId.includes("input2") && iValue % 4 !== 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Number should be divisible by 4.");
                } else if (sId.includes("input3") && iValue % 12 !== 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Number should be divisible by 12.");
                }
            }
            if (oInput.getValueState() === "Error") {
                oInput1.setValueState("Error");
                oInput2.setValueState("Error");
                oInput3.setValueState("Error");
            }
        },
        onNavigation: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
            var employeeId = oData.ID;
            this.getOwnerComponent().getRouter().navTo("Test1", {
                employeeId: employeeId
            });
        }
    }); 
}); 
// To filter the data based on departments and display it on a table
//             var oModel = that.getOwnerComponent().getModel();
//             var oFilter = new Filter("Department", FilterOperator.EQ, "SAP UI5");
//             oModel.read("/EmployeeInfo", {
//                 filters: [oFilter],
//                 success: function (oData) {
//                     var oEmployeeModel = new sap.ui.model.json.JSONModel({ event: oData.results });
//                     that.byId("employeeTable").setModel(oEmployeeModel);
//                 },
//                 error: function (oError) {
//                     console.log("Error fetching data: ", oError);
//                 }
//             });



