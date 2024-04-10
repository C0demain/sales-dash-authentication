import axios, { AxiosResponse, AxiosError } from 'axios';
import * as XLSX from 'xlsx';
import { UsersRepo } from '../repository/UsersRepo';
import { ProductsRepo } from '../repository/ProductsRepo';
import { ProductsService } from '../service/ProductsService';


function excelSerialToDate(serial: number): Date {
  const baseDate = new Date('1900-01-01'); // Data base do Excel
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Número de milissegundos em um dia
  const offsetDays = (serial - 1) * millisecondsInDay; // Calcula o deslocamento em milissegundos
  return new Date(baseDate.getTime() + offsetDays); // Adiciona o deslocamento à data base
}

function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0'); // Extrai o dia e preenche com zero à esquerda se necessário
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Extrai o mês e preenche com zero à esquerda se necessário
  const ano = data.getFullYear(); // Extrai o ano

  return `${dia}/${mes}/${ano}`;
}


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

        for(let i = 1; i<rows.length ;i++){
          const row = rows[i];

          let objJson : any = {
            id : row[4],
            name: row[3],
            description : "",
            value : 0,
          }
          
          try{
            const prod = await new ProductsRepo().getById(objJson.id);
            if(!prod){
              fazerRequisicaoPost("http://localhost:8000/api/v1/products/register" , objJson)
            }
          }catch(error){
              console.log(error);
          }

          //fazerRequisicaoPost("http://localhost:8000/api/v1/products/register" , objJson)
          
          
          
          
          
        }

    }
    catch(error){
        console.log(error);
    }
 
}

async function fazerRequisicaoPost(url: string, dados: any): Promise<any> {
  try {
    const resposta: AxiosResponse = await axios.post(url, dados);
    return resposta.data;
  } catch (erro) {
    if (axios.isAxiosError(erro)) {
      // Erro de requisição Axios
      console.error('Erro na requisição:', erro.message);
    } else {
      // Outro tipo de erro
      console.error('Erro:', erro);
    }
    throw erro; // Lança o erro novamente para que seja tratado pelo código cliente
  }
}


export default processData;