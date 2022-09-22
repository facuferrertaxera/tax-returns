sap.ui.define([
    "tech/taxera/vatreturns/app/vatreturns/controller/BaseController",
    "tech/taxera/vatreturns/app/vatreturns/controller/vatReturnList/VatReturnListTable",
    "tech/taxera/vatreturns/app/vatreturns/utils/types",
    "tech/taxera/vatreturns/app/vatreturns/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     * @param types
     * @param formatter
     */
    function (BaseController, vatReturnListTableMixin, types, formatter) {
        "use strict";

        return BaseController.extend("tech.taxera.vatreturns.app.vatreturns.controller.VatReturnList", jQuery.extend({
            types: types,
            formatter: formatter,

            onInit: function () {
                this.getRouter().getRoute("RouteVatReturnList").attachMatched(this._onVatReturnListMatched, this);

            },

            onTitleStateChange: function (oEvent) {
                this.getModel("view").setProperty("/vatReturnList/headerExpanded", oEvent.getParameter("isExpanded"));
                this.getOwnerComponent().onResizeScreen({
                    height: window.innerHeight,
                    width: window.innerWidth
                });
            },

            /**
            * Handler for the VatReturn List route matched
            */
            _onVatReturnListMatched: function () {
                sap.ushell.Container.getServiceAsync("UserInfo").then((UserInfo) => {
                    return UserInfo.getId().replace(/\D/g, '');
                }).then((sUserId) => {
      
                });

            }
        }, vatReturnListTableMixin));
    });
