var buttonRetrabalho = document.getElementById("gerar-retrabalho")
var painelMain = document.getElementById("painel-main")
var painelErro = document.getElementById("painel-erro")
var janelaMain

try {
    window.onload = async () => {
        var aba = await verificarAba()
        console.log("teste")
        if (!aba["ixc"]) {
            document.getElementsByClassName("main-container")[0].classList.add("disabled-div")
        }
        janelaMain = await pegarJanela()
    }
} catch (e) {
    console.log(e)
}

try {
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        var mainContainerCL = document.getElementsByClassName("main-container")[0].classList
        var janelaAtual = await pegarJanela()
        console.log(`${Object.keys(janelaMain)} main ${Object.values(janelaMain)}, atual ${Object.values(janelaAtual)}`)
        if(janelaMain.id !== janelaAtual.id) return;
        var janela = await verificarAba()
        if (janela["ixc"]) {
            mainContainerCL.remove("disabled-div")
        } else {
            mainContainerCL.add("disabled-div")
        }
    })
} catch (e) {
    console.error(`Erro ao consultar api: ${e}`)
}

buttonRetrabalho.addEventListener("click", async () => {
    painelErro.textContent = ""
    try {
        const dados = await scriptChrome()
        renderRetrabalho(painelMain, dados)
    } catch (erro) {
        painelErro.textContent = `Erro ao extrair dados: ${erro.message}`
    }
})

