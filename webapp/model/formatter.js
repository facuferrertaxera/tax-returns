sap.ui.define([
    "sap/ui/core/IconColor",
    "tech/taxera/vatreturns/app/vatreturns/utils/types",
    "sap/ui/core/ValueState"
], function (IconColor, types, ValueState) {
    "use strict";
    return {

		/**
		 * Formats status color
		 * @param {string} sStatus - Strategy Status
		 * @returns {string} sColor - Semantic Color
		 */
        formatStatusColor: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return ValueState.Success;
                case "E":
                    return ValueState.Error;
                case "N":
                    return ValueState.None;
                default:
                    return ValueState.None;
            }
        },

        /**
		 * Formats status color
		 * @param {string} sStatus - Strategy Status
		 * @returns {string} sText - Semantic Color
		 */
        formatStatusText: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return ValueState.Success;
                case "E":
                    return ValueState.Error;
                case "N":
                    return ValueState.None;
                default:
                    return ValueState.None;
            }
        },

        /**
		 * Formats status color
		 * @param {string} sStatus - Strategy Status
		 * @returns {string} sColor - Semantic Color
		 */
        formatStatusIcon: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return "sap-icon://sys-enter-2";
                case "E":
                    return "sap-icon://sys-cancel-2";
                case "N":
                    return "sap-icon://write-new-document";
                default:
                    return "";


            }
        },

		/** 
		 * Capitalizes a string
		 * @param {string} sString - String to be capitalized
		 * @returns {string} sCapitalized - Capitalized string
		 */
        capitalize: function (sString) {
            if (typeof sString !== 'string') return '';
            return sString.charAt(0).toUpperCase() + sString.slice(1);
        },

        severityToColor: function (sSeverity) {
            return {
                "HIGH": IconColor.Negative,
                "MEDIUM": IconColor.Critical,
                "LOW": IconColor.Positive
            }[sSeverity] || IconColor.Neutral;
        },

        trimTo: function (sText, iLength) {
            return sText.length > iLength ? (sText.substring(0, iLength) + "...") : sText;
        },

        formatToStr: function (iValue) {
            try {
                iValue.toString();
            } catch (err) {
                iValue = "err";
            }
            return iValue.toString();
        },
        getvatReturnText: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return "Success";
                case "F":
                    return "Failed";
                default:
                    return "";
            }
        },
        getActiveStatus: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return true;
                case "F":
                    return false;
                default:
                    return false;
            }
        },
        getvatReturnColor: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return ValueState.Success;
                case "F":
                    return ValueState.Error;
                default:
                    return ValueState.None;
            }

        },

        getValidationText: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return "Success";
                case "F":
                    return "Failed";
                default:
                    return "";
            }
        },
        getValidationColor: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return ValueState.Success;
                case "F":
                    return ValueState.Error;
                default:
                    return ValueState.None;
            }

        },
        getXmlReconText: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return "Success";
                case "F":
                    return "Failed";
                default:
                    return "Success";
            }
        },
        getXmlReconColor: function (sStatus) {
            switch (sStatus) {
                case "S":
                    return ValueState.Success;
                case "F":
                    return ValueState.Error;
                default:
                    return ValueState.Success;
            }

        },

        mapErrorTypes: function (sErrorType) {
            switch (sErrorType) {
                case "S":
                    return ValueState.Success;
                case "E":
                    return ValueState.Error;
                case "I":
                    return ValueState.Information;
                case "W":
                    return ValueState.Warning;
                default:
                    return ValueState.None;
            }
        },

        mapSegments: function (sSegmentType) {
            var ovatReturn = this.getView().getBindingContext().getObject({
                expand: "to_DataPreparation"
            });
            var oSelectedSegment = ovatReturn.to_DataPreparation.find((oSegment) => {
                return oSegment.SegmentId === sSegmentType;
            });
            if (oSelectedSegment) {
                return oSelectedSegment.SegmentName;
            } else {
                return "";
            }

        },
        getReextractEnabled: function (svatReturnStatus, sReconciliationStatus, sValidationStatus) {
            return svatReturnStatus === "F" ? true :
                sReconciliationStatus === "F" ? true :
                    sValidationStatus === "F" ? true : false;

        },

        formatVisibleDurationText: function (oStartDate, oEndDate) {
            var dateType, startDate, endDate;
            if (oStartDate && oEndDate) {
                dateType = new this.types.TaxeraDateType();
                startDate = dateType.formatValue(oStartDate, "string")
                endDate = dateType.formatValue(oEndDate, "string")
                return startDate + "\u00A0" + "to" + "\u00A0" + endDate;
            }
        }

    };
});