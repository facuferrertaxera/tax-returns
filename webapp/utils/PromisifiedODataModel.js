sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Model",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/base/util/merge",
	"sap/ui/model/Context",
	"sap/base/util/isPlainObject",
	"sap/base/util/isEmptyObject",
	"sap/ui/model/odata/ODataUtils",
	"sap/base/Log"
], function(ODataModel, Model, ODataMetaModel, merge, BaseContext, isPlainObject, isEmptyObject, ODataUtils, Log) {
	"use strict";

	return ODataModel.extend("PromisifiedODataModel", {

		submitChanges: function(mParameters) {
			mParameters = mParameters || {};
			return new Promise(function(resolve, reject) {

				mParameters.success = function(response) {
					//As the SubmitChanges method returns the errors in the __batchResponse, we need to check for those manually
                    if(response.hasOwnProperty("__batchResponses")){
                        var batchErrorResponses = response.__batchResponses.filter(function(batchResponse) {
                            return batchResponse.response && (batchResponse.response.statusCode > 299 || batchResponse.response.statusCode < 200);
                        });
                        if (batchErrorResponses.length > 0) {
                            reject({
                                __batchResponses: batchErrorResponses
                            });
                        } else {
                            delete this._deferredDeleteRequests;

                            if(response.__batchResponses.length === 1 && response.__batchResponses[0].__changeResponses.length === 1){
                                if(response.__batchResponses[0].__changeResponses[0].body){
                                    resolve(JSON.parse(response.__batchResponses[0].__changeResponses[0].body).d);
                                }else{
                                    resolve(response);
                                }
                                
                            }else{
                                resolve(response);
                            }
    
                            
                        }
                    } else{
                        reject(response);
                    }
					
				}.bind(this);

				mParameters.error = function(response) {
					reject(response);
				};

				ODataModel.prototype.submitChanges.apply(this, [mParameters]);
			}.bind(this));
		},
		// Override the standard read to avoid Invalid Key Predicate Error.
		// If the object is transcient ('bCreated' flag is set) 
		// and it is related to navigation property (does not start with '/') the read backend call should not be executed
		// For completeness sake we are returning the abort function the framework expects and invoking the success handler of the caller.
		read: function(sPath, mParameters) {
			if (!sPath.startsWith('/') && mParameters && mParameters.context && mParameters.context.bCreated) {
				mParameters.success({results:[]}, undefined);
				return { abort : () => {}};
			}
			return ODataModel.prototype.read.apply(this, [sPath, mParameters]);
		},

		//Promisified version of READ. 
		promRead: function(sPath, mParameters) {
			mParameters = mParameters || {};
			var fnSuccess = mParameters.success,
				fnError = mParameters.error;
			return new Promise(function(resolve, reject) {

				mParameters.success = function(response) {
					if (fnSuccess) fnSuccess(response);
					resolve(response);
				};

				mParameters.error = function(response) {
					if (fnError) fnError(response);
					reject(response);
				};

				ODataModel.prototype.read.apply(this, [sPath, mParameters]);
			}.bind(this));
		},

		create: function(sPath, oData, mParameters) {
			mParameters = mParameters || {};
			return new Promise(function(resolve, reject) {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					reject(response);
				};

				ODataModel.prototype.create.apply(this, [sPath, oData, mParameters]);
			}.bind(this));
		},

		update: function(sPath, oData, mParameters) {
			mParameters = mParameters || {};
			return new Promise((resolve, reject) => {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					reject(response);
				};
                oData = this._removeNavProperties(oData);
				ODataModel.prototype.update.apply(this, [sPath, oData, mParameters]);
			});
		},

        _removeNavProperties: function(oData){
            var aDeleteProps = [];
            for (var prop in oData){ 
                if(oData[prop].hasOwnProperty("__list") || oData[prop].hasOwnProperty("__deffered") || prop.includes("__metadata")){
                    aDeleteProps.push({
                        property: prop,
                        deleteFlag: true
                    });
                } 
            };

            aDeleteProps.forEach((oDeleteProp)=>{
                delete oData[oDeleteProp.property];
            });

            return oData;
        },

		remove: function(sPath, mParameters) {
			mParameters = mParameters || {};
			return new Promise(function(resolve, reject) {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					//If a request fails in Deferred mode, it should be available next time we submit changes, so we add it again
					if (this.getDeferredGroups().indexOf(mParameters.groupId) >= 0) {
						ODataModel.prototype.remove.apply(this, [sPath, mParameters]);
					}
					reject(response);
				}.bind(this);

				var oDeleteRequest = ODataModel.prototype.remove.apply(this, [sPath, mParameters]);

				//If this is done in a deferred group, save the request to be cancelled when reset changes
				if (this.getDeferredGroups().indexOf(mParameters.groupId) >= 0) {
					this._deferredDeleteRequests = this._deferredDeleteRequests || [];
					this._deferredDeleteRequests.push(oDeleteRequest);
				}

			}.bind(this));
		},

		removeContext: function(oContext, mParameters) {
			return new Promise(function(resolve, reject) {
				if (oContext.bCreated) {
					this.deleteCreatedEntry(oContext);
					resolve();
				} else {
					return this.remove(oContext.getPath(), mParameters);
				}
			}.bind(this));
		},

		callFunction: function(sFunctionName, mParameters) {
			mParameters = mParameters || {};
			return new Promise(function(resolve, reject) {

				mParameters.success = function(response) {
					resolve(response);
				};

				mParameters.error = function(response) {
					reject(response);
				};

				ODataModel.prototype.callFunction.apply(this, [sFunctionName, mParameters]);
			}.bind(this));
		},

		resetChanges: function(sPath) {
			//This extention of the OData model also deletes the Created Contexts when resetting the changes
			Object.keys(this.mContexts)
				.map((sPath) => {
					return this.mContexts[sPath];
				})
				.filter((oCtx) => {
					return oCtx.bCreated;
				})
				.forEach((oCtx) => {
					this.deleteCreatedEntry(oCtx);
				});

			if (this._deferredDeleteRequests) {
				this._deferredDeleteRequests.forEach(function(oDeferredDeleteRequest) {
					oDeferredDeleteRequest.abort();
				});
				delete this._deferredDeleteRequests;
			}

			if (this._deferredDeleteRequests) {
				this._deferredDeleteRequests.forEach(function(oDeferredDeleteRequest) {
					oDeferredDeleteRequest.abort();
				});
				delete this._deferredDeleteRequests;
			}

			ODataModel.prototype.resetChanges.apply(this, [sPath]);
		},

		getEntityObjectPath: function(oObject) {
			return "/" + this.getKey(oObject);
		},

		//Standard "hasPendingChanges" method just check for Modified/Created entities. 
		//We want to check also the Deferred Deletions
		hasPendingChanges: function() {
			return ODataModel.prototype.hasPendingChanges.apply(this) || this._deferredDeleteRequests;
		},

        findContext: function(sPath){
            return Object.keys(this.mContexts).map((sContextPath) => {
                return this.mContexts[sContextPath];
            }).find((oCtx) => oCtx.sPath == sPath);
        }

	});
});