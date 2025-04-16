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


