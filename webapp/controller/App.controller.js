sap.ui.define([
    "tech/taxera/vatreturns/app/vatreturns/controller/BaseController",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
], function (BaseController, FlexibleColumnLayoutSemanticHelper) {
    "use strict";

    return BaseController.extend("tech.taxera.vatreturns.app.vatreturns.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 */
        onInit: function () {
            this.getRouter().getRoute("RouteVatReturnList").attachMatched(this._onVatReturnListMatched, this);
            this.getRouter().getRoute("RouteVatReturnSummary").attachMatched(this._onVatReturnSummaryMatched, this);
            this.getRouter().getRoute("RouteVatReturnDetail").attachMatched(this._onVatReturnDetailMatched, this);
        },

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
        getFCLHelper: function () {
            var oFCL = this.byId("fcl"),
                oSettings = {
                    defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsBeginExpanded,
                    initialColumnsCount: 1,
                    maxColumnsCount: 2
                };
            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        },

		/**
		 * Handler for the vatReturn List route matched
		 */
        _onVatReturnListMatched: function () {
            this.getModel("view").setProperty("/fclLayout", this.getFCLHelper().getNextUIState(0));
            this.byId("fcl").toBeginColumnPage(this.getOwnerComponent().createId("VatReturnList"));
            this.getModel("view").setProperty("/currentView", "VatReturnList");

        },

        /**
		 * Handler for the vatReturn List route matched
		 */
        _onVatReturnSummaryMatched: function () {
            this.getModel("view").setProperty("/fclLayout", this.getFCLHelper().getNextUIState(0));
            this.byId("fcl").toBeginColumnPage(this.getOwnerComponent().createId("VatReturnSummary"));
            this.getModel("view").setProperty("/currentView", "VatReturnSummary");

        },

        /**
		 * Handler for the vatReturn List route matched
		 */
        _onVatReturnDetailMatched: function () {
            this.getModel("view").setProperty("/fclLayout", this.getFCLHelper().getNextUIState(0));
            this.byId("fcl").toBeginColumnPage(this.getOwnerComponent().createId("VatReturnDetail"));
            this.getModel("view").setProperty("/currentView", "VatReturnDetail");

        }

    });
});