import { initFormMatricula } from "./pages/form-matricula";
import "./index.css";
import { initFormInscricao } from "./pages/form-inscricao";
import formMatriculaHtml from './pages/form-matricula.html?raw';
import homeHtml from './pages/home.html?raw';
import formInscricaoHtml from './pages/form-inscricao.html?raw';
// Garante CSS + fontes dos ícones no bundle
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import de assets para funcionar no build (Vite reescreve URLs)
import logoUrl from './images/CPM-319x445.png';
import brasaoUrl from './images/brasao.png';

const main = document.getElementById("main-content")!;
const links = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

function setActiveNav(key?: string) {
    document.querySelectorAll(".nav-link").forEach(x => x.classList.remove("active","bg-gray-900/50"));
    if (!key) return;
    const target = Array.from(links).find(a => a.dataset.form === key);
    target?.classList.add("active","bg-gray-900/50");
}

async function loadHome() {
    // Substitui caminho relativo por URL processada pelo Vite
    main.innerHTML = homeHtml.replace('../images/CPM-319x445.png', logoUrl);
}


async function loadFormMatricula() {
    // Garante que o brasão apareça no build
    main.innerHTML = formMatriculaHtml.replace('../images/brasao.png', brasaoUrl);
    initFormMatricula(main);
    // Rola ao topo e foca o primeiro campo para interagir imediatamente
    try {
        const scrollEl = document.scrollingElement || document.documentElement;
        if (scrollEl && 'scrollTo' in scrollEl) {
            (scrollEl as any).scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    } catch { window.scrollTo(0, 0); }
    (main as HTMLElement).scrollTop = 0;
    requestAnimationFrame(() => {
        const wAny = window as any;
        const skip = !!wAny.__skipFocusOnce;
        if (skip) {
            try { delete wAny.__skipFocusOnce; } catch {}
            return;
        }
        const first = main.querySelector<HTMLInputElement>('#student-form #nome-educando');
        try { first?.focus(); } catch {}
    });
}

async function loadInscricao() {
    main.innerHTML = formInscricaoHtml;
    initFormInscricao(main);
    // Rola ao topo e foca o primeiro campo para interagir imediatamente
    try {
        const scrollEl = document.scrollingElement || document.documentElement;
        if (scrollEl && 'scrollTo' in scrollEl) {
            (scrollEl as any).scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    } catch { window.scrollTo(0, 0); }
    (main as HTMLElement).scrollTop = 0;
    requestAnimationFrame(() => {
        const first = main.querySelector<HTMLInputElement>('#formCadastro #nome');
        try { first?.focus(); } catch {}
    });
}


links.forEach(a => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
        const form = a.dataset.form;
        setActiveNav(form);
        // Persistir página ativa para sobrevivência de reloads
        if (form) localStorage.setItem('activePage', form);
        else localStorage.removeItem('activePage');

        if (form === "form-matricula") loadFormMatricula();
        else if (form === "form-inscricao") loadInscricao();
        else loadHome();
    });
});
//
// Carrega sempre a Home ao iniciar (não persistir última página)
try { localStorage.removeItem('activePage'); } catch {}
setActiveNav('home');
loadHome();

// Expor carregadores para permitir "reload" suave dos formulários
(window as any).reloadFormMatricula = loadFormMatricula;
(window as any).reloadFormInscricao = loadInscricao;

// Toggle sidebar (mobile)
const btn = document.getElementById("btn-toggle-sidebar");
const sidebar = document.getElementById("sidebar");
btn?.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    sidebar?.classList.toggle("-translate-x-full");
});
