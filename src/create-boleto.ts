import { htmlString, Capitalize, AmountLocale, FormatDate } from './helper'
import { IBoleto, IOptions, IBank } from './interfaces'
import { Banks } from './banks'
import { merge } from 'ramda';
declare var require
const checkdigit = require('checkdigit');
export const CreateBoleto = (options: IOptions): IBoleto => {
    const bank: IBank = Banks[options.banco]
    const boleto: IBoleto = merge(options, {
        bank: bank,
        data_emissao: options.data_emissao || new Date(),
        data_vencimento: options.data_vencimento || new Date(new Date().getTime() + (5 * 24 * 3600 * 1000)),
        pagador: htmlString(options.pagador),
        instrucoes: htmlString(options.instrucoes),
        local_de_pagamento: options.local_de_pagamento || 'Até o vencimento, preferencialmente no Banco ' + Capitalize(options.banco),
        codigo_banco: bank.codigo + '-' + checkdigit.mod11.create(bank.codigo),
        barcodeRenderEngine: 'img',
        nosso_numero_dv: checkdigit.mod11.create(options.nosso_numero.toString()),
        barcode_data: null,
        linha_digitavel: null,
    })
    const barcode_data = bank.barcodeData(boleto)
    return merge(boleto, {
        barcode_data: barcode_data,
        linha_digitavel: bank.linhaDigitavel(barcode_data),
        amount: AmountLocale(Number(options.valor)),
        data_emissao_formatted: FormatDate(boleto.data_emissao),
        data_vencimento_formatted: FormatDate(boleto.data_vencimento)
    })
}


// Boleto.prototype.renderHTML = function(callback) {
// 	var self = this
//
// 	var renderOptions = self.bank.options
// 	renderOptions.boleto = self
//
// 	// Copy renderHelper's methods to renderOptions
// 	for (var key in formatters) {
// 		renderOptions[key] = formatters[key]
// 	}
//
// 	renderOptions['barcode_render_engine'] = Boleto.barcodeRenderEngine
// 	renderOptions['barcode_height'] = '50'
//
// 	if (Boleto.barcodeRenderEngine == 'bmp') {
// 		renderOptions['barcode_data'] = barcode.bmpLineForBarcodeData(self['barcode_data'])
// 	} else if (Boleto.barcodeRenderEngine == 'img') {
// 		renderOptions['barcode_data'] = barcode.binaryRepresentationForBarcodeData(self['barcode_data'])
// 	}
//
// 	renderOptions['boleto']['linha_digitavel_hash'] = hashString(renderOptions['boleto']['linha_digitavel']).toString()
//
// 	ejs.renderFile(path.join(__dirname, '/../assets/layout.ejs'), renderOptions, {
// 		cache: true
// 	}, function(err, html) {
// 		if (err) {
// 			throw new Error(err)
// 		}
//
