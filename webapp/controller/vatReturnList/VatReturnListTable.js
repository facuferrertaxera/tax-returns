sap.ui.define(["tech/taxera/vatreturns/app/vatreturns/controller/newVatReturn/NewVATReturn"], function (NewVATReturn) {
    "use strict";

    return jQuery.extend({
        _refreshTable: function () {
            var oTable = this.getView().byId("vatReturnsTable");
            var oBinding = oTable.getBinding("items");
            oBinding.refresh(true);
        },

        onNewVATReturn: function (oEvent) {
            this.openNewVatReturn();
        },

        onSubmit: function (oEvent) {
            var oTable = this.getView().byId("vatReturnsTable"),
                aItems = oTable.getSelectedItems(),
                aVatReturns = aItems.map((oItem) => oItem.getBindingContext().getObject());

            var aPromises = aVatReturns.map((oVatReturn) => this.getModel().callFunction("/SubmitVat", {
                method: "POST",
                urlParameters: {
                    VatId: oVatReturn.VatId
                }
            }));

            Promise.all(aPromises).then((aResponses) => {
                this.getModel().resetChanges();
            }).finally(() => {
                this.getView().setBusy(false);
            }).catch((oError) => {
                this.showErrorMessage(oError);
                this.getView().setBusy(false);
            });
        },

        onSelectedVatChange: function (oEvent) {
            var oTable = this.getView().byId("vatReturnsTable"),
                aItems = oTable.getSelectedItems(),
                aVatReturns = aItems.map((oItem) => oItem.getBindingContext().getObject());
            aVatReturns = aVatReturns.filter((oVatReturn) => oVatReturn.Status !== "S");

            this.getModel("view").setProperty("/vatReturnList/SelectedItems", aVatReturns || []);
        },

        onVatReturnPress: function (oEvent) {
            var oVatReturn = oEvent.getSource().getBindingContext().getObject();
            this.navToDirect("RouteVatReturnSummary", {
                VatId: oVatReturn.VatId
            });
        }
    }, NewVATReturn);
});