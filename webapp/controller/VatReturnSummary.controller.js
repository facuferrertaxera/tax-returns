sap.ui.define([
    "tech/taxera/vatreturns/app/vatreturns/controller/BaseController",
    "tech/taxera/vatreturns/app/vatreturns/utils/types",
    "tech/taxera/vatreturns/app/vatreturns/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param types
     * @param formatter
     */
    function (BaseController, types, formatter) {
        "use strict";

        return BaseController.extend("tech.taxera.vatreturns.app.vatreturns.controller.VatReturnSummary", jQuery.extend({
            types: types,
            formatter: formatter,

            onInit: function () {
                this.getRouter().getRoute("RouteVatReturnSummary").attachMatched(this._onVatReturnSummaryMatched, this);

            },

            onTitleStateChange: function (oEvent) {
                this.getModel("view").setProperty("/vatReturnSummary/headerExpanded", oEvent.getParameter("isExpanded"));
                this.getOwnerComponent().onResizeScreen({
                    height: window.innerHeight,
                    width: window.innerWidth
                });
            },

            /**
            * Handler for the VatReturn List route matched
            */
            _onVatReturnSummaryMatched: function (oEvent) {
                var oArgs = oEvent.getParameter("arguments"),
                    sPath = `/VatHeader('${oArgs.VatId}')`;
                if (oArgs.VatId) {
                    this.getView().bindElement({
                        path: sPath,
                        parameters: {
                            expand: "to_VatTaxSummary"
                        },
                        events: {
                            dataRequested: () => this.getView().setBusy(true),
                            dataReceived: () => this.getView().setBusy(false)
                        }
                    });
                }


            },

            onSummaryItemPress: function(oEvent){
                var oSummaryItem = oEvent.getSource().getBindingContext().getObject();
                this.navToDirect("RouteVatReturnDetail", {
                    VatId: oSummaryItem.VatId
                });
            }
        }, {}));
    });
