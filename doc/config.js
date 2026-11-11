const CAMPOS_IXC = {
    id: ["id"],
    assunto: ["id_ticket_label", "id_assunto_label"],
    equipe: ["id_tecnico_label"],
    cidade: ["id_cidade_label", "id_cidade", "cidade"],
    responsavel: ["menu-user-name"],
    filial: ["id_filial", "filial"]
}

const assuntos = ["INSTALAÇÃO FIBRA ÓPTICA", "MUDANÇA DE ENDEREÇO", "UPGRADE",
    "UPGRADE + INST. REDE MESH", "DOWNGRADE", "RETRABALHO TÉCNICO", "INSTALAÇÃO VIA RÁDIO",
    "MIGRAÇÃO RÁDIO/UTP/FIBRA", "MUDANÇA DE CÔMODO", "SUBSTITUIÇÃO FIBRA ÓPTICA", "MANUT. PÓS MIGRAÇÃO DE OLT", "MANUT. SEM CONEXÃO - FIBRA"]

const motivos = ["01 - FALTA ANEXO",
    "02 - READ. EQUIPAMENTOS",
    "03 - AJUSTE DE SINAL",
    "04 - DESCRIÇÃO INCOMPLETA",
    "05 - AJUSTE COMODATOS",
    "06 - VEDAÇÃO"]

const abas = {
    retrabalho: "RETRABALHOS",
    pontos: "PONTOS CABEADOS",
    pontos3: "PONTOS CABEADOS - 3°"
}
