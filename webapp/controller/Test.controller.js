    sap.ui.define([ 
    "sap/ui/core/mvc/Controller", 
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator", 
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog"
], function (Controller, Filter, FilterOperator, JSONModel,MessageToast, ValueHelpDialog) { 
    "use strict"; 
    var that;
    return Controller.extend("sample.controller.Test", { 
        onInit: function () {
            that = this;
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
        onDepartmentValueHelp: function () {
            if (!that.Department) {
                that.Department = sap.ui.xmlfragment("sample.Fragments.Department", that);
                that.getView().addDependent(that.Department);
            }
            var oModel = that.getView().getModel();
            oModel.read("/EmployeeInfo", {
                success: function (oData) {
                    var aDepartments = [];
                    var uniqueDepartments = []; 
                    oData.results.forEach(function (employee) {
                        var department = employee.Department;
                         if (department && uniqueDepartments.indexOf(department) === -1) {
                            uniqueDepartments.push(department); 
                         }
                    });
                    uniqueDepartments.forEach(function (dept) {
                        aDepartments.push({ 
                            Department: dept 
                        });
                    });
                    var oDeptModel = new JSONModel(aDepartments);
                    that.Department.setModel(oDeptModel, "departmentModel");
                    that.Department.open();
                },
                error: function () {
                    MessageToast.show("Error loading departments.");
                }
            });
        },
        onDepartment: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sSelectedDepartment = oSelectedItem.getTitle(); 
            that.Department.close();
            var oList = that.byId("employeeList");
            var oBinding = oList.getBinding("items");
            var aFilters = [];
            if (sSelectedDepartment) {
                aFilters.push(new Filter("Department", FilterOperator.EQ, sSelectedDepartment)); 
            }
            oBinding.filter(aFilters);
        },
        
        onCloseDialog:function(){
            that.Department.close();
        },
        onNavigation: function (oEvent) {   
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
            var employeeId = oData.ID;
            this.getOwnerComponent().getRouter().navTo("Test1", {
                employeeId: employeeId,
            });
        }  
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



