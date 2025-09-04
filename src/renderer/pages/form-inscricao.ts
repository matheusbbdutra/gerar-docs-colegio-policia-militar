export function initFormInscricao(root: HTMLElement) {
    // Elementos do formulário
    const form = root.querySelector<HTMLFormElement>('#formCadastro')!;
    const btnVoltar = root.querySelector<HTMLButtonElement>('#btnVoltarLista')!;
    const btnLimpar = root.querySelector<HTMLButtonElement>('#btnLimparForm')!;
    const btnSalvar = root.querySelector<HTMLButtonElement>('#btnSalvarCadastro')!;

    // Campos PCD
    const pcdRadios = root.querySelectorAll<HTMLInputElement>('input[name="pcd"]');
    const deficienciaContainer = root.querySelector<HTMLElement>('#deficienciaContainer')!;

    // Campos PM
    const pmRadios = root.querySelectorAll<HTMLInputElement>('input[name="pmilitar"]');
    const frameMilitar = root.querySelector<HTMLElement>('#frameMilitar')!;
    const frameTurmaPmilitar = root.querySelector<HTMLElement>('#frameTurmaPmilitar')!;
    const frameTurmaAmpla = root.querySelector<HTMLElement>('#frameTurmaAmpla')!;

    // Inicializar máscaras
    initMasks();

    // Gerenciar seção de deficiência
    pcdRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'sim') {
                deficienciaContainer.style.display = 'block';
            } else {
                deficienciaContainer.style.display = 'none';
                limparCamposDeficiencia();
            }
        });
    });

    // Gerenciar seção de vínculo militar
    pmRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Sim') {
                frameMilitar.style.display = 'block';
                frameTurmaPmilitar.style.display = 'block';
                frameTurmaAmpla.style.display = 'none';

                // Tornar campos obrigatórios
                document.getElementById('nomePM')!.setAttribute('required', 'required');
                document.getElementById('matriculaPM')!.setAttribute('required', 'required');
            } else {
                frameMilitar.style.display = 'none';
                frameTurmaPmilitar.style.display = 'none';
                frameTurmaAmpla.style.display = 'block';

                // Remover obrigatoriedade
                document.getElementById('nomePM')!.removeAttribute('required');
                document.getElementById('matriculaPM')!.removeAttribute('required');

                // Limpar campos
                (document.getElementById('nomePM') as HTMLInputElement).value = '';
                (document.getElementById('matriculaPM') as HTMLInputElement).value = '';
            }
        });
    });

    // Carregar turmas disponíveis (simulação)
    carregarTurmasDisponiveis();

    // Evento para limpar formulário
    btnLimpar.addEventListener('click', () => {
        form.reset();
        deficienciaContainer.style.display = 'none';
        frameMilitar.style.display = 'none';
        frameTurmaPmilitar.style.display = 'none';
        frameTurmaAmpla.style.display = 'block';
    });

    // Evento para voltar à lista
    btnVoltar.addEventListener('click', () => {
        // Navegar de volta para a página de lista
        window.location.href = './lista-candidatos.html';
    });

    // Validação e envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Coletar dados do formulário
        const formData = new FormData(form);
        const dadosCandidato = Object.fromEntries(formData.entries());

        // Salvar dados (simulação)
        console.log('Dados do candidato:', dadosCandidato);

        // Exibir mensagem de sucesso
        alert('Cadastro realizado com sucesso!');

        // Limpar formulário após o envio
        form.reset();
        form.classList.remove('was-validated');
    });

    // Funções auxiliares
    function limparCamposDeficiencia() {
        const checkboxes = deficienciaContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => (cb as HTMLInputElement).checked = false);

        const outroInput = document.getElementById('outroDeficiencia') as HTMLInputElement;
        if (outroInput) outroInput.value = '';
    }

    function initMasks() {
        // Implementação das máscaras (CPF, telefone, data)
        const cpfInputs = document.querySelectorAll('.cpf-mask');
        cpfInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = (e.target as HTMLInputElement).value;
                value = value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, "$1.$2");
                value = value.replace(/(\d{3})(\d)/, "$1.$2");
                value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                (e.target as HTMLInputElement).value = value;
            });
        });

        const phoneInputs = document.querySelectorAll('.phone-mask');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = (e.target as HTMLInputElement).value;
                value = value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                value = value.replace(/(\d)(\d{4})$/, "$1-$2");
                (e.target as HTMLInputElement).value = value;
            });
        });

        const dateInputs = document.querySelectorAll('.datepicker');
        dateInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = (e.target as HTMLInputElement).value;
                value = value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, "$1/$2");
                value = value.replace(/(\d{2})(\d)/, "$1/$2");
                (e.target as HTMLInputElement).value = value;
            });
        });
    }

    function carregarTurmasDisponiveis() {
        // Simular turmas disponíveis - em produção, isso viria de uma API
        const turmasAmpla = [
            { id: 1, nome: "1º Ano - Manhã" },
            { id: 2, nome: "2º Ano - Tarde" },
            { id: 3, nome: "3º Ano - Integral" }
        ];

        const turmasPM = [
            { id: 4, nome: "1º Ano (PM) - Manhã" },
            { id: 5, nome: "2º Ano (PM) - Tarde" }
        ];

        // Popular turmas ampla concorrência
        const turmaAmplaContainer = document.getElementById('turmaAmplaOptions');
        if (turmaAmplaContainer) {
            turmaAmplaContainer.innerHTML = '';
            turmasAmpla.forEach(turma => {
                turmaAmplaContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="turma" 
                                id="turma${turma.id}" value="${turma.id}" required>
                            <label class="form-check-label" for="turma${turma.id}">
                                ${turma.nome}
                            </label>
                        </div>
                    </div>
                `;
            });
        }

        // Popular turmas cota PM
        const turmaPMContainer = document.getElementById('turmaPmilitarOptions');
        if (turmaPMContainer) {
            turmaPMContainer.innerHTML = '';
            turmasPM.forEach(turma => {
                turmaPMContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="turma" 
                                id="turma${turma.id}" value="${turma.id}" required>
                            <label class="form-check-label" for="turma${turma.id}">
                                ${turma.nome}
                            </label>
                        </div>
                    </div>
                `;
            });
        }
    }
}
