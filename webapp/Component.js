sap.ui.define([
    "sap/ui/core/UIComponent",
    "tech/taxera/vatreturns/app/vatreturns/model/models",
    "sap/f/IllustrationPool",
    "sap/ui/Device"
],
    function (UIComponent, models, IllustrationPool, Device) {
        "use strict";

        return UIComponent.extend("tech.taxera.vatreturns.app.vatreturns.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //set view model
                this.setModel(models.createViewModel(), "view");

                Device.resize.attachHandler(this.onResizeScreen.bind(this));

                // set the main model
                var oMainModel = models.createMainModel();
                this.setModel(oMainModel);
                sap.ui.getCore().setModel(oMainModel);

                var oTntSet = {
                    setFamily: "tnt",
                    setURI: sap.ui.require.toUrl("sap/tnt/themes/base/illustrations")
                };

                // register tnt illustration set
                IllustrationPool.registerIllustrationSet(oTntSet, false);
            },

            onResizeScreen: function (mParams) {
                this.getModel("view").setProperty("/vatReturnList/headerDirection",
                    mParams.width < 1100 ? 'Column' : 'Row'
                );

                let widthTableThreshold = 1588;

                this.getModel("view").setProperty("/vatReturnList/ResultsTable/widths", {
                    EntryDate: mParams.width < widthTableThreshold ? "6rem" : "7rem",
                    DocumentNumber: mParams.width < widthTableThreshold ? "6.5rem" : "7.5rem",
                    DocumentType: mParams.width < widthTableThreshold ? "4rem" : "5rem",
                    SourceBaseAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    SourceTaxAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    SourceGrossAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    TaxeraBaseAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    TaxeraTaxAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    TaxeraGrossAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    DifferencesBaseAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    DifferencesTaxAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    DifferencesGrossAmount: mParams.width < widthTableThreshold ? "7rem" : "8rem",
                    Status: mParams.width < widthTableThreshold ? "7rem" : "8rem"
                });
                
                var iRowHeight = this.getModel("view").getProperty("/vatReturnList/ResultsTable/rowHeight");
                var bHeaderExpanded = this.getModel("view").getProperty("/vatReturnList/headerExpanded");
                var dTableHeight = bHeaderExpanded ? mParams.height - 250 - 7 * 48 :  mParams.height - 7 * 48;
                var iVisibleRowCount = parseInt(dTableHeight / iRowHeight);
                iVisibleRowCount = iVisibleRowCount >= 1 ? iVisibleRowCount : 1; 
                this.getModel("view").setProperty("/vatReturnList/ResultsTable/visibleRowCount", iVisibleRowCount);
                
            }
        });
    }
);