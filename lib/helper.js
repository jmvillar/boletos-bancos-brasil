"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const checkdigit = require('checkdigit');
const moment = require('moment');
const crypto = require('crypto');
moment.locale('br');
exports.dvBarra = (barra) => {
    const resto2 = checkdigit.mod11.create(barra);
    return (resto2 == 0 || resto2 == 1 || resto2 == 10) ? 1 : 11 - resto2;
};
exports.dateFromEdiDate20 = (ediDate) => new Date(parseInt('20' + ediDate.substring(4, 8)), parseInt(ediDate.substring(2, 4)) - 1, parseInt(ediDate.substring(0, 2)));
exports.dateFromEdiDate = (ediDate) => new Date(parseInt(ediDate.substring(4, 8)), parseInt(ediDate.substring(2, 4)) - 1, parseInt(ediDate.substring(0, 2)));
exports.calculateLineChecksum = (line) => crypto.createHash('sha1').update(line).digest('hex');
exports.hashString = (string) => _.reduce(string.split(''), (hash, char) => {
    hash = ((hash << 5) - hash) + char.charCode;
    return hash |= 0;
}, 0);
exports.Capitalize = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
exports.AddTrailingZeros = (str, len) => _.padStart(str, len, '0');
exports.RemoveTrailingZeros = (str) => Number(str).toString();
exports.AmountLocale = (amount) => amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
exports.FormatDate = (date) => moment(date).format('L');
exports.fatorVencimento = (date) => exports.AddTrailingZeros(Math.floor((date.getTime() - new Date(1997, 9, 7).getTime()) / (24 * 3600 * 1000)), 4);
exports.htmlString = (str) => str ? str.replace(/\n/g, '<br/>') : str;
exports.BarCodeEven = (bc) => bc.length % 2 != 0 ? '0' + bc : bc;
exports.binaryRepresentationForBarcodeData = (barcodeData) => {
    const _digits = ['00110', '10001', '01001', '11000', '00101', '10100', '01100', '00011', '10010', '01010'];
    const chuncked = _.chunck(_.split(exports.BarCodeEven(barcodeData), ''), 2);
    return '0000' + _.reduce(chuncked, (bD, pair) => {
        const digit1 = _.split(_digits[parseInt(_.first(pair))], '');
        const digit2 = _.split(_digits[parseInt(_.last(pair))], '');
        return bD += _.reduce(_.range(digit1.length), (acum, j) => acum += digit1[j] + digit2[j], '');
    }, '') + '1000';
};
exports._getLittleEndianHex = (value) => {
    let result = [];
    for (let bytes = 4; bytes > 0; bytes--) {
        result.push(String.fromCharCode(value & 0xff));
        value >>= 0x8;
    }
    return result.join('');
};
exports._bmpHeader = (width, height) => `BM${exports._getLittleEndianHex(width * height)}\x00\x00\x00\x00\x36\x00\x00\x00\x28\x00\x00\x00${exports._getLittleEndianHex(width) + exports._getLittleEndianHex(height)}\x01\x00\x20\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x0B\x00\x00\x13\x0B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00`;
//# sourceMappingURL=helper.js.map