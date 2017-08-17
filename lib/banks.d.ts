import { IBoleto } from './interfaces';
export declare const Banks: {
    bradesco: {
        logoURL: string;
        codigo: string;
        dvBarra: (barra: any) => number;
        barcodeData: (boleto: IBoleto) => string;
        linhaDigitavel: (barcodeData: any) => string;
        parseEDIFile: (fileContent: any) => any;
    };
    santander: {
        logoURL: string;
        codigo: string;
        dvBarra: (barra: any) => number;
        barcodeData: (boleto: IBoleto) => string;
        linhaDigitavel: (barcodeData: any) => string;
        parseEDIFile: (fileContent: any) => any;
    };
};
