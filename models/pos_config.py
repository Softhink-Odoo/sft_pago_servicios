
from odoo import models, fields, api, _
from odoo.tools import float_is_zero


class PosConfig(models.Model):
    _inherit = 'pos.config'

    url = fields.Char(string='URL de Servicio')
    usuario = fields.Char(string='Usuario')
    password = fields.Char(string='Password')
    id_distribuidor = fields.Char(string='Id distribuidor')
