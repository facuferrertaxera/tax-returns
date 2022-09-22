sap.ui.define(["tech/taxera/vatreturns/app/vatreturns/controller/newVatReturn/NewVATReturn"], function (NewVATReturn) {
    "use strict";

    return jQuery.extend({
        _refreshTable: function () {
            var oTable = this.getView().byId("vatReturnsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.refresh(true);
        },

        onNewVATReturn: function(oEvent) {
            this.openNewVatReturn();
        },

        onVatReturnPress: function(oEvent){
            var oVatReturn = oEvent.getSource().getBindingContext().getObject();
            this.navToDirect("RouteVatReturnSummary", {
				VatId: oVatReturn.VatId
			});
        }
    }, NewVATReturn);
});