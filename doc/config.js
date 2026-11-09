class Extracao {
    constructor(id, assunto, equipe, cidade, data, responsável) {
        this.id = id,
        this.assunto = assunto,
        this.equipe = equipe,
        this.cidade = cidade,
        this.responsavel = responsável,
        this.data = data
    }
    valores() {
        console.log(`
        ID: ${this.id},
        Assunto: ${this.assunto},
        Equipe: ${this.equipe},
        Cidade: ${this.cidade},
        Responsável: ${this.responsavel},
        Data: ${this.data}
        `)
    }
}


var CAMPOS_IXC = {
    id: ["id"],
    assunto: ["id_ticket_label", "id_assunto_label"],
    equipe: ["id_tecnico_label"],
    cidade: ["id_cidade_label", "id_cidade", "cidade"],
    responsavel: ["menu-user-name"]
}

var assuntos = ["INSTALAÇÃO FIBRA ÓPTICA", "MUDANÇA DE ENDEREÇO", "UPGRADE",
    "UPGRADE + INST. REDE MESH", "DOWNGRADE", "RETRABALHO TÉCNICO", "INSTALAÇÃO VIA RÁDIO",
    "MIGRAÇÃO RÁDIO/UTP/FIBRA", "MUDANÇA DE CÔMODO", "SUBSTITUIÇÃO FIBRA ÓPTICA", "MANUT. PÓS MIGRAÇÃO DE OLT", "MANUT. SEM CONEXÃO - FIBRA"]

var motivos = ["01 - FALTA ANEXO",
    "02 - READ. EQUIPAMENTOS",
    "03 - AJUSTE DE SINAL",
    "04 - DESCRIÇÃO INCOMPLETA",
    "05 - AJUSTE COMODATOS",
    "06 - VEDAÇÃO"]

