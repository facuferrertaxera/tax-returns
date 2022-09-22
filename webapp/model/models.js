sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "tech/taxera/vatreturns/app/vatreturns/utils/PromisifiedODataModel"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * @param {typeof sap.ui.model.odata.v2.ODataModel} PromisifiedODataModel
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, PromisifiedODataModel) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createViewModel: function () {
                var iVisibleRowCount = parseInt((window.innerHeight - 250 - 7 * 48 ) / 33);
                iVisibleRowCount = iVisibleRowCount >= 1 ? iVisibleRowCount : 1; 
                return new JSONModel({
                    busyIndicatorDelay: 0,
                    currentView: "vatReturnList",
                    vatReturnList: {
                        statusFilters: [],
                        searchValue: "",
                        headerExpanded: true,
                        sorter: {
                            path: "EntryDate",
                            descending: true
                        },
                        showDifference: true,
                        CompanyCodeValueState : "None",
                        FiscalYearValueState : "None",
                        EntryDateValueState : "None",
                        CompanyCodeValueStateText : "",
                        FiscalYearValueStateText : "",
                        EntryDateValueStateText : "",
                        EntryDateFrom: "",
                        EntryDateTo: "",
                        DateInput: "Both",
                        SelectedItems: [],
                        FormHeight: "auto",
                        ResultsTable: {
                            visibleRowCount: iVisibleRowCount ,
                            rowHeight: 33,
                            widths:{
                                EntryDate: Device.resize.width < 1400 ? "6rem" : "7rem",
                                DocumentNumber: Device.resize.width < 1400 ? "6.5rem" : "7.5rem",
                                DocumentType: Device.resize.width < 1400 ? "4rem" : "5rem",
                                SourceBaseAmount: Device.resize.width < 1400 ? "7rem": "8rem",
                                SourceTaxAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                SourceGrossAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                TaxeraBaseAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                TaxeraTaxAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                TaxeraGrossAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                DifferencesBaseAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                DifferencesTaxAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                DifferencesGrossAmount: Device.resize.width < 1400 ? "7rem" : "8rem",
                                Status: Device.resize.width < 1400 ? "7rem" : "8rem"
                            }
                        }
                    }
                });

                
            },

            createMainModel: function () {
                return new PromisifiedODataModel("/sap/opu/odata/TAXERA/VAT_UI_O2/", {
                    defaultBindingMode: "TwoWay",
                    refreshAfterChange: false,
                    annotationURI: [
                        "/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName='%2FTAXERA%2FVAT_UI_O2_VAN',Version='0001')/$value/",
                        jQuery.sap.getModulePath("tech.taxera.vatreturns.app.vatreturns", "/annotations/annotation.xml")
                    ]
                });
            }
        };
    });