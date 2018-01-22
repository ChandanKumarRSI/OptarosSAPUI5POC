sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {

	return Controller.extend("OptarosSAPUI5POC.controller.MainPage", {
		
		onInit : function(){
			busyDialog.close(); 
		},
		
        onPressLogout : function(){
            window.location.reload(true);
        }
	});
});