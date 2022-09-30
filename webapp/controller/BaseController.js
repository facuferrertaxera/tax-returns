/*global history */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, MessageBox, HashChanger, Device, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("tech.taxera.vatreturns.app.vatreturns.controller.BaseController", {

        constructor: function () {
            this._oPresentMessageModel = new JSONModel([]);
        },


        /**
		 * Wrapper function to navigate to the due route without checking for pending changes
		 * @public
		 * @param {string} aRouteName of the route
		 * @param {object} oParameters of the route
		 */
        navToDirect: function (aRouteName, oParameters, bReplace) {
            this.getOwnerComponent().getRouter().navTo(aRouteName, oParameters, bReplace);
        },
        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

		/**
		 * Get translation value by key sKey and params aParams
		 */
        i18n: function (sKey, aParams) {
            return this.getModel("i18n").getResourceBundle().getText(sKey, aParams);
        },

		/**
		 * Convenience function to get sap.ui.Core Message Manager
		 * @returns {object} sap.ui.core.message.MessageManager
		 * @public
		 */
        getMessageManager: function () {
            return sap.ui.getCore().getMessageManager();
        },

		/**
		 * Helper private method to confirm deletion of an item and fire the deletion.
		 * @param {object} oRecord - Element to be deleted
		 * @param {string} sMessage - Message to show for confirmation
		 * @returns {object} Promise
		 */
        _confirmDeleteItem: function (oRecord, sMessage) {
            return new Promise(function (resolve) {
                MessageBox.confirm(sMessage, {
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            resolve(oRecord);
                        } else {
                            resolve();
                        }
                    }
                });
            });
        },

		/**
		 * Internal method to rematch the current route: It will trigger all the current route matched events
		 */
        _rematchRoute: function () {
            var oHashChanger = HashChanger.getInstance();
            this.getRouter().parse(oHashChanger.getHash());
        },

        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (!Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        },

        _changeRoute: function (sNewRoute) {
            var oHashChanger = HashChanger.getInstance();
            oHashChanger.setHash(sNewRoute);
        },

        checkIfEmpty: function (object) {
            if (Object.entries(object).length === 0) {
                return true;
            }
            return false;
        },

        checkIfObject: function (suspectedObject) {
            return typeof suspectedObject === 'object' &&
                !Array.isArray(suspectedObject) &&
                suspectedObject !== null;
        },

        delay: function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        _openMessageDialog: function () {
            if (!this._oMessageDialog) {
                Fragment.load({
                    name: "tech.taxera.vatreturns.app.vatreturns.utils.MessageDialog",
                    controller: this
                }).then(function (oNewMessageDialog) {
                    this._oMessageDialog = oNewMessageDialog;
                    this._oMessageDialog.setModel(this._oPresentMessageModel, "messages");
                    this._oMessageDialog.getContent()[0].navigateBack();
                    this._oMessageDialog.open();
                }.bind(this));
            } else {
                this._oMessageDialog.setModel(this._oPresentMessageModel, "messages");
                this._oMessageDialog.getContent()[0].navigateBack();
                this._oMessageDialog.open();
            }
        },

        onMessageDialogClose: function () {
            this._oMessageDialog.close();
        },

        showErrorMessage: function (oError) {
            var sMessage = this._getErrorMessage(oError),
                sMessage = sMessage.replace(/&/g, ""),
                sTitle = this.i18n("Error"),
                aDetails = this._getErrorMessageDetails(oError) || [];
            aDetails = aDetails.map((oDetail) => {
                return {
                    type: oDetail.type,
                    message: oDetail.message.replace(/&/g, ""),
                    description: oDetail.description
                }
            });
            if (aDetails.length > 0) {
                this._oPresentMessageModel.setData(aDetails);
                this._openMessageDialog();
            } else {
                MessageBox.error(sMessage, {
                    title: sTitle
                });
            }
        },

        _getErrorMessage: function (oError) {
            if (oError.hasOwnProperty("responseText")) {
                return JSON.parse(oError.responseText).error.message.value;

            }
            if (oError.hasOwnProperty("response") && oError.response.hasOwnProperty("body")) {
                return JSON.parse(oError.response.body).error.message.value;
            }
            if (oError.hasOwnProperty("message")) {
                return oError.message;
            }
        },

        _getErrorMessageDetails: function (oError) {
            var sMessage = "";
            if (oError.hasOwnProperty("responseText")) {
                var oErrorDetail = JSON.parse(oError.responseText);
                if (oErrorDetail.hasOwnProperty("error")) {
                    if (oErrorDetail.error.hasOwnProperty("innererror")) {
                        if (oErrorDetail.error.innererror.hasOwnProperty("errordetails")) {
                            if (oErrorDetail.error.innererror.errordetails.length >= 1) {
                                return oErrorDetail.error.innererror.errordetails;
                            }
                        }
                    }
                }
            }

            if (oError.hasOwnProperty("details")) {
                if (oError.details.length >= 1) {
                    return oError.details;
                }

            }

            return [];
        },

        later: function (delay) {
            return new Promise(function (resolve) {
                setTimeout(resolve, delay);
            });
        }
    });

});