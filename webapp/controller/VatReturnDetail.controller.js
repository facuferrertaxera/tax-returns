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

        return BaseController.extend("tech.taxera.vatreturns.app.vatreturns.controller.VatReturnDetail", jQuery.extend({
            types: types,
            formatter: formatter,

            onInit: function () {
                this.getRouter().getRoute("RouteVatReturnDetail").attachMatched(this._onVatReturnDetailMatched, this);

            },

            onTitleStateChange: function (oEvent) {
                this.getModel("view").setProperty("/vatReturnDetail/headerExpanded", oEvent.getParameter("isExpanded"));
                this.getOwnerComponent().onResizeScreen({
                    height: window.innerHeight,
                    width: window.innerWidth
                });
            },

            /**
            * Handler for the VatReturn List route matched
            */
            _onVatReturnDetailMatched: function (oEvent) {
                var oArgs = oEvent.getParameter("arguments");
                this.VatId = oArgs.VatId;
                this.getView().setModel(this.getView().getModel(), "totals");
                this._bindView(oArgs.VatId);
                this._bindHeaderTotals(oArgs.VatId);
                this._bindBodyTotals(oArgs.VatId);

            },
            _bindView: function (sVatId) {
                this.getView().byId("vatReturnDetailInputSTable").setModel(this.getView().getModel());
                if (sVatId) {
                    this.getView().bindElement({
                        path: `/VatHeader('${sVatId}')`,
                        parameters: {
                            expand: "to_VatDocument"
                        },
                        events: {
                            dataRequested: () => this.getView().setBusy(true),
                            dataReceived: () => {
                                this.getView().setBusy(false);
                                this.getView().byId("vatReturnDetailInputSTable").rebindTable(true);
                            }
                        }
                    });
                }
                this.getView().byId("vatReturnDetailOutputSTable").setModel(this.getView().getModel());
                if (sVatId) {
                    this.getView().bindElement({
                        path: `/VatHeader('${sVatId}')`,
                        parameters: {
                            expand: "to_VatDocument"
                        },
                        events: {
                            dataRequested: () => this.getView().setBusy(true),
                            dataReceived: () => {
                                this.getView().setBusy(false);
                                this.getView().byId("vatReturnDetailOutputSTable").rebindTable(true);
                            }
                        }
                    });
                }
            },

            _bindHeaderTotals: function (sVatId) {
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

                        this.getView().byId("HeaderFlexBox").setBindingContext(oContext, "totals");
                    });
            },

            _bindBodyTotals: function (sVatId) {
                this.getView().getModel("totals").promRead(`/VatTaxSummary`,
                    {
                        filters: [
                            new Filter({
                                path: "VatId",
                                operator: FilterOperator.EQ,
                                value1: sVatId
                            }), new Filter({
                                path: "InOutTax",
                                operator: FilterOperator.EQ,
                                value1: this.getModel("view").getProperty("/vatReturnDetail/selectedDocType")
                            })
                        ],
                        urlParameters: { "$select": "VatId,TaxBaseAmount,TaxPayable,DeductInputTax,TaxBalance,NonDeductInputTax,GrossAmount,CurrencyCode" }
                    })
                    .then((oResponse) => {
                        var oTotal = oResponse.results.pop();
                        var sPath = this.getModel("totals").getEntityObjectPath(oTotal);
                        var oContext = this.getView().getModel("totals").createEntry(sPath, {
                            properties: oTotal
                        });

                        this.getView().byId("vatReturnDetailOutputSTable").setBindingContext(oContext, "totals");
                        this.getView().byId("vatReturnDetailInputSTable").setBindingContext(oContext, "totals");
                    });
            },

            onSelectedDocTypeChange: function () {
                this.getView().byId("vatReturnDetailInputSTable").rebindTable(true);
                this.getView().byId("vatReturnDetailOutputSTable").rebindTable(true);
                this._bindBodyTotals(this.VatId);
            },

            onBeforeRebind: function (oEvent) {
                var oBinding = oEvent.getParameter("bindingParams"),
                    sDocType = this.getModel("view").getProperty("/vatReturnDetail/selectedDocType");
                oBinding.filters.push(new Filter({
                    path: "InOutTax",
                    operator: FilterOperator.EQ,
                    value1: sDocType
                }));

                oBinding.filters.push(new Filter({
                    path: "VatId",
                    operator: FilterOperator.EQ,
                    value1: this.VatId
                }));
            }
        }, {}));
    });
