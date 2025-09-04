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

async function loadHome() {
    // Substitui caminho relativo por URL processada pelo Vite
    main.innerHTML = homeHtml.replace('../images/CPM-319x445.png', logoUrl);
}


async function loadFormMatricula() {
    // Garante que o brasão apareça no build
    main.innerHTML = formMatriculaHtml.replace('../images/brasao.png', brasaoUrl);
    initFormMatricula(main);
}

async function loadInscricao() {
    main.innerHTML = formInscricaoHtml;
    initFormInscricao(main);
}


links.forEach(a => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
        const form = a.dataset.form;
        document.querySelectorAll(".nav-link").forEach(x => x.classList.remove("active","bg-gray-900/50"));
        a.classList.add("active","bg-gray-900/50");

        if (form === "form-matricula") loadFormMatricula();
        else if (form === "form-inscricao") loadInscricao();
        else loadHome();
    });
});
//
// // Carrega default
loadHome();

// Toggle sidebar (mobile)
const btn = document.getElementById("btn-toggle-sidebar");
const sidebar = document.getElementById("sidebar");
btn?.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    sidebar?.classList.toggle("-translate-x-full");
});
