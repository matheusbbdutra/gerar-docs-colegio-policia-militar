// @ts-ignore - import raw
import formMatriculaHtml from "./pages/form-matricula.html?raw";
import formInscricaoHtml from "./pages/form-inscricao.html?raw";
import { initFormMatricula } from "./pages/form-matricula";
import "./index.css";
import {initFormInscricao} from "./pages/form-inscricao";

const main = document.getElementById("main-content")!;
const links = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

function loadFormMatricula( ) {
    main.innerHTML = formMatriculaHtml;
    initFormMatricula(main);
}

function loadInscricao() {
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
        // futuros forms: else if (form === "outro-form") { ... }
    });
});

// Carrega default
loadFormMatricula();

// Toggle sidebar (mobile)
const btn = document.getElementById("btn-toggle-sidebar");
const sidebar = document.getElementById("sidebar");
btn?.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    sidebar?.classList.toggle("-translate-x-full");
});
