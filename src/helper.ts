import * as _ from 'lodash';
import * as __ from 'ramda';
import { Buffer } from 'buffer'
declare var require
const checkdigit = require('checkdigit');
const moment = require('moment');
const crypto = require('crypto')
moment.locale('br');
export const Mod11 = (num: string, base: number = 9, r: number = 0) => {
    let fator = 2
    const getFatorAndUpdate = (f) => {
        fator = (fator == base) ? 2 : ++fator
        return f
    }
    const soma: number = __.reduce((acum: number, char: string) => acum + parseInt(char) * getFatorAndUpdate(fator), 0)(_.reverse(_.split(num, '')))
    return (r == 0) ? (soma * 10) % 11 == 10 ? 0 : (soma * 10) % 11 : soma % 11
}
export const dvBarra = (barra) => {
    const resto2 = Mod11(barra, 9, 1)
    return (resto2 == 0 || resto2 == 1) ? 1 : 11 - resto2
}
export const dateFromEdiDate20 = (ediDate) => new Date(parseInt('20' + ediDate.substring(4, 8)), parseInt(ediDate.substring(2, 4)) - 1, parseInt(ediDate.substring(0, 2)))
export const dateFromEdiDate = (ediDate) => new Date(parseInt(ediDate.substring(4, 8)), parseInt(ediDate.substring(2, 4)) - 1, parseInt(ediDate.substring(0, 2)))
export const calculateLineChecksum = (line) => crypto.createHash('sha1').update(line).digest('hex')
export const hashString = (string: string) => _.reduce(string.split(''), (hash, char) => {
    hash = ((hash << 5) - hash) + char.charCode
    return hash |= 0
}, 0)
export const Capitalize = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`
export const AddTrailingZeros = (str, len: number): string => _.padStart(str, len, '0')
export const RemoveTrailingZeros = (str: string): string => Number(str).toString()
export const AmountLocale = (amount: number): string => amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
export const FormatDate = (date: Date) => moment(date).format('L')
export const fatorVencimento = (date) => AddTrailingZeros(Math.floor((date.getTime() - new Date(1997, 9, 7).getTime()) / (24 * 3600 * 1000)), 4)
export const htmlString = (str) => str ? str.replace(/\n/g, '<br/>') : str

//Note: barcode
export const BarCodeEven = (bc) => bc.length % 2 != 0 ? '0' + bc : bc
export const BinaryRepresentationForBarcodeData = (barcodeData: string) => {
    const _digits = ['00110', '10001', '01001', '11000', '00101', '10100', '01100', '00011', '10010', '01010']
    const chuncked = _.chunk(_.split(BarCodeEven(barcodeData), ''), 2)
    return '0000' + _.reduce(chuncked, (bD, pair) => {
        const digit1 = _.split(_digits[parseInt(_.first(pair))], '')
        const digit2 = _.split(_digits[parseInt(_.last(pair))], '')
        return bD += _.reduce(_.range(digit1.length), (acum: string, j: number) => acum += digit1[j] + digit2[j], '')
    }, '') + '1000'
}
// Convert a value to a little endian hexadecimal value
export const _getLittleEndianHex = (value) => {
    let result = []
    for (let bytes = 4; bytes > 0; bytes--) {
        result.push(String.fromCharCode(value & 0xff))
        value >>= 0x8
    }
    return result.join('')
}
export const _bmpHeader = (width, height) => `BM${_getLittleEndianHex(width * height)}\x00\x00\x00\x00\x36\x00\x00\x00\x28\x00\x00\x00${_getLittleEndianHex(width) + _getLittleEndianHex(height)}\x01\x00\x20\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x0B\x00\x00\x13\x0B\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00`
export const bmpLineForBarcodeData = (barcodeData) => {
    const binaryRepresentation = BinaryRepresentationForBarcodeData(barcodeData)
    let bmpData = []
    let black = true
    let offset = 0
    for (var i = 0; i < binaryRepresentation.length; i++) {
        _.each(_.range((binaryRepresentation[i] == '0') ? 1 : 3), j => bmpData[offset++] = black ? String.fromCharCode(0, 0, 0, 0) : String.fromCharCode(255, 255, 255, 0))
        black = !black
    }
    const bmpHeader = _bmpHeader(offset - 1, 1)
    const bmpBuffer = new Buffer(bmpHeader + bmpData.join(''), 'binary')
    return bmpBuffer.toString('base64')
}
