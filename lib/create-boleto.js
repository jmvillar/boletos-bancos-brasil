"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const banks_1 = require("./banks");
const ramda_1 = require("ramda");
const checkdigit = require('checkdigit');
exports.CreateBoleto = (options) => {
    const bank = banks_1.Banks[options.banco];
    const boleto = ramda_1.merge(options, {
        bank: bank,
        data_emissao: options.data_emissao || new Date(),
        data_vencimento: options.data_vencimento || new Date(new Date().getTime() + (5 * 24 * 3600 * 1000)),
        pagador: helper_1.htmlString(options.pagador),
        instrucoes: helper_1.htmlString(options.instrucoes),
        local_de_pagamento: options.local_de_pagamento || 'Até o vencimento, preferencialmente no Banco ' + helper_1.Capitalize(options.banco),
        codigo_banco: bank.codigo + '-' + checkdigit.mod11.create(bank.codigo),
        barcodeRenderEngine: 'img',
        nosso_numero_dv: checkdigit.mod11.create(options.nosso_numero.toString()),
        barcode_data: null,
        linha_digitavel: null,
    });
    const barcode_data = bank.barcodeData(boleto);
    return ramda_1.merge(boleto, {
        barcode_data: barcode_data,
        linha_digitavel: bank.linhaDigitavel(barcode_data),
        amount: helper_1.AmountLocale(Number(options.valor)),
        data_emissao_formatted: helper_1.FormatDate(boleto.data_emissao),
        data_vencimento_formatted: helper_1.FormatDate(boleto.data_vencimento)
    });
};
//# sourceMappingURL=create-boleto.js.map