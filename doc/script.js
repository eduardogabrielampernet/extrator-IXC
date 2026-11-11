async function verificarAba() {
    var retorno = {
        "ixc": false,
        "aba": false
    }
    try {
        const abas = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const aba = abas[0]
        retorno["aba"] = aba
        retorno["ixc"] = aba?.url?.includes("https://ixc.ampernet.com.br/adm.php") ?? false
    } catch (e) {
        console.log(`ERRO: ${e}`)
    }
    return retorno
}

async function pegarJanela(){
    try{
        return await chrome.windows.getLastFocused()
    } catch(e){
        console.log(`ERRO: ${e}`)
    }
}

// Roda na aba do IXC e devolve { id, assunto, equipe, cidade, data } ou null se não achar a OS.
async function scriptChrome() {
    var janela = await verificarAba()
    if (!janela["ixc"]) {
        throw new Error("Abra uma página do IXC na aba ativa.")
    }

    const resultados = await chrome.scripting.executeScript({
        target: { tabId: janela["aba"].id, allFrames: true },
        func: extrairDados,
        args: [CAMPOS_IXC]
    })

    // Com allFrames, cada frame responde; só um deles tem o formulário da OS.
    const dados = resultados.map(r => r.result).find(r => r && r.id)
    console.log(`dados ${dados}`)
    if (!dados) {
        throw new Error("Aba da OS não encontrada. Abra a OS e tente de novo.")
    }
    return dados
}

// ATENÇÃO: esta função é injetada na página, então precisa ser autocontida
// (não pode usar variáveis de fora; tudo vem pelo parâmetro "campos").
function extrairDados(campos) {
    function verificarResponsavel(nome){
        var RESPONSAVEIS = [
            "EDUARDO - AMP.",
            "FELIPE - AMP.",
            "MATHEUS - AMP.",
            "MARCO - AMP.",
            "PEDRO - AMP.",
            "CARLA - MUN.",
            "JHENIFER - MUN.",
            "LEILA - MUN."
        ]
        var responsavel = RESPONSAVEIS.filter(resp => resp.includes(nome.split(" ")[0]))

        return responsavel ? responsavel : "Responsável não encontrado"
    }
    // O IXC mantém várias abas abertas no DOM com os mesmos "name".
    // Preferimos o último elemento visível (a aba que está na tela).
    const valorDe = (nomes) => {
        for (const nome of nomes) {
            var valor
            var els = Array.from(document.getElementsByName(nome))

            if (!els.length && !nome.includes("user-name")) continue

            if(nome.includes("user-name")){
                els = Array.from(document.getElementsByClassName(nome))
                valor = verificarResponsavel(els[0].getElementsByTagName("span")[0].textContent)
            } else{
                const visiveis = els.filter(el => el.offsetParent !== null)
                const alvo = (visiveis.length ? visiveis : els).at(-1)
                valor = (alvo.value || "").trim()
            }


            if (valor) return String(valor).toUpperCase()
        }
        return ""
    }

    const id = valorDe(campos.id)
    if (!id) return null

    return {
        id,
        assunto: valorDe(campos.assunto),
        equipe: valorDe(campos.equipe),
        cidade: valorDe(campos.cidade),
        responsavel: valorDe(campos.responsavel),
        filial: valorDe(campos.filial),
        data: new Date().toLocaleDateString("pt-BR")
    }
}
