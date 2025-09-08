import * as path from 'path';
import * as fs from 'fs-extra';
import { BrowserWindow } from 'electron';
import { Candidato } from '../types/candidato';

export class FormInscricaoGerarPDFService {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  async gerarPDFFicha(candidato: Candidato): Promise<string> {
    try {
      const htmlContent = this.gerarHTMLFicha(candidato);

      // Criar diretório de PDFs se não existir
      const pdfDir = path.join(this.dataDir, 'pdfs');
      await fs.ensureDir(pdfDir);

      // Nome do arquivo PDF
      const nomeArquivo = `ficha_${candidato.nome.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      const caminhoArquivo = path.join(pdfDir, nomeArquivo);

      // Criar janela oculta
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          sandbox: false,
        },
      });

      // Carregar o conteúdo HTML
      await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

      // Gerar PDF
      const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
      });

      // Salvar PDF
      await fs.writeFile(caminhoArquivo, pdfBuffer);

      // Limpar
      win.destroy();

      return caminhoArquivo;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Erro ao gerar PDF: ${errorMessage}`);
    }
  }

  public gerarHTMLFicha(candidato: Candidato): string {
    const dataGeracao = new Date().toLocaleDateString('pt-BR');

    // Formas de contato
    const formasContato: string[] = [];
    if (candidato.isWhatsapp) formasContato.push('WhatsApp');
    if (candidato.isLigacao) formasContato.push('Ligação');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Ficha de Inscrição</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.2;
                color: #333;
                font-size: 12px;
            }
            .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #000;
                padding-bottom: 8px;
            }
            .header h1 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }
            .header h2 {
                margin: 2px 0 0 0;
                font-size: 12px;
                font-weight: normal;
            }
            .section {
                margin-bottom: 12px;
                border: 1px solid #ccc;
                border-radius: 3px;
                overflow: hidden;
            }
            .section-title {
                background-color: #f0f0f0;
                padding: 4px 6px;
                font-weight: bold;
                margin: 0;
                border-bottom: 1px solid #ccc;
                font-size: 12px;
            }
            .section-content {
                padding: 6px;
            }
            .row {
                margin: 3px 0;
                font-size: 12px;
            }
            .row strong {
                display: inline;
                width: 100px;
                font-weight: bold;
                white-space: nowrap;
            }
            .two-columns {
                display: flex;
                gap: 15px;
            }
            .column {
                flex: 1;
            }
            .deficiencia-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .deficiencia-item {
                width: 48%;
                font-size: 12px;
            }
            .doc-columns {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .doc-item {
                width: 48%;
                margin: 1px 0;
                font-size: 14px;
            }
            .declaration {
                margin: 10px 0;
                padding: 6px;
                background-color: #f9f9f9;
                border-left: 3px solid #007bff;
                font-size: 10px;
                line-height: 1.3;
                text-align: justify;
            }
            .signatures {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
            .signature {
                text-align: center;
                width: 45%;
            }
            .signature-line {
                border-top: 1px solid #000;
                margin-bottom: 3px;
                height: 20px;
            }
            .signature-label {
                font-size: 12px;
                font-weight: bold;
            }
            .date-section {
                text-align: center;
                margin-top: 10px;
                font-size: 12px;
                font-weight: bold;
            }
            .comprovante {
                margin-top: 25px;
                border-top: 2px dashed #000;
                padding-top: 15px;
            }
            .comprovante .header {
                border-bottom: 1px solid #000;
                margin-bottom: 10px;
                padding-bottom: 6px;
            }
            .comprovante .section {
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                font-style: italic;
                font-size: 12px;
                margin-top: 15px;
                color: #666;
            }
            @media print {
                @page {
                    size: A4;
                    margin: 0.5cm;
                }
            }
        </style>
    </head>
    <body>
        <!-- FICHA PRINCIPAL -->
        <div class="header">
            <h1>FICHA DE INSCRIÇÃO DO CANDIDATO</h1>
            <h2>COLÉGIO DA POLÍCIA MILITAR DA PARAÍBA</h2>
        </div>

        <div class="section">
            <h3 class="section-title">DADOS PESSOAIS</h3>
            <div class="section-content">
                <div class="two-columns">
                          <div class="column">
                        <div class="row"><strong>Nome:</strong> ${candidato.nome}</div>
                        <div class="row"><strong>CPF:</strong> ${candidato.cpfCandidato || 'Não informado'}</div>
                        <div class="row"><strong>Data nasc.:</strong> ${candidato.dataNascimento}</div>
                        <div class="row"><strong>Nome da mãe:</strong> ${candidato.nomeMae}</div>
                        ${candidato.nomePai ? `<div class="row"><strong>Nome do pai:</strong> ${candidato.nomePai}</div>` : ''}
                    </div>
                    <div class="column">
                        <div class="row"><strong>Responsável:</strong> ${candidato.responsavelLegal}</div>
                        <div class="row"><strong>CPF Resp.:</strong> ${candidato.cpfResponsavel}</div>
                        <div class="row"><strong>Telefone 1:</strong> ${candidato.telefone1}</div>
                        ${candidato.telefone2 ? `<div class="row"><strong>Telefone 2:</strong> ${candidato.telefone2}</div>` : ''}
                        ${candidato.email ? `<div class="row"><strong>Email:</strong> ${candidato.email}</div>` : ''}
                        <div class="row"><strong>Contato pref.:</strong> ${formasContato.join(', ') || '---'}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">DEFICIÊNCIA / TEA / ALTAS HABILIDADES</h3>
            <div class="section-content">
                <div class="row"><strong>Declara possuir deficiência?</strong> ${candidato.possuiDeficiencia ? 'Sim' : 'Não'}</div>
                ${candidato.possuiDeficiencia ? `
                <div class="deficiencia-list">
                    ${candidato.defFisica ? '<div class="deficiencia-item">• Deficiência Física</div>' : ''}
                    ${candidato.defAuditiva ? '<div class="deficiencia-item">• Deficiência Auditiva</div>' : ''}
                    ${candidato.defIntelectual ? '<div class="deficiencia-item">• Deficiência Intelectual</div>' : ''}
                    ${candidato.defTEA ? '<div class="deficiencia-item">• TEA</div>' : ''}
                    ${candidato.defAltasHabilidades ? '<div class="deficiencia-item">• Altas Habilidades</div>' : ''}
                    ${candidato.defOutro ? `<div class="deficiencia-item">• Outro: ${candidato.defOutro}</div>` : ''}
                </div>
                ` : ''}
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">VÍNCULO COM POLICIAL MILITAR</h3>
            <div class="section-content">
                <div class="row"><strong>É filho ou neto de PM?</strong> ${candidato.filhoNetoPM ? 'Sim' : 'Não'}</div>
                ${candidato.filhoNetoPM ? `
                    ${candidato.nomePM ? `<div class="row"><strong>Nome do PM:</strong> ${candidato.nomePM}</div>` : ''}
                    ${candidato.matriculaPM ? `<div class="row"><strong>Matrícula:</strong> ${candidato.matriculaPM}</div>` : ''}
                    <div class="row"><strong>Turma (cota PMPB):</strong> ${candidato.turma}</div>
                ` : `
                    <div class="row"><strong>Turma (ampla concorrência):</strong> ${candidato.turma}</div>
                `}
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">DOCUMENTAÇÃO ENTREGUE</h3>
            <div class="section-content">
                <div class="doc-columns">
                    ${candidato.docIdentidadeFuncional ? '<div class="doc-item">☑ Identidade Funcional do PM</div>' : ''}
                    ${candidato.docComprovacaoDependencia ? '<div class="doc-item">☑ Comprovação de dependência</div>' : ''}
                    ${candidato.docCertidaoObito ? '<div class="doc-item">☑ Certidão de óbito</div>' : ''}
                    ${candidato.docLaudoMedico ? '<div class="doc-item">☑ Laudo médico atualizado</div>' : ''}
                    ${candidato.docDeclaracaoEscola ? '<div class="doc-item">☑ Declaração da escola</div>' : ''}
                    ${candidato.docIdentidadeResponsavel ? '<div class="doc-item">☑ Identidade do responsável</div>' : ''}
                    ${candidato.docCertidaoNascimento ? '<div class="doc-item">☑ Certidão/RG/CPF do candidato</div>' : ''}
                </div>
            </div>
        </div>

        <div class="declaration">
            <strong>DECLARAÇÃO:</strong> Eu, responsável legal pelo candidato acima identificado, declaro que todas as informações prestadas são verdadeiras e que estou ciente de que a prestação de informações falsas ou a apresentação de documentos inválidos implicará na desclassificação do candidato do processo seletivo. Declaro ainda que li e concordo com todas as normas e critérios estabelecidos no edital do processo seletivo.
        </div>

        <div class="signatures">
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Assinatura do Responsável Legal</div>
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Assinatura do Funcionário</div>
            </div>
        </div>

        <div class="date-section">
            João Pessoa - PB, ${dataGeracao}
        </div>

        <!-- COMPROVANTE DE INSCRIÇÃO -->
        <div class="comprovante">
            <div class="header">
                <h1>COMPROVANTE DE INSCRIÇÃO</h1>
                  <h2>COLÉGIO DA POLÍCIA MILITAR DA PARAÍBA</h2>
            </div>

            <div class="section">
                <h3 class="section-title">DADOS DA INSCRIÇÃO</h3>
                <div class="section-content">
                    <div class="row"><strong>Nome do candidato:</strong> ${candidato.nome}</div>
                    <div class="row"><strong>Turma:</strong> ${candidato.turma}</div>
                    <div class="row"><strong>Tipo de vaga:</strong> ${candidato.filhoNetoPM ? 'Cota PMPB' : 'Ampla Concorrência'}</div>
                    <div class="row"><strong>Data da inscrição:</strong> ${dataGeracao}</div>
                </div>
            </div>

            <div class="signatures">
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-label">Assinatura do Funcionário Responsável</div>
                </div>
            </div>

            <div class="date-section">
                João Pessoa - PB, ${dataGeracao}
            </div>
        </div>

        <div class="footer">
            Documento gerado automaticamente pelo Sistema de Cadastro CPM-PB
        </div>
    </body>
    </html>
    `;
  }
}
