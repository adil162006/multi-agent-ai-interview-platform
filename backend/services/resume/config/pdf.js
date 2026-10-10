import fs from "fs"

import {PDFParse} from "pdf-parse"
export const extractText = async (filepath)=>{
    const buffer = fs.readFileSync(filepath);
    const pdf=new PDFParse({data:buffer})
    const result = await pdf.getText()

    return result.text
}
