import { Matricula } from "../../types/matricula"; // Ajuste o caminho para sua classe Matricula
import { confirmModal, alertModal } from "../ui/modal";

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
        matricula.disponivelAosSabados = getRadioValue('disponivelAosSabados') === 'sim';
        matricula.sairParaAlmocar = getRadioValue('sairParaAlmocar') === 'sim';

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
            esporte: "Futebol", observacoes: "Este é um preenchimento automático para fins de teste.",
            pcdDetalhes: 'Nenhuma, apenas para teste da funcionalidade.', sexo: 'M',
            tituloCurso: 'Ensino Fundamental 2',
            responsavelPelaTransferencia: 'Funcionário Fulano',
            responsavelPedagogico: 'Prof. Beltrano',
        };

        Object.entries(dummyData).forEach(([key, value]) => setInputValue(key, value));

        setRadioValue('bolsaFamilia', 'sim');
        setRadioValue('pcd', 'sim');
        setRadioValue('paiVivo', 'sim');
        setRadioValue('maeViva', 'sim');
        setRadioValue('regiaoOndeReside', 'urbana');
        setRadioValue('utilizaTransporteEscolar', 'nao');
        setRadioValue('podeUsarBicicleta', 'sim');
        setRadioValue('disponivelAosSabados', 'sim');
        setRadioValue('sairParaAlmocar', 'nao');

        courseSelector.dispatchEvent(new Event('change', { bubbles: true }));
        form.querySelector<HTMLInputElement>('input[name="pcd"][value="sim"]')?.dispatchEvent(new Event('change', { bubbles: true }));

        console.log("✅ Formulário preenchido!");
    }

    // Máscaras e validações de entrada específicas do formulário de matrícula
    function initMasks() {
        // CPF: educando, pai, mãe
        const cpfSelectors = ['[name="cpf"]', '[name="cpfPai"]', '[name="cpfMae"]'];
        const cpfInputs = root.querySelectorAll<HTMLInputElement>(cpfSelectors.join(','));
        cpfInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target) return;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                target.value = value;
            });
            input.setAttribute('maxlength', '14');
        });

        // Telefones: educando, responsável, procedência
        const phoneInputs = root.querySelectorAll<HTMLInputElement>('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target) return;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                } else {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                target.value = value;
            });
            input.setAttribute('maxlength', '15');
        });

        // INEP: apenas números (12 dígitos)
        const inep = root.querySelector<HTMLInputElement>('[name="inep"]');
        if (inep) {
            inep.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 12) value = value.substring(0, 12);
                target.value = value;
            });
            inep.setAttribute('maxlength', '12');
        }

        // NIS: apenas números (11 dígitos)
        const nis = root.querySelector<HTMLInputElement>('[name="nis"]');
        if (nis) {
            nis.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                target.value = value;
            });
            nis.setAttribute('maxlength', '11');
        }

        // Cartão SUS: apenas números (15 dígitos)
        const sus = root.querySelector<HTMLInputElement>('[name="cartaoSus"]');
        if (sus) {
            sus.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 15) value = value.substring(0, 15);
                target.value = value;
            });
            sus.setAttribute('maxlength', '15');
        }

        // RG, RG Pai, RG Mãe: manter maiúsculas (sem máscara rígida)
        const rgInputs = root.querySelectorAll<HTMLInputElement>('[name="rg"], [name="rgPai"], [name="rgMae"]');
        rgInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.toUpperCase();
            });
        });

        // UF: manter 2 letras maiúsculas
        const ufInputs = root.querySelectorAll<HTMLInputElement>([
            '[name="ufNatural"]',
            '[name="ufEducando"]',
            '[name="ufResponsavel"]',
            '[name="procedenciaUF"]',
        ].join(','));
        ufInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                let value = target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                if (value.length > 2) value = value.substring(0, 2);
                target.value = value;
            });
            input.setAttribute('maxlength', '2');
            input.style.textTransform = 'uppercase';
        });
    }

    // Helpers: converter para romanos e maiúsculas
    const toRoman = (n: number) => {
        const map: [number, string][] = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
        ];
        let out = '';
        for (const [val, sym] of map) {
            while (n >= val) { out += sym; n -= val; }
        }
        return out || '';
    };
    const formatTitle = (s: string) => {
        if (!s) return '';
        let u = s.toUpperCase();
        u = u.replace(/\b([0-9]{1,2})\b/g, (m, d) => {
            const num = parseInt(d, 10);
            if (num >= 1 && num <= 20) return toRoman(num);
            return m;
        });
        return u;
    };

    // Atualiza título visível com formatação
    courseSelector.addEventListener('change', (ev) => {
        const val = (ev.target as HTMLSelectElement).value;
        courseTitle.textContent = formatTitle(val);
    });

    // No carregamento: formata rótulos das opções para exibir em romano e maiúsculo
    Array.from(courseSelector.options).forEach((opt, idx) => {
        if (idx === 0) return; // mantém placeholder
        opt.textContent = formatTitle(opt.textContent || opt.value);
    });
    // E já sincroniza o título com o valor inicial
    if (courseSelector.value) {
        courseTitle.textContent = formatTitle(courseSelector.value);
    }

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

    clearBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const ok = await confirmModal('Tem certeza que deseja limpar todos os campos?', {
            title: 'Limpar formulário',
            confirmText: 'Limpar',
            cancelText: 'Cancelar',
            danger: true,
        });
        if (!ok) return;

        // Soft reset: sem recarregar a tela para evitar ghost click
        try {
            (clearBtn as HTMLButtonElement).disabled = true;
            setTimeout(() => { try { (clearBtn as HTMLButtonElement).disabled = false; } catch {} }, 300);
        } catch {}

        // Garante que o primeiro clique após limpar foque o alvo corretamente
        const firstClickFocusHandler = (ev: MouseEvent) => {
            const t = ev.target as Element | null;
            const input = t ? (t.closest('input, textarea, select') as HTMLElement | null) : null;
            if (input) { setTimeout(() => { try { (input as any).focus?.(); } catch {} }, 0); }
            document.removeEventListener('mousedown', firstClickFocusHandler, true);
            document.removeEventListener('click', firstClickFocusHandler, true);
        };
        document.addEventListener('mousedown', firstClickFocusHandler, true);
        document.addEventListener('click', firstClickFocusHandler, true);

        // Reseta o formulário (fallback)
        form.reset();

        // Reativa e limpa todos os campos editáveis
        const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'));
        fields.forEach(el => {
            // remove atributos de desabilitado caso existam
            el.removeAttribute('disabled');
            el.removeAttribute('aria-disabled');

            // se algum campo de entrada estiver readonly (ex.: por algum fluxo anterior), reabilita apenas os que possuem name
            if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.hasAttribute('readonly')) {
                if (el.getAttribute('name')) {
                    el.removeAttribute('readonly');
                    (el as HTMLInputElement | HTMLTextAreaElement).readOnly = false;
                }
            }

            if (el instanceof HTMLInputElement) {
                el.disabled = false;
                if (el.type === 'radio' || el.type === 'checkbox') {
                    el.checked = false;
                } else if (!el.readOnly) {
                    el.value = '';
                }
            } else if (el instanceof HTMLTextAreaElement) {
                el.disabled = false;
                if (!el.readOnly) el.value = '';
            } else if (el instanceof HTMLSelectElement) {
                el.disabled = false;
                el.selectedIndex = 0;
            }
        });

        // Atualiza estados de UI dependentes
        courseSelector.value = '';
        courseTitle.textContent = '';
        pcdDetailsContainer.classList.add('hidden');
        pcdDetails.value = '';

        // Rola para o topo (instantâneo para não bloquear a digitação)
        try {
            const scrollEl = document.scrollingElement || document.documentElement;
            if (scrollEl && 'scrollTo' in scrollEl) {
                (scrollEl as any).scrollTo(0, 0);
            } else {
                window.scrollTo(0, 0);
            }
        } catch {
            window.scrollTo(0, 0);
        }
        // Garante o container atual no topo
        (root as HTMLElement).scrollTop = 0;

        // Remove foco do botão para não interferir em cliques/teclas imediatos
        try { (clearBtn as HTMLButtonElement).blur(); } catch {}
        // não forçar blur do activeElement para não interferir no primeiro clique

        // Como salvaguarda, remove qualquer "disabled" residual em containers (ex.: fieldset)
        form.querySelectorAll<HTMLElement>('[disabled]')
            .forEach(el => el.removeAttribute('disabled'));

        // Remove qualquer bloqueio de ponteiro residual (ex.: classes utilitárias ou estilos inline)
        form.querySelectorAll<HTMLElement>('*').forEach(el => {
            try {
                if (el.classList?.contains('pointer-events-none')) {
                    el.classList.remove('pointer-events-none');
                }
                const style = (el as HTMLElement).style as CSSStyleDeclaration | undefined;
                if (style && style.pointerEvents === 'none') {
                    style.pointerEvents = '';
                }
            } catch {}
        });

        // Não forçar foco automático; respeitar o próximo clique do usuário
    });

    generatePdfBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const matricula = gatherMatriculaData();
        if (!matricula.nomeEducando.trim()) {
            await alertModal('Por favor, informe o nome do educando.', { title: 'Dados incompletos' });
            return;
        }
        try {
            await window.api.gerarPdfMatricula(matricula);
        } catch (error) {
            console.error("Erro ao gerar PDF da matrícula:", error);
            await alertModal(`Erro ao gerar PDF: ${(error as Error).message}`, { title: 'Erro' });
        }
    });

    printPreviewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const matricula = gatherMatriculaData();
        if (!matricula.nomeEducando.trim()) {
            await alertModal('Por favor, informe o nome do educando.', { title: 'Dados incompletos' });
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
            await alertModal('Erro ao preparar ficha para impressão: ' + (error as Error).message, { title: 'Erro' });
        }
    });

    const pcdSim = root.querySelector<HTMLInputElement>('input[name="pcd"][value="sim"]');
    if (!pcdSim?.checked) {
        pcdDetailsContainer.classList.add('hidden');
    }

    // Inicializa máscaras
    initMasks();

    (window as any).preencherFormulario = fillFormForTesting;

    // Atalho: Ctrl+Alt+1 para preencher dados de teste (somente quando esta tela está ativa)
    const matriculaShortcut = (ev: KeyboardEvent) => {
        if (!ev.ctrlKey || !ev.altKey) return;
        const is1 = ev.key === '1' || ev.code === 'Digit1';
        if (!is1) return;
        ev.preventDefault();
        try { fillFormForTesting(); } catch (e) { console.error('Erro no atalho de teste (Matrícula):', e); }
    };
    const wAny = window as any;
    if (wAny.__matriculaShortcutHandler) {
        document.removeEventListener('keydown', wAny.__matriculaShortcutHandler);
    }
    document.addEventListener('keydown', matriculaShortcut);
    wAny.__matriculaShortcutHandler = matriculaShortcut;

    // Se ativado pelo fluxo de limpeza, garante que o primeiro clique após reload foque corretamente o alvo
    try {
        if ((window as any).__armFirstClickFocusFix) {
            delete (window as any).__armFirstClickFocusFix;
            const detach = () => {
                document.removeEventListener('mousedown', handler, true);
                document.removeEventListener('click', handler, true);
            };
            const handler = (ev: MouseEvent) => {
                const t = ev.target as Element | null;
                const input = t ? (t.closest('input, textarea, select') as HTMLElement | null) : null;
                if (input) {
                    setTimeout(() => { try { (input as any).focus?.(); } catch {} }, 0);
                    detach();
                } else {
                    // Clicou fora; desarma mesmo assim para não interferir
                    detach();
                }
            };
            document.addEventListener('mousedown', handler, true);
            document.addEventListener('click', handler, true);
        }
    } catch {}
}
