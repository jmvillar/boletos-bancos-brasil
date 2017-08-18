import { IBoleto, IOptions, IBank } from './interfaces'
import * as fs from 'fs';
declare const require
const PDFDocument = require('pdfkit')

const TOTAL_WIDTH = 610
const TOTAL_HEIGHT = 790
const LEFT_MARGIN = 0
const RIGHT_MARGIN = 0
const BOLETO_WIDTH = TOTAL_WIDTH - (LEFT_MARGIN + RIGHT_MARGIN)
const BOLETO_HEIGHT = 370

export const GeneratePdf = (data: IBoleto) => {
    const doc = new PDFDocument({ autoFirstPage: false })
    // doc.addPage({ margins: { top: 0, bottom: 0, left: 0, right: 0 }, size: 'A4' })
    // DrawBoletoAtCoord(0, 0, doc, data)
    // return doc
}
const DrawBoletoAtCoord = (x_origen: number, y_origen: number, doc, data: IBoleto) => {
    //note: width:610px height:790
    doc.rect(x_origen, y_origen, BOLETO_WIDTH, BOLETO_HEIGHT).fillOpacity(0.1).fillAndStroke("#000000", "#555")
}
