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

        if (pmilitarSim?.checked) {
            frameMilitar.style.display = 'grid'; // 'grid' para manter o layout dos campos
            frameTurmaPmilitar.style.display = 'block';
            frameTurmaAmpla.style.display = 'none';
        } else {
            frameMilitar.style.display = 'none';
            frameTurmaPmilitar.style.display = 'none';
            frameTurmaAmpla.style.display = 'block';
        }
    }

    function toggleCamposPcd() {
        const pcdSim = root.querySelector<HTMLInputElement>('#pcdSim');
        const deficienciaContainer = root.querySelector<HTMLElement>('#deficienciaContainer')!;
        if (pcdSim?.checked) {
            deficienciaContainer.style.display = 'block';
        } else {
            deficienciaContainer.style.display = 'none';
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

    root.querySelectorAll('input[name="pmilitar"]').forEach(radio =>
        radio.addEventListener('change', toggleCamposMilitar)
    );
    root.querySelectorAll('input[name="pcd"]').forEach(radio =>
        radio.addEventListener('change', toggleCamposPcd)
    );

    btnLimpar.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            form.reset();
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
}
