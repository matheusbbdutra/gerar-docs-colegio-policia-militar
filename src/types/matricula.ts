// Em um arquivo como 'src/types/matricula.ts'

export class Matricula {
    // Seção 2: Dados do Educando
    registroMatricula: string = '';
    nomeEducando: string = '';
    inep: string = '';
    periodo: string = '';
    ano: string = '';
    nivelEnsino: string = '';
    sexo: 'M' | 'F' | '' = '';
    raca: string = '';
    dataNascimento: string = '';
    estadoCivil: string = '';
    naturalidade: string = '';
    ufNatural: string = '';
    cartorioNascimento: string = '';
    livroNascimento: string = '';
    folhaNascimento: string = '';
    cpf: string = '';
    rg: string = '';
    tituloEleitor: string = '';
    carteiraTrabalho: string = '';
    reservista: string = '';
    bolsaFamilia: boolean = false;
    nis: string = '';
    cartaoSus: string = '';
    registroNascimentoCartorio: string = '';
    registroNascimentoLivro: string = '';
    registroNascimentoFolha: string = '';
    pcd: boolean = false;
    pcdDetalhes: string = '';

    // Endereço do Educando
    enderecoEducando: string = '';
    municipioEducando: string = '';
    ufEducando: string = '';
    telefoneEducando: string = '';
    pontoReferenciaEducando: string = '';

    // Campos adicionais da seção 2
    responsavelPelaTransferencia: string = '';
    responsavelPedagogico: string = '';
    disponivelAosSabados: boolean = false;
    sairParaAlmocar: boolean = false;

    // Filiação
    nomePai: string = '';
    paiVivo: boolean = false;
    cpfPai: string = '';
    rgPai: string = '';
    nomeMae: string = '';
    maeViva: boolean = false;
    cpfMae: string = '';
    rgMae: string = '';

    // Seção 3: Dados do Responsável
    nomeResponsavel: string = '';
    grauParentesco: string = '';
    enderecoResponsavel: string = '';
    municipioResponsavel: string = '';
    ufResponsavel: string = '';
    telefoneResponsavel: string = '';
    pontoReferenciaResponsavel: string = '';

    // Seção 4: Procedência Escolar
    procedenciaUnidadeEnsino: string = '';
    procedenciaPeriodo: string = '';
    procedenciaAno: string = '';
    procedenciaNivelEnsino: string = '';
    procedenciaEndereco: string = '';
    procedenciaMunicipio: string = '';
    procedenciaUF: string = '';
    procedenciaTelefone: string = '';
    procedenciaPontoReferencia: string = '';

    // Seção 6: Educação Física
    educacaoFisica: string = '';

    // Seção 4 (observações livres, se necessário)
    dadosEscolaresAnteriores: string = '';

    // Seção 5: Dados de Educação Física
    dadosEducacaoFisica: string = '';

    // Seção 7: Atividades Extraclasses
    esporte: string = '';
    cultura: string = '';
    arte: string = '';
    outrasAtividades: string = '';

    // Seção 8: Transporte
    regiaoOndeReside: 'Rural' | 'Urbana' | '' = '';
    utilizaTransporteEscolar: boolean = false;
    podeUsarBicicleta: boolean = false;

    // Seção 9: Observações
    observacoes: string = '';

    // Título do Curso (do seletor)
    tituloCurso: string = '';

    /**
     * Atribui um valor a uma propriedade da classe de forma dinâmica.
     * Converte valores para booleano se o tipo da propriedade for boolean.
     * @param key - O nome da propriedade (deve existir na classe).
     * @param value - O valor a ser atribuído.
     */
    setProp(key: string, value: any): void {
        if (key in this) {
            const propKey = key as keyof this;
            if (typeof this[propKey] === 'boolean') {
                (this as any)[propKey] = value === true || value === 'true' || value === 'sim' || value === 'on';
            } else {
                (this as any)[propKey] = value;
            }
        }
    }
}
