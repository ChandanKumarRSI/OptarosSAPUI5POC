sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
    "use strict";

    return Controller.extend("OptarosSAPUI5POC.controller.MainPage", {

        onInit: function() {
            $.sap.oMainView = this.getView();
            var that = this;
            if (navigator.onLine === false) {
                this.byId("idConnStatus").setSrc("images/online_icon.png");
                this.byId("idFooterText").setText("Data Location: /V2/Northwind/Northwind.svc/");
                var oDataModel = new sap.ui.model.odata.ODataModel($.sap.serviceURL);
                oDataModel.read("Products", null, {

                        "$format": "json"
                    },
                    false,
                    function(success, oResponse) {
                        $.sap.busyDialog.close();
                        var obj = JSON.parse(oResponse.body);
                        var oData = obj.d.results;
                        localStorage.setItem("localData", JSON.stringify(oData));
                        var oModel = new JSONModel();
                        oModel.setData(oData);
                        that.getView().setModel(oModel);
                    },
                    function(oError) {
                        $.sap.busyDialog.close();
                        sap.m.MessageToast.show("Failed to load oData Service", {width: "20em"});
                    });
            } else {
                $.sap.busyDialog.close();
                this.byId("idConnStatus").setSrc("images/offline_icon.png");
                this.byId("idFooterText").setText("Data Location: Local System");
                if (localStorage.getItem("localData") !== null) {
                    var oLocalModel = new sap.ui.model.json.JSONModel();
                    var oData = JSON.parse(localStorage.getItem("localData"));
                    oLocalModel.setData(oData);
                    this.getView().setModel(oLocalModel);
                }
            }

        },

        handleTabBarSelect: function(oEvent) {
            var sKey = oEvent.getParameter("key");
            this.getView().byId("idIconTabBarNoIcons").setExpanded(true);
            if (sKey === "callCounterKey") {
                this.oView.byId("idMainPage").setShowFooter(false);
                if (localStorage.getItem("localCallData") !== null) {
                    var oCallData = JSON.parse(localStorage.getItem("localCallData"));
                    var oLocalCallModel = new sap.ui.model.json.JSONModel();
                    oLocalCallModel.setData(oCallData);
                    this.oView.byId("idCAllList").setModel(oLocalCallModel);
                    this.oView.byId("idAnsCallCounter").setValue(oCallData.length);
                }
            } else {
                this.oView.byId("idMainPage").setShowFooter(true);
            }
        },

        _setLocaCalldataPhone: function() {
            window.plugins.calllog.list('1', function(result) {
                if (localStorage.getItem("localCallData") !== null) {
                    var oCallData = JSON.parse(localStorage.getItem("localCallData"));
                    var callObj = {};
                    if (result.rows[0].duration > 0) {
                        callObj.Status = "Yes";
                        callObj.ID = oCallData.length + 1;
                        callObj.Number = result.rows[0].number;
                        callObj.Duration = result.rows[0].duration;
                        callObj.DateTime = result.rows[0].date;
                        callObj.Date = new Date(parseInt(callObj.DateTime)).toLocaleDateString();
                        callObj.Time = new Date(parseInt(callObj.DateTime)).toLocaleTimeString();
                        oCallData.push(callObj);
                        localStorage.setItem("localCallData", JSON.stringify(oCallData));
                        var oLocalCallModel = new sap.ui.model.json.JSONModel();
                        oLocalCallModel.setData(oCallData);
                        $.sap.oMainView.byId("idCAllList").setModel(oLocalCallModel);
                        $.sap.oMainView.byId("idAnsCallCounter").setValue(oCallData.length);
                    } else {
                        sap.m.MessageToast.show("Call not included", {
                            duration: 5000
                        });
                    }
                } else {
                    sap.m.MessageToast.show("No local storage available", {width: "25em"});
                }

            }, function(error) {
                sap.m.MessageToast.show("Server Error");
            });

        },

        _setLocaCalldataBrowser: function(number) {
            if (localStorage.getItem("localCallData") !== null) {
                var oCallData = JSON.parse(localStorage.getItem("localCallData"));
                var callObj = {};
                callObj.Status = "No";
                callObj.ID = oCallData.length + 1;
                callObj.Number = number;
                callObj.Duration = "0";
                callObj.DateTime = new Date().getTime();
                callObj.Date = new Date(parseInt(callObj.DateTime)).toLocaleDateString();
                callObj.Time = new Date(parseInt(callObj.DateTime)).toLocaleTimeString();
                oCallData.push(callObj);
                localStorage.setItem("localCallData", JSON.stringify(oCallData));
                var oLocalCallModel = new sap.ui.model.json.JSONModel();
                oLocalCallModel.setData(oCallData);
                this.byId("idCAllList").setModel(oLocalCallModel);
                this.oView.byId("idAnsCallCounter").setValue(oCallData.length);
            } else {
                sap.m.MessageToast.show("No local storage available", {width: "25em"});
            }

        },

        onSuccess: function(res) {
            $.sap.oMainView.oController._setLocaCalldataPhone();
        },

        onError: function(result) {
            sap.m.MessageToast.show("Unable to make call");
        },

        setLocaCalldataIOSPhone: function(number) {

            if (localStorage.getItem("localCallData") !== null) {
                var oCallData = JSON.parse(localStorage.getItem("localCallData"));
                var callObj = {};
                callObj.Status = "No";
                callObj.ID = oCallData.length + 1;
                callObj.Number = number;
                callObj.Duration = "0";
                callObj.DateTime = new Date().getTime();
                callObj.Date = new Date(parseInt(callObj.DateTime)).toLocaleDateString();
                callObj.Time = new Date(parseInt(callObj.DateTime)).toLocaleTimeString();
                oCallData.push(callObj);
                localStorage.setItem("localCallData", JSON.stringify(oCallData));
                var oLocalCallModel = new sap.ui.model.json.JSONModel();
                oLocalCallModel.setData(oCallData);
                this.byId("idCAllList").setModel(oLocalCallModel);
                this.oView.byId("idAnsCallCounter").setValue(oCallData.length);

            }
            else {
                sap.m.MessageToast.show("No local storage available", {width: "25em"});
            }

        },

        onIOSSuccess: function(res) {
            $.sap.oMainView.oController.setLocaCalldataIOSPhone();
        },

        onIOSError: function(result) {
            sap.m.MessageToast.show("Unable to make call");
        },

        onPressCallNow: function() {
            var number = this.byId("idMobNum")._oTempValue._aContent.join("").replace(/_/g, '');
            var that = this;
            if(number !== "") {
                if (sap.ui.Device.os.ios) {
                    var bypassAppChooser = true;
                    window.plugins.CallNumber.callNumber(this.onIOSSuccess(number), this.onIOSError, number, bypassAppChooser);
                    this.byId("idMobNum").setValue("");
                } else if (sap.ui.Device.os.android) {
                    var bypassAppChooser = true;
                    window.plugins.CallNumber.callNumber(this.onSuccess, this.onError, number, bypassAppChooser);
                    this.byId("idMobNum").setValue("");
                } else {
                    this._setLocaCalldataBrowser(number);
                    this.byId("idMobNum").setValue("");
                }
            }
            else{
                sap.m.MessageToast.show("Enter a number to call", {width: "20em"});
            }
        },

        onPressCallDetail: function(evt) {
            if (sap.ui.Device.os.ios) {
                sap.m.MessageToast.show("Call details not available in iOS", {width: "25em"});
            } else if (sap.ui.Device.os.android) {
                var callID = evt.getSource().getBindingContext().getProperty("ID");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("target_Detail", {
                    callID: callID
                });
            } else {
                var callID = evt.getSource().getBindingContext().getProperty("ID");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("target_Detail", {
                    callID: callID
                });
            }
        },

        onPressLogout: function() {
            window.location.reload(true);
        }

    });
});