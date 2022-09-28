sap.ui.define([
    "tech/taxera/vatreturns/app/vatreturns/controller/BaseController",
    "tech/taxera/vatreturns/app/vatreturns/utils/types",
    "tech/taxera/vatreturns/app/vatreturns/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param types
     * @param formatter
     */
    function (BaseController, types, formatter, Filter, FilterOperator) {
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
                var oArgs = oEvent.getParameter("arguments");
                this.getView().setModel(this.getView().getModel(),"totals");
                this._bindView(oArgs.VatId);
                this._bindTotals(oArgs.VatId);
            },

            _bindView: function (sVatId) {
                if (sVatId) {
                    this.getView().bindElement({
                        path: `/VatTaxSummary`,
                        events: {
                            dataRequested: () => this.getView().setBusy(true),
                            dataReceived: () => this.getView().setBusy(false)
                        }
                    });

                    this.getView().getModel().promRead(`/VatTaxSummary`,
                    {
                        filters: [new Filter({
                            path: "VatId",
                            operator: FilterOperator.EQ,
                            value1: sVatId
                        })]
                    })
                    .then((oResponse) => {
                        var oTotal = oResponse.results.pop();
                        var sPath = this.getModel().getEntityObjectPath(oTotal);
                        var oContext = this.getView().getModel().createEntry(sPath, {
                            properties: oTotal
                        });

                        this.getView().setBindingContext(oContext);

                    });
                }
            },

            _bindTotals: function (sVatId) {

                this.getView().getModel("totals").promRead(`/VatTaxSummary`,
                    {
                        filters: [new Filter({
                            path: "VatId",
                            operator: FilterOperator.EQ,
                            value1: sVatId
                        })],
                        urlParameters: { "$select": "VatId,TaxBaseAmount,TaxPayable,DeductInputTax,TaxBalance,NonDeductInputTax,GrossAmount,CurrencyCode" }
                    })
                    .then((oResponse) => {
                        var oTotal = oResponse.results.pop();
                        var sPath = this.getModel("totals").getEntityObjectPath(oTotal);
                        var oContext = this.getView().getModel("totals").createEntry(sPath, {
                            properties: oTotal
                        });

                        this.getView().setBindingContext(oContext,"totals");

                    });
            },

            onDisplayItems: function (oEvent) {
                var oSummaryItem = oEvent.getSource().getBindingContext().getObject();
                this.navToDirect("RouteVatReturnDetail", {
                    VatId: oSummaryItem.VatId
                });
            }
        }, {}));
    });
