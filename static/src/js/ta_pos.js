odoo.define('pos_ta.pos_ta',   function (require) {
"use strict";
var module = require('point_of_sale.models');
var chrome = require('point_of_sale.chrome');
var core = require('web.core');
var PosPopWidget = require('point_of_sale.popups');

var PosBaseWidget = require('point_of_sale.BaseWidget');
var gui = require('point_of_sale.gui');
var screens = require('point_of_sale.screens');
var ajax = require('web.ajax');
    var TiempoAireButton = screens.ActionButtonWidget.extend({
        template: 'TiempoAireButton',
        button_click: function(){
        	this.gui.show_popup('sft-compania-popup');
        },
    });
    screens.define_action_button({
        'name': 'TiempoAireButton',
        'widget': TiempoAireButton,
    });
    var TiempoAirePopup = PosPopWidget.extend({
        template: 'TiempoAirePopup',
        renderElement: function(){
            var self = this;
            this._super();
            var producto = self.gui.producto;

            this.$('#registrar_ta').click(function(){

            	var no_telefono = $(".no_telefono").val();
            	var no_confirma = $(".no_confirma").val();
                 self.gui.pos;
                  $('.o_loading').show();
                  self.$('.cancel').removeClass("desactivado");
                         self.$('#registrar_ta').removeClass("desactivado");
                $(".no_mensaje").val("Estamos realizando su operación, Por favor Espere.");
                $(".no_mensaje").removeClass("tiene-error");
            	if(no_telefono.length != 10){
                    $(".no_mensaje").addClass("tiene-error");
            	    $(".no_mensaje").val("Favor de introducir el No. de teléfono con clave lada(10 dígitos).");
            	}else if(no_telefono == no_confirma){
            	var parametros ={
                        method: 'POST',
                        async: true,
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        'CodigoDispositivo': self.gui.pos.config.usuario,
                        'PasswordDispositivo': window.btoa(self.gui.pos.config.password),
                        'IdDistribuidor':self.gui.pos.config.id_distribuidor,
                        'Telefono':no_telefono,
                        'IdServicio':producto.IdServicio,
                        'IdProducto':producto.IdProducto
                    };

                    self.$('.cancel').addClass("desactivado");
                    self.$('#registrar_ta').addClass("desactivado");
                    $.ajax({
                          method: "POST",
                          url:  self.gui.pos.config.url+"Abonar",
                          data: JSON.stringify(parametros),
                          type: "POST",
                          headers: {
                                "Content-Type":"application/json"
                          }
                }).done(function( data ) {
                         $('.o_loading').hide();
                         self.$('.cancel').removeClass("desactivado");
                         self.$('#registrar_ta').removeClass("desactivado");
                         if("82"==data.CODIGO){
                                $(".no_mensaje").val("Confirmando Transacción. Por Favor Espere.");
                                self.$('.cancel').addClass("desactivado");
                         self.$('#registrar_ta').addClass("desactivado");
                                $.ajax({
                                          method: "POST",
                                          url:  self.gui.pos.config.url+"ConfirmaTransaccion",
                                          data: JSON.stringify(parametros),
                                          type: "POST",
                                          headers: {
                                                "Content-Type":"application/json"
                                          }
                                }).done(function( data ) {
                                    self.$('.cancel').removeClass("desactivado");
                                    self.$('#registrar_ta').removeClass("desactivado");
                                         $('.o_loading').hide();
                                          if("-1"!==data.NUM_AUTORIZACION&&"0"!==data.NUM_AUTORIZACION){
                                             var order = self.pos.get_order();
                                            var product = self.pos.db.get_product_by_barcode('TIEMPO_AIRE');
                                            product.display_name= self.gui.producto.Producto+" Tel. "+no_telefono+" No. Autorización : "+data.NUM_AUTORIZACION;
                                            order.add_product(product,{ quantity:self.gui.producto.Precio});
                                            self.gui.close_popup('sft-producto-popup');
                                            $(".no_mensaje").val(data.TEXTO);
                                         } else{
                                            $(".no_mensaje").addClass("tiene-error");
                                            $(".no_mensaje").val(data.TEXTO);
                                         }


                                }).error(function( data ) {
                                    self.$('.cancel').removeClass("desactivado");
                                    self.$('#registrar_ta').removeClass("desactivado");
                                    $('.o_loading').hide();
                                    $(".no_mensaje").addClass("tiene-error");
                                    $(".no_mensaje").val(data.responseText);
                                 });
                         }else if("-1"!==data.NUM_AUTORIZACION&&"0"!==data.NUM_AUTORIZACION){
                            var order = self.pos.get_order();
                            var product = self.pos.db.get_product_by_barcode('TIEMPO_AIRE');
                            product.display_name= self.gui.producto.Producto+" Tel. "+no_telefono+" No. Autorización : "+data.NUM_AUTORIZACION;
                            order.add_product(product,{ quantity:self.gui.producto.Precio});
                            self.gui.close_popup('sft-producto-popup');
                            $(".no_mensaje").val(data.TEXTO);
                            self.$('.cancel').removeClass("desactivado");
                            self.$('#registrar_ta').removeClass("desactivado");
                         } else{
                            self.$('.cancel').removeClass("desactivado");
                         self.$('#registrar_ta').removeClass("desactivado");
                            $(".no_mensaje").addClass("tiene-error");
                            $(".no_mensaje").val(data.TEXTO);
                         }


                }).error(function( data ) {

                    $('.o_loading').hide();
                    $(".no_mensaje").addClass("tiene-error");
                    $(".no_mensaje").val(data.responseText);
                    self.$('.cancel').removeClass("desactivado");
                         self.$('#registrar_ta').removeClass("desactivado");
                 });
                }else{
                    self.$('.cancel').removeClass("desactivado");
                         self.$('#registrar_ta').removeClass("desactivado");
                    $(".no_mensaje").addClass("tiene-error");
	            	$(".no_mensaje").val("El No. de Télefono y la confirmación deben ser iguales, Verifique por favor.");
	            }
		    });
		    if(producto!=undefined){
		        $("#titulo_producto").text(producto.Producto);
		    }

        },
        show: function(options){
            this.options = options || {};
            var self = this;
            this._super(options);
            this.renderElement();
        },
    });
    gui.define_popup({
        'name': 'sft-pos-popup',
        'widget': TiempoAirePopup,
    });
    var CompaniaPopup = PosPopWidget.extend({
        template: 'CompaniaPopup' ,
        renderElement: function(){
            var self = this;
            this._super();
            var propiedades = {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    'compania':self.gui.compania,
                    'CodigoDispositivo': self.gui.pos.config.usuario,
                    'PasswordDispositivo': window.btoa(self.gui.pos.config.password),
                    'IdDistribuidor':self.gui.pos.config.id_distribuidor,
                };
                $.ajax({
                          method: "POST",
                          url: self.gui.pos.config.url+"ConsultarSaldo",
                          data: JSON.stringify(propiedades),
                          type: "POST",
                          headers: {
                                "Content-Type":"application/json"
                          }
                }).done(function( data ) {
                        var saldo = data.SALDO_F;
                        var contenedor = $("#saldospan");
                        $(contenedor).text(saldo);

                });
             this.$('#registar_abono').click(function(){
                self.gui.show_popup('sft-abonar-popup');
                $("#abono_abonar").removeClass("invisible");
                });
            this.$('.compania').click(function(){
                self.gui.compania=$(this).attr("compania");
                if(self.gui.compania =="2"){
                    $("#titulo_producto").text("Telcel");
                }else if(self.gui.compania =="2"){
                }
                self.gui.show_popup('sft-producto-popup');
		    });
        },
        show: function(options){
            this.options = options || {};
            var self = this;
            this._super(options);
            this.renderElement();
        },
    });

    gui.define_popup({
        'name': 'sft-compania-popup',
        'widget': CompaniaPopup,
    });
    var ProductoPopup = PosPopWidget.extend({
        template: 'ProductoPopup' ,
        renderElement: function(){
            var self = this;
            this._super();
            if(self.gui.compania==undefined){
             return;
            }
            var propiedades = {
                    method: 'POST',
                    async: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    'compania':self.gui.compania,
                    'CodigoDispositivo': self.gui.pos.config.usuario,
                    'PasswordDispositivo': window.btoa(self.gui.pos.config.password),
                    'IdDistribuidor':self.gui.pos.config.id_distribuidor,
                };
                $.ajax({
                          method: "POST",
                          url: self.gui.pos.config.url+"ConsultarServicioTelefonia",
                          data: JSON.stringify(propiedades),
                          type: "POST",
                          headers: {
                                "Content-Type":"application/json"
                          }
                }).done(function( data ) {
                        var productos = data.productos;
                        var contenedor = $("#contenedor_producto");
                        var producto_base = $("#producto_base");
                        $.each(productos, function( k, v ) {
                               var producto =$(producto_base).clone();
                               $(producto).attr("id",v.IdProducto);
                               $(producto).attr("precio",v.Precio);
                               $(producto).removeClass("invisible");
                               $(producto).click(function (){
                                    self.gui.producto = v;
                                    self.gui.show_popup('sft-pos-popup');
                               });
                               if(v.Producto.includes("$")){
                                    $(producto).text(v.Producto);
                               }else{
                                    $(producto).text(v.Producto+ " $"+v.Precio);
                               }

                               $(contenedor).append(producto);
                        });
                });
                self.$('.producto').click(function(){
                    alert($(this).attr("id"));
                });
        },
        show: function(options){
            this.options = options || {};
            var self = this;
            this._super(options);
            this.renderElement();

        },
    });

     var TiempoAireAbonar = PosPopWidget.extend(    {
        template: 'AbonoPopup' ,
        renderElement: function(){
            var self = this;
            this._super();

             this.$('#abono_abonar').click(function(){
                $('.o_loading').show();
            	var banco = $("#abono_banco").val();
            	var monto= $("#abono_monto").val();
            	var referencia= $("#abono_referencia").val();
            	var fecha= $("#abono_fecha").val();
            	var hora= $("#abono_hora").val();
                $("#abono_mensaje").val("");
                $("#abono_mensaje").removeClass("tiene-error");
            	if(monto ==undefined|| referencia==undefined||fecha==undefined||monto.length ==0||referencia.length==0||fecha.length!=10 ||hora==undefined||hora.length!=5){
                    $("#abono_mensaje").addClass("tiene-error");
            	    $("#abono_mensaje").val("Favor de llenar todos los campos.");
            	}else {
            	var parametros ={
                        method: 'POST',
                        async: true,
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        },
                        'CodigoDispositivo': self.gui.pos.config.usuario,
                        'PasswordDispositivo': window.btoa(self.gui.pos.config.password),
                        'IdDistribuidor':self.gui.pos.config.id_distribuidor,
                        'Referencia':referencia,
                        'Banco':banco,
                        'Monto':monto,
                        'Fecha':fecha+" "+hora
                    };
                    $.ajax({
                          method: "POST",
                          url:  self.gui.pos.config.url+"NotificarAbono",
                          data: JSON.stringify(parametros),
                          type: "POST",
                          headers: {
                                "Content-Type":"application/json"
                          }
                }).done(function( data ) {
                         $('.o_loading').hide();
                         if(data!=undefined&& data.CODIGO == "01"){
                            var order = self.pos.get_order();
                            $("#abono_mensaje").val(data.TEXTO);
                            $("#abono_abonar").addClass("invisible");
                            $("#abono_cancel").text("Cerrar");
                         } else{
                            $("#abono_mensaje").addClass("tiene-error");
                            $("#abono_mensaje").val(data==undefined?"Ha ocurrido un Error": data.TEXTO);
                         }

                 }).error(function( data ) {
                    $('.o_loading').hide();
                    $("#abono_mensaje").addClass("tiene-error");
                    $("#abono_mensaje").val(data.responseText);
                 });
                }
            });

        },
        show: function(options){
            this.options = options || {};
            var self = this;
            this._super(options);
            this.renderElement();

        },
    });
     gui.define_popup({
        'name': 'sft-abonar-popup',
        'widget': TiempoAireAbonar,
    });
     gui.define_popup({
        'name': 'sft-producto-popup',
        'widget': ProductoPopup,
    });


});

