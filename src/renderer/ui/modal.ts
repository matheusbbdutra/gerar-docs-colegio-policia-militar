export type ConfirmOptions = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export type AlertOptions = {
  title?: string;
  okText?: string;
};

function buildOverlay(): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
  overlay.setAttribute('role', 'presentation');
  return overlay;
}

function buildPanel(title?: string): { panel: HTMLDivElement; titleEl: HTMLHeadingElement; contentEl: HTMLDivElement; footerEl: HTMLDivElement } {
  const panel = document.createElement('div');
  panel.className = 'bg-white rounded-xl shadow-xl max-w-md w-[92%] sm:w-[420px] p-4';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  const titleEl = document.createElement('h3');
  titleEl.className = 'text-lg font-semibold text-gray-900 mb-2';
  titleEl.textContent = title || '';

  const contentEl = document.createElement('div');
  contentEl.className = 'text-gray-700 mb-4';

  const footerEl = document.createElement('div');
  footerEl.className = 'flex justify-end gap-2';

  if (title) panel.appendChild(titleEl);
  panel.appendChild(contentEl);
  panel.appendChild(footerEl);

  return { panel, titleEl, contentEl, footerEl };
}

function restoreFocus(prev: Element | null | undefined) {
  try {
    if (prev && (prev as HTMLElement).focus) (prev as HTMLElement).focus();
  } catch {}
}

export function alertModal(message: string, opts: AlertOptions = {}): Promise<void> {
  return new Promise<void>((resolve) => {
    const prev = document.activeElement;
    const overlay = buildOverlay();
    const { panel, titleEl, contentEl, footerEl } = buildPanel(opts.title || 'Aviso');

    const p = document.createElement('p');
    p.textContent = message;
    contentEl.appendChild(p);

    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium';
    okBtn.textContent = opts.okText || 'OK';

    footerEl.appendChild(okBtn);

    const cleanup = () => {
      try { document.removeEventListener('keydown', onKey, true); } catch {}
      overlay.remove();
      restoreFocus(prev);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') { ev.preventDefault(); okBtn.click(); }
      if (ev.key === 'Enter') { ev.preventDefault(); okBtn.click(); }
    };

    okBtn.addEventListener('click', () => { cleanup(); resolve(); });
    document.addEventListener('keydown', onKey, true);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { okBtn.click(); }
    });

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    setTimeout(() => { try { okBtn.focus(); } catch {} }, 0);
  });
}

export function confirmModal(message: string, opts: ConfirmOptions = {}): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const prev = document.activeElement;
    const overlay = buildOverlay();
    const { panel, titleEl, contentEl, footerEl } = buildPanel(opts.title || 'Confirmação');

    const p = document.createElement('p');
    p.textContent = message;
    contentEl.appendChild(p);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-md font-medium';
    cancelBtn.textContent = opts.cancelText || 'Cancelar';

    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = (opts.danger
      ? 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium'
      : 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium');
    okBtn.textContent = opts.confirmText || 'Confirmar';

    footerEl.appendChild(cancelBtn);
    footerEl.appendChild(okBtn);

    const cleanup = () => {
      try { document.removeEventListener('keydown', onKey, true); } catch {}
      overlay.remove();
      restoreFocus(prev);
    };
    const resolveTrue = () => { cleanup(); resolve(true); };
    const resolveFalse = () => { cleanup(); resolve(false); };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') { ev.preventDefault(); resolveFalse(); }
      if (ev.key === 'Enter') { ev.preventDefault(); resolveTrue(); }
    };

    okBtn.addEventListener('click', resolveTrue);
    cancelBtn.addEventListener('click', resolveFalse);
    document.addEventListener('keydown', onKey, true);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { resolveFalse(); }
    });

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    setTimeout(() => { try { okBtn.focus(); } catch {} }, 0);
  });
}

