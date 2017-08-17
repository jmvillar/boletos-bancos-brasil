import { dvBarra, calculateLineChecksum, RemoveTrailingZeros, AddTrailingZeros, fatorVencimento, htmlString, Capitalize, dateFromEdiDate20, dateFromEdiDate } from './helper'
import { IBoleto, IOptions } from './interfaces'
declare var require
const checkdigit = require('checkdigit');
const BarcodeData = (banco: string) => {
    return (boleto: IBoleto) => {
        const codigoBanco = boleto.bank.codigo
        const numMoeda = '9'
        const _fatorVencimento = fatorVencimento(boleto.data_vencimento)
        const valor = AddTrailingZeros(boleto.valor, 10)
        const carteira = boleto.carteira
        const codigoCedente = AddTrailingZeros(boleto.codigo_cedente, 7)
        const agencia = AddTrailingZeros(boleto.agencia, 4)
        let barra = ''
        if (banco == 'bradesco') {
            const nossoNumero = carteira + AddTrailingZeros(boleto.nosso_numero, 11)
            barra = codigoBanco + numMoeda + _fatorVencimento + valor + agencia + nossoNumero + codigoCedente + '0'
        } else if (banco == 'santander') {
            const fixo = '9'
            const ios = '0'
            const nossoNumero = AddTrailingZeros(boleto.nosso_numero, 12) + checkdigit.mod11.create(boleto.nosso_numero)
            barra = codigoBanco + numMoeda + _fatorVencimento + valor + fixo + codigoCedente + nossoNumero + ios + carteira
        }
        console.log(barra)
        const _dvBarra = boleto.bank.dvBarra(barra)
        return barra.substring(0, 4) + _dvBarra + barra.substring(4, barra.length)
    }
}
const LinhaDigitavel = (barcodeData) => {
    const campos = []
    let campo = barcodeData.substring(0, 3) + barcodeData.substring(3, 4) + barcodeData.substring(19, 20) + barcodeData.substring(20, 24)
    campo = checkdigit.mod10.apply(campo)
    campos.push(campo.substring(0, 5) + '.' + campo.substring(5, campo.length))
    campo = barcodeData.substring(24, 34)
    campo = checkdigit.mod10.apply(campo)
    campos.push(campo.substring(0, 5) + '.' + campo.substring(5, campo.length))
    campo = barcodeData.substring(34, 44)
    campo = checkdigit.mod10.apply(campo)
    return [...campos, campo.substring(0, 5) + '.' + campo.substring(5, campo.length), barcodeData.substring(4, 5), barcodeData.substring(5, 9) + barcodeData.substring(9, 19)].join(' ')
}
const ParseEDIFile = (banco: string) => (fileContent) => {
    const lines = fileContent.split('\n')
    const parsedFile: any = {
        boletos: []
    }
    if (banco == 'bradesco') {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            const registro = line.substring(0, 1)
            if (registro == '0') {
                parsedFile.razao_social = line.substring(46, 76)
                parsedFile.data_arquivo = dateFromEdiDate20(line.substring(94, 100))
            } else if (registro == '1') {
                const boleto: any = {}
                parsedFile.cnpj = RemoveTrailingZeros(line.substring(3, 17))
                parsedFile.carteira = RemoveTrailingZeros(line.substring(22, 24))
                parsedFile.agencia_cedente = RemoveTrailingZeros(line.substring(24, 29))
                parsedFile.conta_cedente = RemoveTrailingZeros(line.substring(29, 37))
                boleto.codigo_ocorrencia = line.substring(108, 110)
                const ocorrenciasStr = line.substring(318, 328)
                const motivosOcorrencia = []
                boleto.paid = parseInt(boleto.valor_pago) >= parseInt(boleto.valor) || boleto.codigo_ocorrencia == '06'
                for (var j = 0; j < ocorrenciasStr.length; j += 2) {
                    var ocorrencia = ocorrenciasStr.substr(j, 2)
                    motivosOcorrencia.push(ocorrencia)
                    if (ocorrencia != '00')
                        boleto.paid = false
                }
                boleto.motivos_ocorrencia = motivosOcorrencia
                boleto.data_ocorrencia = dateFromEdiDate20(line.substring(110, 116))
                boleto.data_credito = dateFromEdiDate20(line.substring(295, 301))
                boleto.vencimento = dateFromEdiDate20(line.substring(110, 116))
                boleto.valor_pago = RemoveTrailingZeros(line.substring(253, 266))
                boleto.valor = RemoveTrailingZeros(line.substring(152, 165))
                boleto.banco_recebedor = RemoveTrailingZeros(line.substring(165, 168))
                boleto.agencia_recebedora = RemoveTrailingZeros(line.substring(168, 173))
                boleto.edi_line_number = i
                boleto.edi_line_checksum = calculateLineChecksum(line)
                boleto.edi_line_fingerprint = boleto.edi_line_number + ':' + boleto.edi_line_checksum
                boleto.nosso_numero = RemoveTrailingZeros(line.substring(70, 81))
                parsedFile.boletos.push(boleto)
            }
        }
    } else if (banco == 'santander') {
        let currentNossoNumero = null
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            const registro = line.substring(7, 8)
            if (registro == '0') {
                parsedFile.cnpj = line.substring(17, 32)
                parsedFile.razao_social = line.substring(72, 102)
                parsedFile.agencia_cedente = line.substring(32, 36)
                parsedFile.conta_cedente = line.substring(37, 47)
                parsedFile.data_arquivo = dateFromEdiDate(line.substring(143, 152))
            } else if (registro == '3') {
                var segmento = line.substring(13, 14)
                let boleto
                if (segmento == 'T') {
                    boleto = {}
                    boleto.codigo_ocorrencia = line.substring(15, 17)
                    boleto.vencimento = dateFromEdiDate(line.substring(69, 77))
                    boleto.valor = RemoveTrailingZeros(line.substring(77, 92))
                    boleto.tarifa = RemoveTrailingZeros(line.substring(193, 208))
                    boleto.banco_recebedor = RemoveTrailingZeros(line.substring(92, 95))
                    boleto.agencia_recebedora = RemoveTrailingZeros(line.substring(95, 100))
                    currentNossoNumero = RemoveTrailingZeros(line.substring(40, 52))
                    parsedFile.boletos[currentNossoNumero] = boleto
                } else if (segmento == 'U') {
                    parsedFile.boletos[currentNossoNumero].valor_pago = RemoveTrailingZeros(line.substring(77, 92))
                    let paid = parsedFile.boletos[currentNossoNumero].valor_pago >= parsedFile.boletos[currentNossoNumero].valor
                    paid = paid && parsedFile.boletos[currentNossoNumero].codigo_ocorrencia == '17'
                    boleto = parsedFile.boletos[currentNossoNumero]
                    boleto.pago = paid
                    boleto.edi_line_number = i
                    boleto.edi_line_checksum = calculateLineChecksum(line)
                    boleto.edi_line_fingerprint = boleto.edi_line_number + ':' + boleto.edi_line_checksum
                    currentNossoNumero = null
                }
            }
        }
    }
    return parsedFile
}
export const Banks = {
    bradesco: {
        logoURL: './assets/bradesco.jpg',
        codigo: '237',
        dvBarra: dvBarra,
        barcodeData: BarcodeData('bradesco'),
        linhaDigitavel: LinhaDigitavel,
        parseEDIFile: ParseEDIFile('bradesco')
    },
    santander: {
        logoURL: './assets/santander.png',
        codigo: '033',
        dvBarra: dvBarra,
        barcodeData: BarcodeData('santander'),
        linhaDigitavel: LinhaDigitavel,
        parseEDIFile: ParseEDIFile('santander')
    }
}
