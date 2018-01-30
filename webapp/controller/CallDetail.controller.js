sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("OptarosSAPUI5POC.controller.CallDetail", {
        onInit: function() {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("target_Detail").attachMatched(this._onRouteFound, this);
        },

        _onRouteFound: function(oEvt) {
            var oArgument = oEvt.getParameter("arguments");
            var callId = oArgument.callID;
            var oData = JSON.parse(localStorage.getItem("localCallData"));

            var sCurrViewBindData = oData.filter(
                function(item, index) {
                    if (item.ID === parseInt(callId))
                        return item;
                });
            var time = parseInt(sCurrViewBindData[0].Duration);
            var hrs = ~~(time / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = time % 60;
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            this.byId("idCallTo").setText(sCurrViewBindData[0].Number);
            this.byId("idCalTime").setText(sCurrViewBindData[0].Date + " , " + sCurrViewBindData[0].Time);
            this.byId("idDuration").setText(ret);
            this.byId("idSuccessfully").setText(sCurrViewBindData[0].Status);

        },
        handleNavButtonPress: function(evt) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("target_MainPage");
        }
    });

});