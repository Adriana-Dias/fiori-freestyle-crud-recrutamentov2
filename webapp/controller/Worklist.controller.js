sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MenuItem"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,
    MessageToast, MenuItem) {
    "use strict";

    return BaseController.extend("v2.recrutamentov2.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        //Inicio -  Menu button
        onDefaultAction: function() {
            MessageToast.show("Default action triggered");
        },

        onMenuAction: function(oEvent) {
            var oItem = oEvent.getParameter("item"),
                sItemPath = "";

            while (oItem instanceof MenuItem) {
                sItemPath = oItem.getText() + " > " + sItemPath;
                oItem = oItem.getParent();
            }

            sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

            MessageToast.show("Próximo Status: " + sItemPath);

// **********************
            debugger;

            var oSource = oEvent.getSource();                  //retorna o botão que esta sendo clicado
            var bc = oSource.getParent().getBindingContext();  //tras a linha da tabela e binding, ponteiro especifico do model
            var obj = bc.getObject();                          // busca os dados da entidade
            var oModel = this.getView().getModel();

            // MessageToast.show("Alterando Status");
            // metodo especifico para fazer a alteração dos dados
            oModel.callFunction(
                "/AlteraStatusDescr", {
                method: "GET",
                 urlParameters: {
                    Descr: sItemPath,
                    ID: obj.ID
                                },
                success: function (oData, response) {
                    },
                error: function (oError) {
                    }
                });

// **********************
        },

        //Fim -  Menu button

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */

        onPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());

        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack: function () {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("Ename", FilterOperator.Contains, sQuery)];
             
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
      _showObject: function (oItem) {
            this.getRouter().navTo("object", {
               objectId: oItem.getBindingContext().getPath().substring("/RecrutaSet".length)
           });
        },

    
        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        },    

        /* =========================================================== */
        /* metodos customizados - INICIO - Adriana                     */
        /* =========================================================== */

        onCriarRecruta: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("create", {});
        },

        onAlterarStatus: function (oEvent) {
            var oSource = oEvent.getSource();                  //retorna o botão que esta sendo clicado
            var bc = oSource.getParent().getBindingContext();  //tras a linha da tabela e binding, ponteiro especifico do model
            var obj = bc.getObject();                          // busca os dados da entidade
            var oModel = this.getView().getModel();

            MessageToast.show("Alterando Status");
            // metodo especifico para fazer a alteração dos dados
            oModel.callFunction(
                "/AlteraStatus", {
                method: "GET",
                urlParameters: {
                    ID: obj.ID
                },
                success: function (oData, response) {
                },
                error: function (oError) {
                }
            });


        },

    
        onRecrutaDelete: function (oEvent) {
            var oItem = oEvent.getParameter("listItem"),
                sPath = oItem.getBindingContext().getPath();
            this.getView().getModel().remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show('Candidato eliminado com sucesso.');
                }.bind(this),
                error: function (e) {
                    console.error(e);
                }.bind(this),
            });
        }

        /* =========================================================== */
        /* metodos customizados - FIM                                  */
        /* =========================================================== */

    });
});
