sap.ui.define([
	"sap/ui/model/type/Date",
	"sap/ui/model/type/DateTime",
	"sap/ui/model/odata/type/String",
	"sap/ui/model/odata/type/Decimal",
    "sap/ui/core/format/DateFormat"
], function(DateType, DateTime, StringType, Decimal, DateFormat) {
	"use strict";

	return {

		TaxeraDateType: DateType.extend("TaxeraDateType", {
			constructor: function(oFormatOptions, oConstraints) {
				var oStandardFormatOptions = jQuery.extend({
					pattern: "dd.MM.yyyy",
					UTC: true
				}, oFormatOptions);
				DateType.call(this, oStandardFormatOptions, oConstraints);
			}
		}),

        TaxeraDateTimeType: DateTime.extend("TaxeraDateTimeType", {
			constructor: function(oFormatOptions, oConstraints) {
				var oStandardFormatOptions = jQuery.extend({
					pattern: "dd.MM.yyyy, HH:mm",
					UTC: true
				}, oFormatOptions);
				DateTime.call(this, oStandardFormatOptions, oConstraints);
			}
		}),

		AbapBoolean: StringType.extend("sap/ui/model/odata/type/String", {
			formatValue: function(oValue, sInternalType) {
				var sValueType = typeof oValue;
				switch (sValueType) {
					case "boolean":
						return oValue;
					case "string":
						oValue = oValue.toUpperCase();
						return (oValue === "X" || oValue === "TRUE" || oValue === "1");
					case "int":
					case "float":
						return (oValue === 1);
					default:
						return oValue;
				}
			},
			parseValue: function(bValue, sInternalType) {
				var sStyle = "ABAP";
				switch (sStyle) {
					case "ABAP": // EDM.String
						return bValue ? 'X' : ' ';
					case "BOOLSTRING": // EDM.String
						return bValue ? 'true' : 'false';
					default: // EDM.Boolean
						return bValue;
				}
			}
		}),

        TaxeraTimestampl: StringType.extend("TaxeraTimestampl", {
			formatValue: function(oValue, sInternalType) {
                if(oValue){
                    oValue = oValue.split(".")[0].substr(0,13);

                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "dd/MM/yyyy"
                    });
                    
                    return oDateFormat.format(new Date(oValue.substr(0,4), oValue.substr(4,2) -1, oValue.substr(6,2)));
                }else{
                    return "";
                }
                
			}
		}),

		TaxeraDecimal: Decimal.extend("TaxeraDecimal", {
			constructor: function(oFormatOptions, oConstraints) {
				var oStandardFormatOptions = jQuery.extend({
					decimals: 2
				}, oFormatOptions);
				Decimal.call(this, oStandardFormatOptions, oConstraints);
			}
		})
	};
});