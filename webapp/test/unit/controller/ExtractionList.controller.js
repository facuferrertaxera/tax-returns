/*global QUnit*/

sap.ui.define([
	"techtaxerataxreturnsapp/taxreturns/controller/vatReturnList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("vatReturnList Controller");

	QUnit.test("I should test the vatReturnList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
