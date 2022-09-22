sap.ui.define([
    "sap/ui/core/Fragment"
], function (Fragment) {
    "use strict";

    return {

		/**
		 * Opens the  VatReturn dialog
		 */
        openNewVatReturn: function () {
            this._getNewVatReturnDialog().then(function (oVatReturnDialog) {
                this.oVatReturnDialog = oVatReturnDialog;
                this.oVatReturnDialog.open();
            }.bind(this));
        },

		/**
		 * Gets a reference to the VatReturn Dialog
		 * If not yet loaded, it will load the dialog first
		 */
        _getNewVatReturnDialog: function () {
            var oRootControl = this.getOwnerComponent().getRootControl();
            var oVatReturnDialog = oRootControl.byId("VatReturnDialog");
            if (!oVatReturnDialog) {
                return Fragment.load({
                    id: oRootControl.getId(),
                    name: "tech.taxera.vatreturns.app.vatreturns.view.newVATReturn.NewVatReturn",
                    controller: this
                }).then(function (oDialog) {
                    oRootControl.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            } else {
                return Promise.resolve(oVatReturnDialog);
            }
        },

        onCreateNewVATCancel: function () {
            var oRootControl = this.getOwnerComponent().getRootControl(),
                oSmartFilter = oRootControl.byId("NewVatsmartFilterBar");
            oRootControl.byId("VatReturnDialog").close();

            oSmartFilter.fireClear();
        },

        onCreateNewVAT: function () {
            var oRootControl = this.getOwnerComponent().getRootControl(),
                oSmartFilter = oRootControl.byId("NewVatsmartFilterBar");

            if(oSmartFilter.validateMandatoryFields()){
                oSmartFilter.search();
                this.oVatReturnDialog.setBusy(true);
                this.later(5000).then(()=>{
                    this.oVatReturnDialog.setBusy(false);
                    oSmartFilter.fireClear();
                    this.oVatReturnDialog.close();
                });
            }

            
        }

    };

});