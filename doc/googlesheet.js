const LINHA_CABECALHO = 1;
const ID_PLANILHA = "17UyvVEPZJqRi-ie0_cAk26bTJbd6BOlGeekOECGwVYI";
const ABA = "RETRABALHOS"


function montarArrayRetrabalho(dados){
  if(!typeof(dados) === Object) return

  return [dados.id, dados.assunto, dados.equipe ? dados.equipe : "", dados.cidade,dados.data, dados?.motivo ? dados?.motivo : "" , dados?.descricao ? dados?.descricao: "", dados.responsavel, ]
}

function getToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        return reject(chrome.runtime.lastError || new Error("Token não obtido"));
      }
      resolve(token);
    });
  });
}

async function getRange(range) {
  try {
    const token = await getToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${ID_PLANILHA}/values/${ABA}!${range}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro desconhecido na API do Sheets");
    }

    // Se a coluna estiver vazia, data.values não existe
    const tamanho = data.values ? data.values.length : 0;
    return tamanho;

  } catch (error) {
    console.error("Erro", error);
    return null;
  }
}

function escreverRange(values, callback) {
return new Promise(async (resolve, reject) => {
    // 1. Solicita o token de acesso ao Chrome
    var range
    try{
        range =  String(await getRange("E:E") + 1)
        if(!range.match("\\d")){
          throw new Error("Erro ao consultar a planilha, tente novamente")
        }
            await chrome.identity.getAuthToken({ interactive: true }, async function(token) {

      if (chrome.runtime.lastError || !token) {
        console.error("Erro na autenticação:", chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }

      // 2. Monta a URL do endpoint de Append do Google Sheets API v4
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${ID_PLANILHA}/values/${ABA}!A${range}:append?valueInputOption=USER_ENTERED`;

      // A API exige um array de arrays para linhas/colunas
      const body = {
        values: [montarArrayRetrabalho(values)]
      };

      // 3. Executa o POST
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log(`res ${data}`)
        
        if (!response.ok) {
          throw new Error(data.error.message || "Erro desconhecido na API do Sheets");
        }
        
        console.log("Linha adicionada com sucesso!", data);
        resolve({data: data, status: true});

      } catch (error) {
        console.error("Erro ao escrever no Sheets:", error);
        reject({erro: error, status: false});
      }
    });
    } catch(e){
      reject({erro: e, status: false})
    }

  });
}
