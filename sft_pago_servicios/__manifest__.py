# coding: utf-8

{
    'name': 'SFT-Recargas electronicas',
    'version': '12.0.1.0.0',
    'author': 'Softhink',
    'maintainer': 'Softhink',
    'website': 'http://www.sft.com.mx',
    'license': 'AGPL-3',
    'category': 'Point of sale',
    'summary': 'Modulo para recargas electronicas/tiempo aire de compañias telefonicas, telcel, iusacel, at&t, movistar',
    'depends': ['point_of_sale'],
    'qweb': [
        'static/src/xml/pos.xml',
    ],
    'data': [
        'views/productos_view.xml',
        "views/view_pos_config.xml"
    ],
    'installable': True,
    'application': True,
    'demo': [],
    'test': [],
	"images":['static/description/Recargas_imagen.jpg'],
}
