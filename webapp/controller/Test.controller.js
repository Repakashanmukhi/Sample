    sap.ui.define([ 
    "sap/ui/core/mvc/Controller", 
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator", 
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel,MessageToast) { 
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
                    var oEmployeeModel = new JSONModel({ event: oData.results });
                    that.getView().setModel(oEmployeeModel, "employeeModel");
                    var oSorter = new sap.ui.model.Sorter("ID", false);
                    that.byId("employeeList").setModel(oEmployeeModel);
                    that.byId("employeeList").getBinding("items").sort(oSorter);
                },
                error: function (oError) {
                    console.log("Error fetching data: ", oError);
                }
            });
        },
        onSalary: function (oEvent) {
            var sSelectedRange = oEvent.getParameter("selectedItem").getKey();
            var aFilters = [];
            switch (sSelectedRange) {
                case "All":
                    aFilters = [];
                    break;
                case "0-10000":
                    aFilters.push(new Filter("Salary", FilterOperator.BT, 0, 10000));
                    break;
                case "10000-15000":
                    aFilters.push(new Filter("Salary", FilterOperator.BT, 10000, 15000));
                    break;
                case "15000-20000":
                    aFilters.push(new Filter("Salary", FilterOperator.BT, 15000, 20000));
                    break;
                case "20000":
                    aFilters.push(new Filter("Salary", FilterOperator.GT, 20000));
                    break; 
                default:
                    break;
            }
            var oList = this.byId("employeeList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        }, 
        onLeave: function() {
            var that = this;
            var oModel = this.getView().getModel();
                if (!that.create) {
                that.create = sap.ui.xmlfragment("sample.Fragments.Leave", that);
                that.getView().addDependent(that.create);
            }
            that.create.open();
            oModel.read("/EmployeeLeaveLog", {
                success: function(oData) {
                    var aResults = oData.results;
                    var oLeaveCount = [];
                    for (var i = 0; i < aResults.length; i++) {
                        var empId = aResults[i].EmployeeID_ID;
                        if (oLeaveCount[empId]) {
                            oLeaveCount[empId]++;
                        } else {
                            oLeaveCount[empId] = 1;
                        }
                    }
                    var aLeaveCountArray = [];
                    var aKeys = Object.keys(oLeaveCount);
                    for (var i = 0; i < aKeys.length; i++) {
                        var empId = aKeys[i];
                        aLeaveCountArray.push({
                        EmployeeID: empId,
                        LeaveCount: oLeaveCount[empId]
                        });
                    }
                    var JSONModel = new sap.ui.model.json.JSONModel({leaves: aLeaveCountArray});
                    that.create.setModel(JSONModel);
                }
            });
        },
        
        onClose: function(){
            that.create.close();
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
        // To create Employee Leave log 
        // onAddRow: function(){
        //     var TempEmployee = new JSONModel({
        //         Employees: []
        //     });
        //     that.getView().setModel(TempEmployee, "employeeModel");
        //     var oEmployeeModel = that.getView().getModel("employeeModel");
        //     var aEmployees = oEmployeeModel.getProperty("/Employees"); 
        //     var TempEmp = {
        //         ID: sap.ui.getCore().byId("LID").getValue(),
        //         EmployeeID_ID: sap.ui.getCore().byId("LemployeeID").getValue(), 
        //         LeaveStartDate: sap.ui.getCore().byId("LSD").getValue(),  
        //         LeaveEndDate: sap.ui.getCore().byId("LED").getValue(),  
        //         LeaveType: sap.ui.getCore().byId("LeaveType").getValue(),
        //         Reason: sap.ui.getCore().byId("LReason").getValue(), 
        //         Status: sap.ui.getCore().byId("LStatus").getValue(),
        //     };
        //     if (TempEmp.ID && TempEmp.EmployeeID_ID &&  TempEmp.LeaveStartDate && TempEmp.LeaveEndDate && TempEmp.LeaveType && TempEmp.Reason && TempEmp.Status) {
        //         var oModel = that.getView().getModel();  
        //         aEmployees.push(TempEmp);  
        //         oEmployeeModel.setProperty("/Employees", aEmployees);  
        //     } else {
        //         MessageToast.show("Please fill all the fields!");
        //     }
        // },
        // formatDate: function (sDate) {
        //     if (sDate) {
        //         var oDate = new Date(sDate);
        //         var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
        //         return oFormatter.format(oDate);
        //     }
        //     return null; 
        // },
        // onSubmitDialog: function () { 
        //     var oLeaveModel = this.getView().getModel("employeeModel"); 
        //     var aLeaves = oLeaveModel.getProperty("/Employees"); 
        //     var oData = this.getOwnerComponent().getModel(); 
        //     for (var i = 0; i < aLeaves.length; i++) { 
        //         var oLeave = aLeaves[i]; 
        //         var oNewLeave = {
        //             ID: oLeave.ID,
        //             EmployeeID_ID: oLeave.EmployeeID_ID,
        //             LeaveStartDate: this.formatDate(oLeave.LeaveStartDate), 
        //             LeaveEndDate: this.formatDate(oLeave.LeaveEndDate), 
        //             LeaveType: oLeave.LeaveType,
        //             Reason: oLeave.Reason,
        //             Status: oLeave.Status
        //         };                
        //         oData.create("/EmployeeLeaveLog", oNewLeave, { 
        //             success: function () { 
        //                 MessageToast.show("Employee leave data submitted successfully!"); 
        //             }, 
        //             error: function (error) { 
        //                 MessageToast.show("Error submitting employee leave data!"); 
        //             } 
        //         }); 
        //     } 
        //     oLeaveModel.setProperty("/Employees", []); 
        // },
          

        
        
    }); 
});

        // onInputChange: function (oEvent) {
        //     var oInput = oEvent.getSource();
        //     var sId = oEvent.getSource().getId();
        //     var sValue = oInput.getValue();
        //     var oInput1 = this.byId("input1");
        //     var oInput2 = this.byId("input2");
        //     var oInput3 = this.byId("input3");
        //     [oInput1, oInput2, oInput3].forEach(function(input) {
        //         input.setValueState("None");
        //     });
        //     if (!Number.isInteger(+sValue)) {
        //         oInput.setValueState("Error");
        //         oInput.setValueStateText("Please enter only integer values.");
        //     } else {
        //         var iValue = parseInt(sValue);
        //         if (iValue < 0) {
        //             oInput.setValueState("Error");
        //             oInput.setValueStateText("Number should be greater than or equal to 0.");
        //         } else if (iValue > 104) {
        //             oInput.setValueState("Error");
        //             oInput.setValueStateText("Number should be less than or equal to 104.");
        //         } else if (sId.includes("input2") && iValue % 4 !== 0) {
        //             oInput.setValueState("Error");
        //             oInput.setValueStateText("Number should be divisible by 4.");
        //         } else if (sId.includes("input3") && iValue % 12 !== 0) {
        //             oInput.setValueState("Error");
        //             oInput.setValueStateText("Number should be divisible by 12.");
        //         }
        //     }
        //     if (oInput.getValueState() === "Error") {
        //         oInput1.setValueState("Error");
        //         oInput2.setValueState("Error");
        //         oInput3.setValueState("Error");
        //     }
        // },
  
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



