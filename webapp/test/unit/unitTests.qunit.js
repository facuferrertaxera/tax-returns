/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"techtaxerataxreturnsapp/taxreturns/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
