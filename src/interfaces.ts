export type TBanks = 'bradesco' | 'santander'
export interface IBank {
    logoURL: string
    codigo: string
    dvBarra
    barcodeData
    linhaDigitavel
    parseEDIFile
}
export interface IOptions {
    banco: string
    data_emissao: Date
    data_vencimento: Date
    valor: number
    nosso_numero: string
    numero_documento: string
    cedente: string
    cedente_cnpj: string
    codigo_cedente: number
    agencia: number
    carteira: number
    pagador: string
    instrucoes: string
    local_de_pagamento: string
}
export interface IBoleto {
    bank: IBank
    data_emissao: Date
    data_vencimento: Date
    valor: number
    nosso_numero: string
    numero_documento: string
    cedente: string
    cedente_cnpj: string
    codigo_cedente: number
    agencia: number
    carteira: number
    pagador: string
    instrucoes: string
    local_de_pagamento: string
    linha_digitavel
}
