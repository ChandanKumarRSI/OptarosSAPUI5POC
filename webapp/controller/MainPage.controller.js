sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	//"use strict";

	return Controller.extend("OptarosSAPUI5POC.controller.MainPage", {
		
		onInit : function(){
			 if(localStorage.getItem("localCallData") !== null){
            var oCallData = JSON.parse(localStorage.getItem("localCallData"));
			var oLocalCallModel = new sap.ui.model.json.JSONModel();
            oLocalCallModel.setData(oCallData);
             this.oView.byId("idCAllList").setModel(oLocalCallModel);
			 }
			var that = this;
			if(navigator.onLine === false){
				this.byId("idConnStatus").setSrc("images/online_icon.png");
				this.byId("idFooterText").setText("Data Location: /V2/Northwind/Northwind.svc/");
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
				     localStorage.setItem("localData", JSON.stringify(oData));
				     var oModel = new JSONModel();
				     oModel.setData(oData);
				     that.getView().setModel(oModel);
				},
				function(oError) {
				//	console.log(oError);
				});
		    }else{
		      this.byId("idConnStatus").setSrc("images/offline_icon.png");
		      this.byId("idFooterText").setText("Data Location: Local System");
			  var oLocalModel = new sap.ui.model.json.JSONModel();
			  var oData = JSON.parse(localStorage.getItem("localData"));
			  oLocalModel.setData(oData);
			  this.getView().setModel(oLocalModel);	
		    }
    },
  onSuccess : function(res){},
  onError : function(result) {
  //console.log("Error:"+result);
  },
 
 
 
 handleTabBarSelect: function (oEvent) {
	var sKey = oEvent.getParameter("key");
	if(sKey==="callCounterKey"){
		this.oView.byId("idMainPage").setShowFooter(false);
	}else{
        this.oView.byId("idMainPage").setShowFooter(true);
	}
 },
 
 onPressCallNow : function(){
       //var number = this.byId("idMobNum").getValue();
       //var bypassAppChooser = false;
       //window.plugins.CallNumber.callNumber(this.onSuccess, this.onError, number, bypassAppChooser);
   if(localStorage.getItem("localCallData") !== null){
   var oCallData = JSON.parse(localStorage.getItem("localCallData"));
   var callObj = {};
   //callObj.Number = result.rows[0].number;
   //callObj.Duration = result.rows[0].duration;
   //callObj.DateTime = result.rows[0].date;
   callObj.Number = "+918800755400";
   callObj.Duration = "33";
   callObj.DateTime = "1516749672840";
   callObj.Date= new Date(parseInt(callObj.DateTime)).toLocaleDateString();
   callObj.Time= new Date(parseInt(callObj.DateTime)).toLocaleTimeString();
   if(callObj.Duration>"0"){
   	oCallData.push(callObj);
   	localStorage.setItem("localCallData", JSON.stringify(oCallData));
   var oLocalCallModel = new sap.ui.model.json.JSONModel();
   oLocalCallModel.setData(oCallData);
   this.byId("idCAllList").setModel(oLocalCallModel);
   }
   }
  },
	
		onPressCallDetail : function(){
           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           oRouter.navTo("target_Detail");
        },
        onPressLogout : function(){
            window.location.reload(true);
        }
	});
});