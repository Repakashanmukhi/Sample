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
            var oResourceModel = that.getOwnerComponent().getModel("i18n").getResourceBundle();
            var sTitle = oResourceModel.getText("title");
            that.byId("Text").setText(sTitle);
            var sGreeting = oResourceModel.getText("greeting");
            that.byId("greetingText").setText(sGreeting);

            var oModel = that.getOwnerComponent().getModel();
            var oFilter = new Filter("Department", FilterOperator.EQ, "SAP UI5");

            oModel.read("/EmployeeInfo", {
                filters: [oFilter],
                success: function (oData) {
                    var oEmployeeModel = new sap.ui.model.json.JSONModel({ event: oData.results });
                    that.byId("employeeTable").setModel(oEmployeeModel);
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
        },
        Busy: function () {            
            if (!that.BusyDialog) {
                that.BusyDialog = sap.ui.xmlfragment("sample.Fragments.Busy", that);
            }
            that.BusyDialog.open();
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
        // onSubmit: function () {
        //     var oView = this.getView();
        //     var oInput1 = oView.byId("input1");
        //     var oInput2 = oView.byId("input2");
        //     var oInput3 = oView.byId("input3");
        //     var oText = oView.byId("resultText");
        //     var val1 = parseInt(oInput1.getValue());
        //     var val2 = parseInt(oInput2.getValue());
        //     var val3 = parseInt(oInput3.getValue());
        //     var inputs = [oInput1, oInput2, oInput3];
        //     var allValid = true;
        //     for (var i = 0; i < inputs.length; i++) {
        //         if (inputs[0].getValueState() !== "None") {
        //         allValid = false;
        //         }
        //     }
        //     if (!allValid) {
        //         oText.setText("Please correct the highlighted errors.");
        //         return;
        //     }
        //     var total = val1 + val2 + val3;
        //     if (total >= 104) {
        //         oText.setText("The sum of all three inputs must not equal 104.");
        //         return;
        //     }
        //     var successMsg = `Sum of given input values = ${total}`;
        //     console.log(successMsg)
        //     oText.setText(successMsg);
        // } 
    });
});

