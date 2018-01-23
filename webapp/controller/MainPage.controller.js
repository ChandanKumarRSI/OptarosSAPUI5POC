sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	//"use strict";

	return Controller.extend("OptarosSAPUI5POC.controller.MainPage", {
		
		onInit : function(){
    	
   	that = this;
       	  
       	  	var sURL = "/V2/Northwind/Northwind.svc/";
			var oDataModel = new sap.ui.model.odata.ODataModel(sURL);

			oDataModel.read("Products", null, {
				//	"$orderby": "name",
					"$format": "json"
				},
				false,
				function(success, oResponse) {
					var obj = JSON.parse(oResponse.body);
				     var oData = obj.d.results;
				  
				     var oModel = new JSONModel();
				     oModel.setData(oData);
				     that.oView.setModel(oModel);
				     
				},
				function(oError) {
				//	console.log(oError);
				});
		
   
    },
  onSuccess : function(result){
  //console.log("Success:"+result);
   },
  onError : function(result) {
  //console.log("Error:"+result);
  },
    onPressCallDial : function(){
 
       var number = "+919140098110";
       var bypassAppChooser = false;
    	window.plugins.CallNumber.callNumber(this.onSuccess, this.onError, number, bypassAppChooser);
    	
    },
		
        onPressLogout : function(){
            window.location.reload(true);
        }
	});
});