import axios from "axios";
import * as XLSX from 'xlsx';

async function processData(path : string) : Promise<void>{
    try{
        const wb = XLSX.readFile(path);
        const ws = wb.Sheets[wb.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(ws,{header:1});
        if (!ws || !ws['!ref']) {
            console.error('Planilha inválida ou sem intervalo definido.');
            return;
          }
        const range = XLSX.utils.decode_range(ws['!ref']);
        const rows = [];
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = ws[cellRef];
            row.push(cell ? cell.v : undefined);
          }
          rows.push(row);
        }

        for(let i = 1; i<rows.length;i++){
            const row = rows[i];
            console.log(row)
        }

    }
    catch(error){
        console.log(error);
    }

 
}


processData('Planilha_modelo.xlsx');