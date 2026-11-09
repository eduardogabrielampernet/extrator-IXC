var buttonRetrabalho = document.getElementById("gerar-retrabalho")
var painelMain = document.getElementById("painel-main")
var painelErro = document.getElementById("painel-erro")

try {
    window.onload = async () => {
        var janela = await verificarJanela()
        if (!janela["ixc"]) {
            document.getElementsByClassName("main-container")[0].classList.add("disabled-div")
        }
    }
} catch (e) {
    console.log(e)
}

try {
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        var mainContainerCL = document.getElementsByClassName("main-container")[0].classList
        var janela = await verificarJanela()
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

