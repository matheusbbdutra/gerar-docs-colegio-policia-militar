import * as path from 'path';
import * as fs from 'fs-extra';
import { BrowserWindow } from 'electron';
import { Matricula } from '../types/matricula';

export class FormMatriculaGerarPDFService {
    private dataDir: string;

    constructor(dataDir: string) {
        this.dataDir = dataDir;
    }

    /**
     * Gera o PDF a partir de um objeto de matrícula, salva em disco e retorna o caminho do arquivo.
     */
    async gerarPDFFicha(matricula: Matricula): Promise<string> {
        try {
            const htmlContent = this.gerarHTMLFicha(matricula);

            const pdfDir = path.join(this.dataDir, 'pdfs_matricula');
            await fs.ensureDir(pdfDir);

            const nomeArquivo = `matricula_${matricula.nomeEducando?.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
            const caminhoArquivo = path.join(pdfDir, nomeArquivo);

            const win = new BrowserWindow({
                show: false,
                webPreferences: {
                    sandbox: false,
                },
            });

            await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

            const pdfBuffer = await win.webContents.printToPDF({
                printBackground: true,
                pageSize: 'A4',
                margins: {
                    top: 0.4,
                    bottom: 0.4,
                    left: 0.4,
                    right: 0.4
                }
            });

            await fs.writeFile(caminhoArquivo, pdfBuffer);

            if (!win.isDestroyed()) {
                win.destroy();
            }

            return caminhoArquivo;
        } catch (error) {
            console.error('Erro ao gerar PDF de matrícula:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            throw new Error(`Erro ao gerar PDF de matrícula: ${errorMessage}`);
        }
    }

    /**
     * Gera o conteúdo HTML da ficha de matrícula com base nos dados fornecidos.
     */
    public gerarHTMLFicha(matricula: Matricula): string {
        // Funções auxiliares para renderização
        const renderRadio = (value?: boolean) => value === undefined ? '&nbsp;' : (value ? 'Sim' : 'Não');
        const renderField = (value?: string) => value || '&nbsp;';
        const renderSexo = (value?: 'M' | 'F' | '') => value === 'M' ? 'Masculino' : (value === 'F' ? 'Feminino' : '&nbsp;');

        return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Ficha Individual do Educando</title>
        <style>
            @page {
                size: A4;
                margin: 1cm;
            }
            body { 
                font-family: Arial, sans-serif; 
                font-size: 8pt; 
                color: #000;
                line-height: 1.2;
            }
            .header-container {
                border: 1.5px solid #000;
                margin-bottom: 5px;
            }
            .header-grid {
                display: grid;
                grid-template-columns: 1fr 6fr 3fr;
                align-items: center;
                text-align: center;
            }
            .header-grid > div {
                padding: 4px;
            }
            .header-grid .logo {
                border-right: 1.5px solid #000;
            }
            .header-grid .title {
                border-right: 1.5px solid #000;
            }
            .header-grid h1 { font-size: 11pt; font-weight: bold; margin: 0; }
            .header-grid h2 { font-size: 8pt; font-weight: normal; margin: 0; }
            .header-grid h3 { font-size: 9pt; font-weight: bold; margin: 0; }
            .course-title {
                border-top: 1.5px solid #000;
                text-align: center;
                padding: 4px;
                font-size: 10pt;
                font-weight: bold;
                background-color: #f0f0f0;
            }

            .fieldset { 
                border: 1px solid #000; 
                margin-bottom: 4px; 
                padding: 0 8px 8px; 
                display: flex;
                flex-wrap: wrap;
            }
            .legend { 
                font-weight: bold; 
                font-size: 8.5pt; 
                padding: 0 5px; 
                margin-left: 10px;
                width: auto;
            }
            .grid { 
                display: grid; 
                gap: 0 8px;
                width: 100%;
            }
            .field { 
                margin-top: 4px; 
            }
            .field .label { 
                font-size: 6.5pt; 
                font-weight: bold; 
                text-transform: uppercase; 
                margin-bottom: 1px; 
            }
            .field .value { 
                border-bottom: 0.5px solid #333; 
                padding: 1px; 
                min-height: 12px;
                font-weight: bold;
                font-size: 8pt;
            }
            
            .g-col-1 { grid-column: span 1; } .g-col-2 { grid-column: span 2; }
            .g-col-3 { grid-column: span 3; } .g-col-4 { grid-column: span 4; }
            .g-col-5 { grid-column: span 5; } .g-col-6 { grid-column: span 6; }
            .g-col-7 { grid-column: span 7; } .g-col-8 { grid-column: span 8; }
            .g-col-9 { grid-column: span 9; } .g-col-10 { grid-column: span 10; }
            .g-col-11 { grid-column: span 11; } .g-col-12 { grid-column: span 12; }
            .g-col-13 { grid-column: span 13; } .g-col-14 { grid-column: span 14; }
            .g-col-15 { grid-column: span 15; } .g-col-16 { grid-column: span 16; }

            .sub-legend { font-weight: bold; font-size: 7.5pt; margin-top: 6px; }

            .signature-box { 
                margin-top: 20px; 
                text-align: center; 
                width: 45%;
            }
            .signature-line { 
                border-top: 1px solid #000; 
                margin-bottom: 2px;
            }
            .signature-label { 
                font-size: 7pt; 
                font-weight: bold; 
            }
        </style>
    </head>
    <body>
        <div class="header-container">
            <div class="header-grid">
                <div class="logo">
                     <img src="data:image/png;base64,${this.getBrasaoBase64()}" alt="Brasão" style="height: 50px; margin: 0 auto;">
                </div>
                <div class="title">
                    <h1>GOVERNO DO ESTADO DA PARAÍBA</h1>
                    <h2>SECRETARIA DE ESTADO DA EDUCAÇÃO</h2>
                </div>
                <div class="ficha-title">
                    <h3>FICHA INDIVIDUAL DO EDUCANDO</h3>
                </div>
            </div>
            <div class="course-title">
                ${renderField(matricula.tituloCurso)}
            </div>
        </div>

        <div class="fieldset">
            <legend class="legend">1. DADOS DA UNIDADE DE ENSINO</legend>
            <div class="grid" style="grid-template-columns: repeat(16, 1fr);">
                <div class="field g-col-12"><div class="label">UNIDADE DE ENSINO</div><div class="value">COLÉGIO DA POLÍCIA MILITAR ESTUDANTE REBECA CRISTINA ALVES SIMÕES</div></div>
                <div class="field g-col-4"><div class="label">GREC</div><div class="value">1º</div></div>
                <div class="field g-col-4"><div class="label">1.3 DEPENDÊNCIA ADMINISTRATIVA</div><div class="value">ESTADUAL</div></div>
                <div class="field g-col-4"><div class="label">1.4 DEC. DE CRIAÇÃO</div><div class="value">16094 DE 07/02/1994</div></div>
                <div class="field g-col-8"><div class="label">1.5 ATO QUE AUTORIZOU O FUNCIONAMENTO</div><div class="value">RES. Nº 210/14 DE 19/09/2014</div></div>
                <div class="field g-col-12"><div class="label">1.6 ATO QUE RECONHECEU O FUNCIONAMENTO</div><div class="value">CEE/PB Nº 001/2015, DOE 01/02/2015</div></div>
                <div class="field g-col-4"><div class="label">1.9 TELEFONE</div><div class="value">3213-8207 / 8701</div></div>
                <div class="field g-col-14"><div class="label">1.7 MUNICÍPIO</div><div class="value">JOÃO PESSOA</div></div>
                <div class="field g-col-2"><div class="label">1.8 UF</div><div class="value">PB</div></div>
            </div>
        </div>

        <div class="fieldset">
            <legend class="legend">2. DADOS DE IDENTIFICAÇÃO DO EDUCANDO</legend>
            <div class="grid" style="grid-template-columns: repeat(12, 1fr);">
                <div class="field g-col-9"><div class="label">2.1 NOME DO EDUCANDO</div><div class="value">${renderField(matricula.nomeEducando)}</div></div>
                <div class="field g-col-3"><div class="label">Nº INEP</div><div class="value">${renderField(matricula.inep)}</div></div>
                <div class="field g-col-2"><div class="label">2.2 PERÍODO</div><div class="value">${renderField(matricula.periodo)}</div></div>
                <div class="field g-col-2"><div class="label">2.3 ANO</div><div class="value">${renderField(matricula.ano)}</div></div>
                <div class="field g-col-3"><div class="label">2.4 NÍVEL DE ENSINO</div><div class="value">${renderField(matricula.nivelEnsino)}</div></div>
                <div class="field g-col-2"><div class="label">2.5 SEXO</div><div class="value">${renderSexo(matricula.sexo)}</div></div>
                <div class="field g-col-3"><div class="label">2.6 RAÇA</div><div class="value">${renderField(matricula.raca)}</div></div>
                <div class="field g-col-3"><div class="label">2.7 DATA DE NASCIMENTO</div><div class="value">${renderField(matricula.dataNascimento)}</div></div>
                <div class="field g-col-3"><div class="label">2.8 ESTADO CIVIL</div><div class="value">${renderField(matricula.estadoCivil)}</div></div>
                <div class="field g-col-4"><div class="label">2.9 NATURAL DE</div><div class="value">${renderField(matricula.naturalidade)}</div></div>
                <div class="field g-col-2"><div class="label">2.10 UF</div><div class="value">${renderField(matricula.ufNatural)}</div></div>
                <div class="field g-col-4"><div class="label">2.13 CÉDULA DE IDENTIDADE (Nº, ÓRGÃO, UF)</div><div class="value">${renderField(matricula.rg)}</div></div>
                <div class="field g-col-4"><div class="label">CPF</div><div class="value">${renderField(matricula.cpf)}</div></div>
                <div class="field g-col-4"><div class="label">2.16 CERT. DE RESERVISTA</div><div class="value">${renderField(matricula.reservista)}</div></div>
                
                <div class="sub-legend g-col-12">INFORMAÇÕES ADICIONAIS</div>
                <div class="field g-col-3"><div class="label">BOLSA FAMÍLIA?</div><div class="value">${renderRadio(matricula.bolsaFamilia)}</div></div>
                <div class="field g-col-3"><div class="label">NIS</div><div class="value">${renderField(matricula.nis)}</div></div>
                <div class="field g-col-6"><div class="label">Nº DO CARTÃO DO SUS</div><div class="value">${renderField(matricula.cartaoSus)}</div></div>
                <div class="field g-col-3"><div class="label">PCD?</div><div class="value">${renderRadio(matricula.pcd)}</div></div>
                <div class="field g-col-9"><div class="label">QUAL A DEFICIÊNCIA?</div><div class="value">${renderField(matricula.pcdDetalhes)}</div></div>

                <div class="sub-legend g-col-12">FILIAÇÃO</div>
                <div class="field g-col-8"><div class="label">2.25 NOME DO PAI</div><div class="value">${renderField(matricula.nomePai)}</div></div>
                <div class="field g-col-4"><div class="label">VIVO?</div><div class="value">${renderRadio(matricula.paiVivo)}</div></div>
                <div class="field g-col-8"><div class="label">2.26 NOME DA MÃE</div><div class="value">${renderField(matricula.nomeMae)}</div></div>
                <div class="field g-col-4"><div class="label">VIVA?</div><div class="value">${renderRadio(matricula.maeViva)}</div></div>
            </div>
        </div>
        
        <div class="fieldset">
            <legend class="legend">3. DADOS DE IDENTIFICAÇÃO DO RESPONSÁVEL</legend>
            <div class="grid" style="grid-template-columns: repeat(12, 1fr);">
                <div class="field g-col-8"><div class="label">3.1 NOME DO RESPONSÁVEL</div><div class="value">${renderField(matricula.nomeResponsavel)}</div></div>
                <div class="field g-col-4"><div class="label">3.7 GRAU DE PARENTESCO</div><div class="value">${renderField(matricula.grauParentesco)}</div></div>
                <div class="field g-col-12"><div class="label">3.3 ENDEREÇO (AV, RUA, Nº, BAIRRO)</div><div class="value">${renderField(matricula.enderecoResponsavel)}</div></div>
                <div class="field g-col-7"><div class="label">3.4 MUNICÍPIO</div><div class="value">${renderField(matricula.municipioResponsavel)}</div></div>
                <div class="field g-col-2"><div class="label">3.5 UF</div><div class="value">${renderField(matricula.ufResponsavel)}</div></div>
                <div class="field g-col-3"><div class="label">3.6 TELEFONE</div><div class="value">${renderField(matricula.telefoneResponsavel)}</div></div>
            </div>
        </div>

        <div style="display: flex; gap: 4px;">
            <div class="fieldset" style="flex: 1;">
                <legend class="legend">7. ATIVIDADES EXTRACLASSES</legend>
                <div class="grid" style="grid-template-columns: 1fr;">
                    <div class="field g-col-1"><div class="label">ESPORTE</div><div class="value">${renderField(matricula.esporte)}</div></div>
                    <div class="field g-col-1"><div class="label">CULTURA</div><div class="value">${renderField(matricula.cultura)}</div></div>
                    <div class="field g-col-1"><div class="label">ARTE</div><div class="value">${renderField(matricula.arte)}</div></div>
                    <div class="field g-col-1"><div class="label">OUTRAS</div><div class="value">${renderField(matricula.outrasAtividades)}</div></div>
                </div>
            </div>

            <div class="fieldset" style="flex: 1;">
                <legend class="legend">8. DADOS DE TRANSPORTE ESCOLAR</legend>
                <div class="grid" style="grid-template-columns: 1fr;">
                    <div class="field"><div class="label">8.1 REGIÃO ONDE RESIDE</div><div class="value">${renderField(matricula.regiaoOndeReside)}</div></div>
                    <div class="field"><div class="label">8.2 UTILIZA TRANSPORTE ESCOLAR?</div><div class="value">${renderRadio(matricula.utilizaTransporteEscolar)}</div></div>
                    <div class="field"><div class="label">8.3 PODE UTILIZAR A BICICLETA EM SUBSTITUIÇÃO?</div><div class="value">${renderRadio(matricula.podeUsarBicicleta)}</div></div>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-around; padding: 10px 0;">
             <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Ass. do Educando ou Responsável</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Ass. do Funcionário/Matrícula</div>
            </div>
        </div>
    </body>
    </html>
    `;
    }

    private getBrasaoBase64(): string {
        try {
            // Usar o caminho correto para o brasão
            const brasaoPath = path.join(process.cwd(), 'src', 'renderer', 'images', 'brasao.png');

            console.log('Tentando carregar o brasão de:', brasaoPath);

            if (!fs.existsSync(brasaoPath)) {
                console.error(`O arquivo não existe no caminho: ${brasaoPath}`);
                return this.getDefaultBrasaoBase64();
            }

            const imageBuffer = fs.readFileSync(brasaoPath);
            return imageBuffer.toString('base64');
        } catch (error) {
            console.error('Erro ao carregar o brasão:', error);
        }
    }
}
