import { Candidato} from "../../types/candidato";


export function initFormInscricao(root: HTMLElement) {
    // --- Seletores de Elementos ---
    const form = root.querySelector<HTMLFormElement>('#formCadastro')!;
    const btnLimpar = root.querySelector<HTMLButtonElement>('#btnLimparForm')!;
    // --- Funções de Controle da Interface (Adaptadas do main.js) ---

    function toggleCamposMilitar() {
        const pmilitarSim = root.querySelector<HTMLInputElement>('#pmilitarSim');
        const frameMilitar = root.querySelector<HTMLElement>('#frameMilitar')!;
        const frameTurmaPmilitar = root.querySelector<HTMLElement>('#frameTurmaPmilitar')!;
        const frameTurmaAmpla = root.querySelector<HTMLElement>('#frameTurmaAmpla')!;
        const radiosTurmaPmilitar = frameTurmaPmilitar.querySelectorAll<HTMLInputElement>('input[name="turma"]');
        const radiosTurmaAmpla = frameTurmaAmpla.querySelectorAll<HTMLInputElement>('input[name="turma"]');

        if (pmilitarSim?.checked) {
            frameMilitar.style.display = 'grid'; // 'grid' para manter o layout dos campos
            frameTurmaPmilitar.style.display = 'block';
            frameTurmaAmpla.style.display = 'none';
            // Habilita e exige escolha apenas nas turmas PMPB
            radiosTurmaPmilitar.forEach(r => { r.disabled = false; r.required = true; });
            radiosTurmaAmpla.forEach(r => { r.disabled = true; r.required = false; r.checked = false; });
        } else {
            frameMilitar.style.display = 'none';
            frameTurmaPmilitar.style.display = 'none';
            frameTurmaAmpla.style.display = 'block';
            // Habilita e exige escolha apenas nas turmas Ampla
            radiosTurmaPmilitar.forEach(r => { r.disabled = true; r.required = false; r.checked = false; });
            radiosTurmaAmpla.forEach(r => { r.disabled = false; r.required = true; });
        }
    }

    function toggleCamposPcd() {
        const pcdSim = root.querySelector<HTMLInputElement>('#pcdSim');
        const deficienciaContainer = root.querySelector<HTMLElement>('#deficienciaContainer')!;
        if (pcdSim?.checked) {
            deficienciaContainer.style.display = 'block';
            deficienciaContainer.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')
                .forEach(el => { el.disabled = false; });
        } else {
            deficienciaContainer.style.display = 'none';
            // Ao ocultar, limpa e desabilita para não bloquear validação
            deficienciaContainer.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')
                .forEach(el => {
                    if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
                        el.checked = false;
                    } else {
                        el.value = '';
                    }
                    el.disabled = true;
                });
        }
    }

    async function carregarTurmasDisponiveis() {
        try {
            // @ts-ignore - A API é exposta globalmente pelo preload
            const turmas = await window.api.getTurmasDisponiveis();

            const popularTurmas = (containerId: string, listaTurmas: string[]) => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = '';
                    listaTurmas.forEach((turma, index) => {
                        const id = `${containerId.replace('Options', '')}_${index}`;
                        container.innerHTML += `
                            <div class="flex items-center">
                                <input class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" type="radio" name="turma" 
                                    id="${id}" value="${turma}" required>
                                <label class="ml-2 block text-sm text-gray-900" for="${id}">
                                    ${turma}
                                </label>
                            </div>
                        `;
                    });
                }
            };

            popularTurmas('turmaAmplaOptions', turmas);
            popularTurmas('turmaPmilitarOptions', turmas);
            // Ajusta required/disabled conforme a seleção atual (após popular os radios)
            toggleCamposMilitar();

        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
            alert('Não foi possível carregar a lista de turmas.');
        }
    }

    function initMasks() {
        const cpfInputs = root.querySelectorAll('.cpf-mask');
        cpfInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target || target.type !== 'text') return;
                let value = target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                target.value = value;
            });
            input.setAttribute('maxlength', '14');
        });

        const phoneInputs = root.querySelectorAll('.phone-mask');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target || target.type !== 'text') return;
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
    }

    function initDatepicker() {
        const dateInputs = root.querySelectorAll('.datepicker');
        dateInputs.forEach(input => {
            input.setAttribute('maxlength', '10'); // Limite para DD/MM/AAAA
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target || target.type !== 'text') return;
                let value = target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, '$1/$2');
                value = value.replace(/(\d{2})(\d)/, '$1/$2');
                target.value = value;
            });

            input.addEventListener('blur', (e) => {
                const target = e.target as HTMLInputElement | null;
                if (!target) return;
                const value = target.value;
                if (value && !isValidDate(value)) {
                    target.setCustomValidity('Data inválida');
                } else {
                    target.setCustomValidity('');
                }
            });
        });
    }

    // Preenche o formulário de inscrição com dados de teste e expõe no console
    function fillFormInscricaoForTesting() {
        const log = (...args: any[]) => console.log('[Teste-Inscricao]', ...args);
        const setInputValue = (name: string, value: string) => {
            const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${name}"]`);
            if (el) {
                (el as any).value = value;
            } else {
                log('Campo não encontrado:', name);
            }
        };
        const setChecked = (name: string, value: string) => {
            const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
            if (el) {
                el.checked = true;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                log('Opção não encontrada:', name, value);
            }
        };
        const setCheckbox = (name: string, checked = true) => {
            const el = form.querySelector<HTMLInputElement>(`input[type="checkbox"][name="${name}"]`);
            if (el) el.checked = checked;
        };

        log('Preenchendo campos básicos...');
        setInputValue('nome', 'Candidato de Teste');
        setInputValue('cpfCandidato', '123.456.789-00');
        setInputValue('dataNascimento', '15/05/2012');
        setInputValue('nomeMae', 'Mãe Exemplo');
        setInputValue('cpfMae', '111.222.333-44');
        setInputValue('nomePai', 'Pai Exemplo');
        setInputValue('cpfPai', '222.333.444-55');
        setInputValue('responsavelLegal', 'Responsável Exemplo');
        setInputValue('cpfResponsavel', '333.444.555-66');
        setInputValue('telefone1', '(83) 98888-0000');
        setInputValue('telefone2', '(83) 97777-1111');
        setInputValue('telefone3', '(83) 93333-2222');

        log('Ajustando PCD e detalhes...');
        setChecked('pcd', 'sim'); // exibe container
        setCheckbox('defFisica', true);
        setCheckbox('defTEA', true);
        setInputValue('defOutro', 'Observação de teste');

        log('Configurando vínculo PM (Ampla Concorrência)...');
        setChecked('pmilitar', 'Não'); // mostra frameTurmaAmpla

        // Garante estados de habilitação corretos imediatamente
        try { toggleCamposMilitar(); } catch {}

        // Garante que turmas estejam carregadas e seleciona a primeira disponível
        const selecionarPrimeiraTurma = (tentativa = 0) => {
            // Reaplica toggle a cada tentativa para manter estados consistentes
            try { toggleCamposMilitar(); } catch {}
            const radioDisponivel = form.querySelector<HTMLInputElement>('section#frameTurmaAmpla input[name="turma"]:not([disabled])')
                || form.querySelector<HTMLInputElement>('input[name="turma"]:not([disabled])');
            if (radioDisponivel) {
                radioDisponivel.checked = true;
                // Dispara eventos para qualquer listener
                radioDisponivel.dispatchEvent(new Event('input', { bubbles: true }));
                radioDisponivel.dispatchEvent(new Event('change', { bubbles: true }));
                log('Turma selecionada:', radioDisponivel.value);
                return;
            }
            if (tentativa < 50) {
                // Na primeira tentativa força recarregar as turmas
                if (tentativa === 0) { try { (carregarTurmasDisponiveis as any)(); } catch {} }
                setTimeout(() => selecionarPrimeiraTurma(tentativa + 1), 120);
            } else {
                log('Não foi possível selecionar uma turma automaticamente.');
            }
        };
        selecionarPrimeiraTurma();

        log('Documentação de exemplo...');
        setCheckbox('docDeclaracaoEscola', true);
        setCheckbox('docIdentidadeResponsavel', true);
        setCheckbox('docCertidaoNascimento', true);

        log('✅ Formulário de inscrição preenchido para teste.');
    }

    root.querySelectorAll('input[name="pmilitar"]').forEach(radio =>
        radio.addEventListener('change', toggleCamposMilitar)
    );
    root.querySelectorAll('input[name="pcd"]').forEach(radio =>
        radio.addEventListener('change', toggleCamposPcd)
    );

    btnLimpar.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            form.reset();
            // Reabilita quaisquer campos que possam ter sido desabilitados
            form.querySelectorAll<HTMLElement>('[disabled]')
                .forEach(el => el.removeAttribute('disabled'));
            toggleCamposMilitar();
            toggleCamposPcd();
        }
    });

    const btnGerarPdf = root.querySelector<HTMLButtonElement>('#btnGerarPdf')!;
    btnGerarPdf.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios (*).');
            return;
        }

        const formData = new FormData(form);
        const candidato = initCandidato();

        formData.forEach((value, key) => {
            candidato.setProp(key, value.toString());
        });

        // Garantir que checkboxes desmarcados sejam registrados como false
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const checkbox = cb as HTMLInputElement;
            candidato.setProp(checkbox.name, checkbox.checked);
        });

        // Obter valores específicos
        const pcdInput = root.querySelector<HTMLInputElement>('input[name="pcd"]:checked');
        candidato.possuiDeficiencia = pcdInput?.value === 'sim';

        const pmilitarInput = root.querySelector<HTMLInputElement>('input[name="pmilitar"]:checked');
        candidato.filhoNetoPM = pmilitarInput?.value === 'Sim';

        // Obter turma selecionada
        const turmaSelecionada = form.querySelector('input[name="turma"]:checked') as HTMLInputElement;
        if (!turmaSelecionada) {
            alert('Por favor, selecione uma turma.');
            return;
        }
        candidato.turma = turmaSelecionada.value;
        candidato.isAmpla = !candidato.filhoNetoPM;

        // Validações
        if (!candidato.nome?.trim()) {
            alert('Por favor, informe o nome do candidato.');
            return;
        }
        if (!candidato.dataNascimento) {
            alert('Por favor, informe a data de nascimento do candidato.');
            return;
        }
        if (!candidato.responsavelLegal?.trim()) {
            alert('Por favor, informe o nome do responsável legal.');
            return;
        }
        if (!candidato.cpfResponsavel?.trim()) {
            alert('Por favor, informe o CPF do responsável legal.');
            return;
        }

        const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dataRegex.test(candidato.dataNascimento)) {
            alert('A data de nascimento deve estar no formato DD/MM/AAAA.');
            return;
        }

        if (candidato.filhoNetoPM) {
            if (!candidato.nomePM?.trim()) {
                alert('Por favor, informe o nome do parente militar.');
                return;
            }
            if (!candidato.matriculaPM?.trim()) {
                alert('Por favor, informe a matrícula do parente militar.');
                return;
            }
        }

        console.log('Dados do candidato para geração do PDF:', candidato);

        try {
            const resultado = await window.api.gerarPdfInscricao(candidato);
            if (resultado) {
                alert('PDF gerado com sucesso!');
            } else {
                alert('Operação cancelada pelo usuário.');
            }
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert(`Erro ao gerar PDF: ${(error as Error).message}`);
        }
    });

    const btnImprimirFicha = root.querySelector<HTMLButtonElement>('#btnImprimirFicha')!;
    btnImprimirFicha.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios (*).');
            return;
        }

        const formData = new FormData(form);
        const candidato = initCandidato();

        formData.forEach((value, key) => {
            candidato.setProp(key, value.toString());
        });

        // Garantir que checkboxes desmarcados sejam registrados como false
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const checkbox = cb as HTMLInputElement;
            candidato.setProp(checkbox.name, checkbox.checked);
        });

        // Obter valores específicos
        const pcdInput = root.querySelector<HTMLInputElement>('input[name="pcd"]:checked');
        candidato.possuiDeficiencia = pcdInput?.value === 'sim';

        const pmilitarInput = root.querySelector<HTMLInputElement>('input[name="pmilitar"]:checked');
        candidato.filhoNetoPM = pmilitarInput?.value === 'Sim';

        // Obter turma selecionada
        const turmaSelecionada = form.querySelector('input[name="turma"]:checked') as HTMLInputElement;
        if (!turmaSelecionada) {
            alert('Por favor, selecione uma turma.');
            return;
        }
        candidato.turma = turmaSelecionada.value;
        candidato.isAmpla = !candidato.filhoNetoPM;

        // Validações
        if (!candidato.nome?.trim()) {
            alert('Por favor, informe o nome do candidato.');
            return;
        }
        if (!candidato.dataNascimento) {
            alert('Por favor, informe a data de nascimento do candidato.');
            return;
        }
        if (!candidato.responsavelLegal?.trim()) {
            alert('Por favor, informe o nome do responsável legal.');
            return;
        }
        if (!candidato.cpfResponsavel?.trim()) {
            alert('Por favor, informe o CPF do responsável legal.');
            return;
        }

        const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dataRegex.test(candidato.dataNascimento)) {
            alert('A data de nascimento deve estar no formato DD/MM/AAAA.');
            return;
        }

        if (candidato.filhoNetoPM) {
            if (!candidato.nomePM?.trim()) {
                alert('Por favor, informe o nome do parente militar.');
                return;
            }
            if (!candidato.matriculaPM?.trim()) {
                alert('Por favor, informe a matrícula do parente militar.');
                return;
            }
        }

        console.log('Dados do candidato para geração do Html:', candidato);

        try {
            const resultado = await window.api.gerarHtmlInscricao(candidato);
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (printWindow) {
                printWindow.document.write(resultado);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.addEventListener('afterprint', () => {
                    printWindow.close();
                });

                printWindow.print();
            }
        } catch (error) {
            console.error('Erro ao imprimir ficha:', error);
            // @ts-ignore
            alert('Erro ao imprimir ficha: ' + error.message);
        }
    });

    function initCandidato(): Candidato {
        return new Candidato();
    }

    function isValidDate(dateString: string) {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(regex);

        if (!match) return false;

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        const date = new Date(year, month - 1, day);

        return date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            year >= 1900 &&
            year <= new Date().getFullYear() + 10;
    }

    // --- Inicialização ---
    setTimeout(() => {
        initMasks();
        carregarTurmasDisponiveis();
        initDatepicker();
        }, 100
    )
    // Chama as funções de toggle para definir o estado inicial correto do formulário
    toggleCamposMilitar();
    toggleCamposPcd();

    // Expor no console para testes: window.preencherFormularioInscricao()
    (window as any).preencherFormularioInscricao = fillFormInscricaoForTesting;
}
