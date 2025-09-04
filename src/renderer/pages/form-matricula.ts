import { Matricula } from "../../types/matricula"; // Ajuste o caminho para sua classe Matricula

export function initFormMatricula(root: HTMLElement) {
    // --- Seletores de Elementos ---
    const form = root.querySelector<HTMLFormElement>('#student-form')!;
    const clearBtn = root.querySelector<HTMLButtonElement>('#clear-btn')!;
    const printPreviewBtn = root.querySelector<HTMLButtonElement>('#print-preview-btn')!;
    const generatePdfBtn = root.querySelector<HTMLButtonElement>('#generate-pdf-btn')!;

    const courseSelector = root.querySelector<HTMLSelectElement>('#course-selector')!;
    const courseTitle = root.querySelector<HTMLElement>('#course-title')!;
    const pcdRadios = root.querySelectorAll<HTMLInputElement>('input[name="pcd"]');
    const pcdDetailsContainer = root.querySelector<HTMLElement>('#pcd-details-container')!;
    const pcdDetails = root.querySelector<HTMLInputElement>('#pcd-details')!;

    function initMatricula(): Matricula {
        return new Matricula();
    }

    function gatherMatriculaData(): Matricula {
        const matricula = initMatricula();
        const formData = new FormData(form);

        formData.forEach((value, key) => {
            matricula.setProp(key, value.toString());
        });

        const getRadioValue = (name: string): string => {
            const checkedRadio = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
            return checkedRadio ? checkedRadio.value : '';
        };

        matricula.bolsaFamilia = getRadioValue('bolsaFamilia') === 'sim';
        matricula.pcd = getRadioValue('pcd') === 'sim';
        matricula.paiVivo = getRadioValue('paiVivo') === 'sim';
        matricula.maeViva = getRadioValue('maeViva') === 'sim';
        matricula.utilizaTransporteEscolar = getRadioValue('utilizaTransporteEscolar') === 'sim';
        matricula.podeUsarBicicleta = getRadioValue('podeUsarBicicleta') === 'sim';

        const regiao = getRadioValue('regiaoOndeReside');
        if (regiao === 'rural' || regiao === 'urbana') {
            matricula.regiaoOndeReside = regiao === 'rural' ? 'Rural' : 'Urbana';
        }

        matricula.tituloCurso = courseSelector.value;

        const dateInput = form.querySelector<HTMLInputElement>('input[name="dataNascimento"]');
        if (dateInput && dateInput.value) {
            const [year, month, day] = dateInput.value.split('-');
            matricula.dataNascimento = `${day}/${month}/${year}`;
        }

        return matricula;
    }

    function fillFormForTesting() {
        console.log("🚀 Preenchendo formulário com dados de teste...");

        const setInputValue = (name: string, value: string) => {
            const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${name}"]`);
            if (el) el.value = value;
        };

        const setRadioValue = (name: string, value: string) => {
            const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
            if (el) el.checked = true;
        };

        const dummyData = {
            registroMatricula: "2024-0001", nomeEducando: "Aluno de Teste da Silva", inep: "123456789012", periodo: "Manhã", ano: "8º Ano", nivelEnsino: "Fundamental II",
            raca: "Parda", dataNascimento: "2010-05-15", estadoCivil: "Solteiro(a)", naturalidade: "João Pessoa", ufNatural: "PB",
            cpf: "111.222.333-44", nis: "98765432100", cartaoSus: "700123456789012",
            registroNascimentoCartorio: "Cartório Exemplo", registroNascimentoLivro: "Livro A-01", registroNascimentoFolha: "Folha 25",
            rg: "5.432.109 SSP/PB", nomePai: "Pai de Teste Souza", cpfPai: "222.333.444-55", rgPai: "1.234.567 SSP/PB",
            nomeMae: "Mãe de Teste da Silva", cpfMae: "333.444.555-66", rgMae: "7.654.321 SSP/PB",
            enderecoEducando: "Rua do Educando, 456, Centro",
            municipioEducando: "João Pessoa",
            ufEducando: "PB",
            telefoneEducando: "(83) 98888-0000",
            pontoReferenciaEducando: "Próximo à praça central",
            nomeResponsavel: "Mãe de Teste da Silva", grauParentesco: "Mãe", enderecoResponsavel: "Rua dos Testes, 123, Bairro Fictício",
            pontoReferenciaResponsavel: "Ao lado da padaria",
            municipioResponsavel: "João Pessoa", ufResponsavel: "PB", telefoneResponsavel: "(83) 99999-8888",
            procedenciaUnidadeEnsino: "Escola Anterior", procedenciaPeriodo: "Tarde", procedenciaAno: "7º Ano", procedenciaNivelEnsino: "Fundamental I",
            procedenciaEndereco: "Rua da Escola, 100", procedenciaPontoReferencia: "Em frente ao ginásio",
            procedenciaMunicipio: "Outra Cidade", procedenciaUF: "PB", procedenciaTelefone: "(83) 98888-7777",
            educacaoFisica: "Apto para atividades físicas.",
            esporte: "Futebol", cultura: "Leitura", arte: "Desenho", observacoes: "Este é um preenchimento automático para fins de teste.",
            pcdDetalhes: 'Nenhuma, apenas para teste da funcionalidade.', sexo: 'M',
            tituloCurso: 'Ensino Fundamental 2',
            tituloEleitor: '123456789012',
            carteiraTrabalho: '1234567890',
            reservista: 'N/A',
        };

        Object.entries(dummyData).forEach(([key, value]) => setInputValue(key, value));

        setRadioValue('bolsaFamilia', 'sim');
        setRadioValue('pcd', 'sim');
        setRadioValue('paiVivo', 'sim');
        setRadioValue('maeViva', 'sim');
        setRadioValue('regiaoOndeReside', 'urbana');
        setRadioValue('utilizaTransporteEscolar', 'nao');
        setRadioValue('podeUsarBicicleta', 'sim');

        courseSelector.dispatchEvent(new Event('change', { bubbles: true }));
        form.querySelector<HTMLInputElement>('input[name="pcd"][value="sim"]')?.dispatchEvent(new Event('change', { bubbles: true }));

        console.log("✅ Formulário preenchido!");
    }

    courseSelector.addEventListener('change', (ev) => {
        courseTitle.textContent = (ev.target as HTMLSelectElement).value;
    });

    pcdRadios.forEach(radio => {
        radio.addEventListener('change', (ev) => {
            if ((ev.target as HTMLInputElement).value === 'sim') {
                pcdDetailsContainer.classList.remove('hidden');
            } else {
                pcdDetailsContainer.classList.add('hidden');
                pcdDetails.value = '';
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            form.reset();
            courseTitle.textContent = '';
            pcdDetailsContainer.classList.add('hidden');
        }
    });

    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const matricula = gatherMatriculaData();
        if (!matricula.nomeEducando.trim()) {
            alert('Por favor, informe o nome do educando.');
            return;
        }
        try {
            await window.api.gerarPdfMatricula(matricula);
        } catch (error) {
            console.error("Erro ao gerar PDF da matrícula:", error);
            alert(`Erro ao gerar PDF: ${(error as Error).message}`);
        }
    });

    printPreviewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const matricula = gatherMatriculaData();
        if (!matricula.nomeEducando.trim()) {
            alert('Por favor, informe o nome do educando.');
            return;
        }
        try {
            const htmlContent = await window.api.gerarHtmlMatricula(matricula);
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => printWindow.print(), 500);
                printWindow.addEventListener('afterprint', () => printWindow.close());
            }
        } catch (error) {
            console.error('Erro ao gerar HTML para impressão:', error);
            alert('Erro ao preparar ficha para impressão: ' + (error as Error).message);
        }
    });

    const pcdSim = root.querySelector<HTMLInputElement>('input[name="pcd"][value="sim"]');
    if (!pcdSim?.checked) {
        pcdDetailsContainer.classList.add('hidden');
    }

    (window as any).preencherFormulario = fillFormForTesting;
}
