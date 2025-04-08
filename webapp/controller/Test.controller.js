sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
     var that;
    return Controller.extend("sample.controller.Test", {
        onInit() {
            that=this;
            var oResourceModel = this.getOwnerComponent().getModel("i18n");
            var oResourceBundle = oResourceModel.getResourceBundle();
            var sTitle = oResourceBundle.getText("title");
            this.byId("Text").setText(sTitle);
            var sGreeting = oResourceBundle.getText("greeting");
            this.byId("greetingText").setText(sGreeting)

            var oUnique= that.getOwnerComponent().getModel();
            oUnique.read("/EmployeeInfo",{
                success: function (oData) {
                var uniqueDepartments = [];
                oData.results.forEach(function (employee) {
                    var department = employee.Department;
                    
                })
            }
            })
        },
        formatJoiningDate: function (sDate) {
            if (sDate) {
                var oDate = new Date(sDate);
                var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                return oFormatter.format(oDate);
            }
        },
    });
});