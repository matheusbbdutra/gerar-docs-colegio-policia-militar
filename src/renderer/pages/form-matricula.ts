export function initFormMatricula(root: HTMLElement) {
    const form = root.querySelector<HTMLFormElement>('#student-form')!;
    const clearBtn = root.querySelector<HTMLButtonElement>('#clear-btn')!;
    const printBtn = root.querySelector<HTMLButtonElement>('#print-btn')!;
    const courseSelector = root.querySelector<HTMLSelectElement>('#course-selector')!;
    const courseTitle = root.querySelector<HTMLElement>('#course-title')!;
    const pcdRadios = root.querySelectorAll<HTMLInputElement>('input[name="pcd"]');
    const pcdDetailsContainer = root.querySelector<HTMLElement>('#pcd-details-container')!;
    const pcdDetails = root.querySelector<HTMLInputElement>('#pcd-details')!;

    // Título dinâmico
    courseSelector.addEventListener('change', (ev) => {
        const val = (ev.target as HTMLSelectElement).value;
        courseTitle.textContent = val;
    });

    // Campo condicional de PCD
    pcdRadios.forEach(radio => {
        radio.addEventListener('change', (ev) => {
            const v = (ev.target as HTMLInputElement).value;
            if (v === 'sim') pcdDetailsContainer.classList.remove('hidden');
            else {
                pcdDetailsContainer.classList.add('hidden');
                pcdDetails.value = '';
            }
        });
    });

    // Limpar
    clearBtn.addEventListener('click', () => {
        form.reset();
        courseTitle.textContent = '';
        pcdDetailsContainer.classList.add('hidden');
    });

    // Imprimir (usa Electron)
    printBtn.addEventListener('click', async () => {
        // Abre diálogo de impressão do sistema (renderer)
        window.print();

        // OU: impressão/PDF nativa do Electron:
        // await window.api.printCurrentPage(); // expomos no preload (ver seção 8)
    });
}
