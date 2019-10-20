odoo.define('sft_pago_servicios.models', function (require) {
"use strict";

var module = require('point_of_sale.models');
var chrome = require('point_of_sale.chrome');
var core = require('web.core');
var gui = require('point_of_sale.gui');
var rpc = require('web.rpc');
var screens = require('point_of_sale.screens');
var _t = core._t;

    console.log("--------------------------------------------------->sft_pago_servicios.models");
    module.load_fields("product.product", ['tiempo_aire', 'gp_servicio', 'gp_idservicio', 'gp_idproducto']);

});
