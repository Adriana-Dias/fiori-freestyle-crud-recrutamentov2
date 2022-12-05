sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast",
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/Token'
], function (BaseController, JSONModel, History, formatter, MessageToast,
    ColumnListItem, Label, Token) {
    "use strict";

    return BaseController.extend("v2.recrutamentov2.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");

           // Inicio - Logica para Value Help Dialog - Search Help
           this._oInput = this.getView().byId("inpCod");
           this._oInput.setSelectedKey("000001");

           this.oColModel = new JSONModel(sap.ui.require.toUrl("v2/recrutamentov2/view")
               + "/columnsModel.json");

           this.getView().setModel(this.oVagasModel);

       },
       //   Fim - Logica para Value Help Dialog - Search Help

   //     },  teste

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


        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        // *****************
        // Inicio - Customizado 
        // *****************

        //        validar: function() {

        //           var error = 0.
        //          var inpNome = document.getElementById("inpNome");
        //          if (inpNome.value == "") {
        //             alert ("Nome não informado");
        //             error = 1.
        //             inpNome.focus();
        //        }
        //    },

        onGravar: function () {

            // this é o controller do contexto
            var oModel = this.getView().getModel();   // instancia a view

            // tras de forma dinamica do binding o contexto com dados armazenados
            var path = this.getView().getBindingContext().getPath();

            // no OBJ montar a propriedade e valor, são os campos da entidade

            var obj =
            {
                Ename: this.byId("inpNome").getValue(),
                Street: this.byId("inpEndereco").getValue(),
                Region: this.byId("inpUF").getValue(),
                DtNasc: this.byId("inpDt").getValue(),
                Tel: this.byId("inpTel").getValue(),
                TempoExp: this.byId("inpTempo").getValue(),
                CodVaga: this.byId("inpCod").getValue(),
                Profissao: this.byId("inpProf").getValue(),
                Obs: this.byId("inpObs").getValue()
            };

            if (obj.Ename == "") {
                MessageToast.show("Campo obrigatório");
                obj.Ename.focus();
                return;
            }

            if (obj.Street == "") {
                MessageToast.show("Campo obrigatório");
                obj.Street.focus();
                return;
            }

            if (obj.Region == "") {
                MessageToast.show("Campo obrigatório");
                obj.Region.focus();
                return;
            }

            if (obj.Tel == "") {
                MessageToast.show("Campo obrigatório");
                obj.Tel.focus();
                return;
            }

            if (obj.TempoExp == "") {
                MessageToast.show("Campo obrigatório");
                obj.TempoExp.focus();
                return;
            }

            if (dados.TempoExp < 1) {
                MessageToast.show("Tempo de experiência inválido");
                dados.TempoExp.focus();
                return;
            }
            
            if (obj.CodVaga == "") {
                MessageToast.show("Campo obrigatório");
                obj.CodVaga.focus();
                return;
            }

            if (obj.Profissao == "") {
                MessageToast.show("Campo obrigatório");
                obj.Profissao.focus();
                return;
            }

            // Atualização e os parametros, metodos, objeto de dados e faz callbacks
            // pode ser update, remove, create, read, callfunciton depende do programa 
            oModel.update(path, obj, {
                  sucess: function (dados, resposta) {
                    MessageToast.show("Candidato alterado com sucesso.");
                    //             debugger

                },
                error: function (Error) {
                    MessageToast.show("Erro na alterado do candidato.");
                    //            debugger

                }

            })
        },

        // Forma mais rapida sem precisar fazer campo a campo. Trabalha direto no model.
        // O model ja tem um metodo pronto que é o submitchanges
        onGravar2: function (oEvent) {

            var oModel = this.getView().getModel();

            if (oModel.hasPendingChanges()) {
 //               MessageToast.show("Com dados para gravar");
                var obj =
                {

                    Ename: this.byId("inpNome").getValue(),

                    Street: this.byId("inpEndereco").getValue(),
                    Region: this.byId("inpUF").getValue(),
                    DtNasc: this.byId("inpDt").getValue(),
                    Tel: this.byId("inpTel").getValue(),
                    TempoExp: this.byId("inpTempo").getValue(),
                    CodVaga: this.byId("inpCod").getValue(),
                    Profissao: this.byId("inpProf").getValue(),
                    Obs: this.byId("inpObs").getValue()
                };
                if (obj.Ename == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.Ename.focus();
                    return;
                }

                if (obj.Street == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.Street.focus();
                    return;
                }

                if (obj.Region == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.Region.focus();
                    return;
                }

                if (obj.Tel == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.Tel.focus();
                    return;
                }

                if (obj.TempoExp == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.TempoExp.focus();
                    return;
                }

                if (obj.CodVaga == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.CodVaga.focus();
                    return;
                }

                if (obj.Profissao == "") {
                    MessageToast.show("Campo obrigatório");
                    obj.Profissao.focus();
                    return;
                }


            } else {
                MessageToast.show("Sem dados para gravar");
                return;
            };


            oModel.submitChanges({
                success: function (dados, resposta) {
                    // this.getView().setBusy(false);
                    MessageToast.show("Candidato alterado com sucesso.");
                    //           var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    //           var sId = this.getView().getBindingContext().getObject().ID;
                    //           oRouter.navTo("object", {
                    //               objectId: sId
                    //           }, true);
                    //       }.bind(this),
                },
                error: function (erro) {
                    MessageToast.show("Erro na alterado do candidato.");
                    //            console.error(oData);
                    //           this.getView().setBusy(false);
                    //        }.bind(this),
                },
            })
        },


        // *****************
        // Fim - Customizado 
        // *****************

        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this._bindView("/RecrutaSet" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                parameters: {
                    expand: "historico"
                },
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.Ename,
                sObjectName = oObject.RecrutaSet;

            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        //
        onCancelar: function (oEvent) {

            var m = this.getView().getModel();
            // Se model não tem alteração
            if (!m.hasPendingChanges()) {
                MessageToast.show("Sem mudanças para cancelar.");
                return;
            }

            m.resetChanges();

        }

        //

    });

});
