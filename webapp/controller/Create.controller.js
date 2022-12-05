sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/Token'
], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent,
    ColumnListItem, Label, Token) {
    "use strict";
    return BaseController.extend("v2.recrutamentov2.controller.Create", {
        formatter: formatter,

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("create").attachPatternMatched(this._onCreateMatched, this);

            // Inicio - Logica para Value Help Dialog - Search Help
            this._oInput = this.getView().byId("inpCod");
            this._oInput.setSelectedKey("000001");

            this.oColModel = new JSONModel(sap.ui.require.toUrl("v2/recrutamentov2/view")
                + "/columnsModel.json");

            this.getView().setModel(this.oVagasModel);

        },
        //   Fim - Logica para Value Help Dialog - Search Help


        // Volta da view Create para a view Worklist
        onNavBack: function () {

            var m = this.getView().getModel();
            m.resetChanges();

            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("worklist", {}, true);
            }
        },

        // Inicio - Logica para Value Help Dialog - Search Help

        onValueHelpRequested: function () {
            var aCols = this.oColModel.getData().cols;

            this._oValueHelpDialog = sap.ui.xmlfragment("v2.recrutamentov2.fragment.ValueHelpDialogSingleSelect", this);

            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                oTable.setModel(this.oVagasModel);
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", "/VagasSet");
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", "/VagasSet", function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }

                this._oValueHelpDialog.update();
            }.bind(this));

            var oToken = new Token();
            oToken.setKey(this._oInput.getSelectedKey());
            oToken.setText(this._oInput.getValue());
            this._oValueHelpDialog.setTokens([oToken]);
            this._oValueHelpDialog.open();
        },

        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oInput.setSelectedKey(aTokens[0].getKey());
            this._oValueHelpDialog.close();
        },

        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
        },

        onValueHelpAfterClose: function () {
            this._oValueHelpDialog.destroy();
        },
        // Fim - Logica para Value Help Dialog - Search Help

        _onCreateMatched: function (oEvent) {
            var m = this.getView().getModel();
            m.metadataLoaded().then(function () {
                var oContext = m.createEntry('/RecrutaSet',
                    // colocar valor default na tela
                    //       {
                    //       properties: {
                    //      Tel: '1234',
                    //       TempoExp: '10'
                    //              }
                    //        }

                );
                this.getView().bindElement({
                    path: oContext.getPath()
                    //model: "",
                });
            }.bind(this))
        },

        // Fim - Adriana

        // Inicio - Adriana 

        onGravar2: function (oEvent) {
            var m = this.getView().getModel();
            this.getView().setBusy(true);

            //         validar();

            m.submitChanges({
                success: function (oData) {
                    this.getView().setBusy(false);
                    MessageToast.show("Candidato criado com sucesso.");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    var sId = this.getView().getBindingContext().getObject().ID;
                    oRouter.navTo("object", {
                        objectId: sId
                    }, true);
                }.bind(this),
                error: function (oData) {
                    MessageToast.show("Erro na criação do candidato.");
                    console.error(oData);
                    this.getView().setBusy(false);
                }.bind(this),
            });
        },


        onCancelar: function (oEvent) {
            this.onNavBack();
        },


        onGravar: function (evt) {

            debugger;

            var oModel = this.getModel();
            var dados = {
                Ename: this.byId("inpNome").getValue(),
                Street: this.byId("inpEndereco").getValue(),
                Region: this.byId("inpUF").getValue(),
                DtNasc: this.byId("inpDt").getValue(),
                Tel: this.byId("inpTel").getValue(),
                TempoExp: this.byId("inpTempo").getValue(),
                CodVaga: this.byId("inpCod").getValue(),
                Profissao: this.byId("inpProf").getValue(),
                Profissao: this.byId("inpProf").getValue(),
                Data: this.byId("inpData").getValue(),
                Hora: this.byId("inpHora").getValue(),
                Obs: this.byId("inpObs").getValue()
            };



            if (dados.Ename == "") {
                MessageToast.show("Campo obrigatório");
                dados.Ename.focus();
                return;
            }

            if (dados.Street == "") {
                MessageToast.show("Campo obrigatório");
                dados.Street.focus();
                return;
            }

            if (dados.Region == "") {
                MessageToast.show("Campo obrigatório");
                dados.Region.focus();
                return;
            }

            if (dados.Tel == "") {
                MessageToast.show("Campo obrigatório");
                dados.Tel.focus();
                return;
            }

            if (dados.TempoExp == "") {
                MessageToast.show("Campo obrigatório");
                dados.TempoExp.focus();
                return;
            }

            if (dados.TempoExp < 1) {
                MessageToast.show("Tempo de experiência inválido");
                dados.TempoExp.focus();
                return;
            }

            if (dados.CodVaga == "") {
                MessageToast.show("Campo obrigatório");
                dados.CodVaga.focus();
                return;
            }

            if (dados.Profissao == "") {
                MessageToast.show("Campo obrigatório");
                dados.Profissao.focus();
                return;
            }

            debugger;

            //        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "YYYY-MM-ddTHH:mm", UTC: true}); 

            //        var oValue1 = oDateFormat.format(new Date(dados.DtNasc));

            //        dados.DtNasc = oValue1;
            // ****

            // formata data para o backend
            var ano = (dados.DtNasc.substring(6, 10));
            var mes = (dados.DtNasc.substring(3, 5));
            var dia = (dados.DtNasc.substring(0, 2));
            var oValue = ano + '-' + mes + '-' + dia + 'T' + '00:00:00';
            dados.DtNasc = oValue;

            // formata data para o backend
            var ano = (dados.Data.substring(6, 10));
            var mes = (dados.Data.substring(3, 5));
            var dia = (dados.Data.substring(0, 2));
            var oValue = ano + '-' + mes + '-' + dia + 'T' + '00:00:00';
            dados.Data = oValue;

            // formata hora para o backend
            var hh = (dados.Hora.substring(0, 2));
            var mm = (dados.Hora.substring(3, 5));
            var ss = (dados.Hora.substring(6, 8));
            var oValue = 'PT' + hh + 'H' + mm + 'M' + ss + 'S';
            dados.Hora = oValue;

            oModel.create("/RecrutaSet", dados, {
                success: function (oDados, resposta) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("worklist", {
                        objectId: oDados.ID
                    }, true);

                }.bind(this),
                error: function (oError) {
                    debugger

                }.bind(this),

            });
        }

        // Fim - Adriana       

    });
}); 