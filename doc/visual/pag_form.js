// Tela de retrabalho: campos extraídos da OS + campos de preenchimento manual.

var CAMPOS_EXTRAIDOS = [
    { chave: "id", rotulo: "ID" },
    { chave: "assunto", rotulo: "Assunto" },
    { chave: "equipe", rotulo: "Equipe" },
    { chave: "cidade", rotulo: "Cidade" },
    { chave: "data", rotulo: "Data" },
    { chave: "responsavel", rotulo: "Responsável"}
]

function criarControle(tag, variant, idCampo, required) {
    const el = document.createElement(tag)
    el.className = "ixc-fields field-ext"
    el.setAttribute("variant", variant)
    el.setAttribute("size", "md")
    el.id = idCampo
    el.name = idCampo
    if(required === true){
        el.required = true
    }
    if (tag === "input") {
        el.type = "text"
        el.autocomplete = "off"
    }
    return el
}

// Mesma estrutura dl/dt/dd usada pelo IXC, para herdar o tema.
function criarCampo(rotulo, controle) {
    const dl = document.createElement("dl")
    dl.className = "ixc-containers"
    dl.setAttribute("variant", "field")
    dl.setAttribute("size", "md")

    const dt = document.createElement("dt")
    dt.className = "ixc-containers"
    dt.setAttribute("variant", "label")
    dt.setAttribute("size", "md")
    const label = document.createElement("label")
    label.htmlFor = controle.id
    label.textContent = `${rotulo}:`
    dt.appendChild(label)

    const dd = document.createElement("dd")
    dd.className = "ixc-containers"
    dd.setAttribute("variant", "input")
    dd.setAttribute("size", "md")
    dd.appendChild(controle)

    dl.append(dt, dd)
    return dl
}

function titulo(texto) {
    const h2 = document.createElement("h2")
    h2.textContent = texto
    return h2
}

function montarFormRetrabalho() {
    const form = document.createElement("div")
    const btnGerarRetrabalho = document.createElement("button")

    form.id = "form-retrabalho"
    form.className = "div-ext"
    btnGerarRetrabalho.id = "btn-gerar-retrabalho"
    btnGerarRetrabalho.innerText = "Salvar na planilha"

    form.appendChild(titulo("Dados da OS"))
    for (const { chave, rotulo } of CAMPOS_EXTRAIDOS) {
        form.appendChild(criarCampo(rotulo, criarControle("input", "text", `rt-${chave}`)))
    }

    form.appendChild(titulo("Preenchimento manual"))

    const motivo = criarControle("select", "select", "rt-motivo")
    
    motivo.appendChild(new Option("Selecione...", ""))
    motivo.required = true
    for (const m of motivos) motivo.appendChild(new Option(m, m))
    form.appendChild(criarCampo("Motivo", motivo))

    form.appendChild(criarCampo("Descrição", criarControle("textarea", "textarea", "rt-descricao", true)))

    form.appendChild(btnGerarRetrabalho)
    btnGerarRetrabalho.addEventListener("click", async () => {
        try{
            const dados = await scriptChrome()
            dados["motivo"] = motivo.value
            dados["descricao"] = document.getElementById("rt-descricao").value
            console.log(dados)
            if(dados["motivo"].trim() == "" || dados["descricao"].trim() == ""){
                painelErro.textContent = "Selecione o motivo e preencha a descrição"
                return
            }
            
            const escreverRangeRes = await escreverRange(dados, abas.retrabalho)
            if (escreverRangeRes?.status){
                painelErro.textContent = `Salvo com sucesso`
                document.getElementById("painel-main").removeChild(form)
            } else{
                throw new Error(`erro teste${escreverRangeRes?.erro}`)
            }

        } catch(e){
            painelErro.textContent = e.erro
        }
    })

    return form
}

// Cria o formulário (ou atualiza, se já existir) com os dados extraídos.
// Se a OS mudou, o formulário é refeito para não carregar o manual da OS anterior.
function renderRetrabalho(container, dados) {
    let form = container.querySelector("#form-retrabalho")
    if (form && form.querySelector("#rt-id").value !== dados.id) {
        form.remove()
        form = null
    }
    if (!form) {
        form = montarFormRetrabalho()
        container.appendChild(form)
    }

    for (const { chave } of CAMPOS_EXTRAIDOS) {
        const input = form.querySelector(`#rt-${chave}`)
        if (dados[chave]) {
            input.value = dados[chave]
            input.readOnly = true // achou no IXC: travado
            input.placeholder = ""
        } else {
            input.readOnly = false // não achou: deixa preencher na mão
            input.placeholder = "Não encontrado - preencha manualmente"
        }
    }
}
