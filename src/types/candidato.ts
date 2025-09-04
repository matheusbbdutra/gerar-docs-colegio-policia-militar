export class Candidato {
  id?: number;
  nome: string = '';
  cpfCandidato: string = '';
  dataNascimento: string = '';
  cpfMae?: string = '';
  nomeMae: string = '';
  cpfPai?: string;
  nomePai?: string;
  responsavelLegal?: string;
  cpfResponsavel?: string;
  telefone1: string = '';
  telefone2?: string;
  email?: string;
  turma: string = '';
  possuiDeficiencia: boolean = false;
  defFisica: boolean = false;
  defAuditiva: boolean = false;
  defIntelectual: boolean = false;
  defTEA: boolean = false;
  defAltasHabilidades: boolean = false;
  defOutro?: string;
  filhoNetoPM: boolean= false;
  nomePM?: string;
  matriculaPM?: string;
  docIdentidadeFuncional: boolean = false;
  docComprovacaoDependencia: boolean = false;
  docCertidaoObito: boolean = false;
  docLaudoMedico: boolean = false;
  docDeclaracaoEscola: boolean = false;
  docIdentidadeResponsavel: boolean = false;
  docCertidaoNascimento: boolean = false;
  isWhatsapp: boolean = false;
  isLigacao: boolean = false;
  isAmpla: boolean = false;


    setProp(key: string, value: any): void {
        if (key in this) {
            if (typeof (this as any)[key] === 'boolean') {
                (this as any)[key] = value === true || value === 'true';
            } else {
                (this as any)[key] = value;
            }
        }
    }
}
