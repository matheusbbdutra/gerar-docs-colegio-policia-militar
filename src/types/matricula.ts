// Em um arquivo como 'src/types/matricula.ts'

export class Matricula {
    // Seção 2: Dados do Educando
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
    cpf: string = '';
    rg: string = '';
    tituloEleitor: string = '';
    carteiraTrabalho: string = '';
    reservista: string = '';
    bolsaFamilia: boolean = false;
    nis: string = '';
    cartaoSus: string = '';
    pcd: boolean = false;
    pcdDetalhes: string = '';

    // Filiação
    nomePai: string = '';
    paiVivo: boolean = false;
    nomeMae: string = '';
    maeViva: boolean = false;

    // Seção 3: Dados do Responsável
    nomeResponsavel: string = '';
    grauParentesco: string = '';
    enderecoResponsavel: string = '';
    municipioResponsavel: string = '';
    ufResponsavel: string = '';
    telefoneResponsavel: string = '';

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
