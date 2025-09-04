// @ts-ignore - import raw
import fichaHtml from "./pages/ficha-aluno.html?raw";
import { initFichaAluno } from "./pages/ficha-aluno";
import "./index.css";

const main = document.getElementById("main-content")!;
const links = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

function loadFicha() {
    main.innerHTML = fichaHtml;
    initFichaAluno(main);
}

links.forEach(a => {
    a.addEventListener("click", (e) => {
        e.preventDefault();
        const form = a.dataset.form;
        document.querySelectorAll(".nav-link").forEach(x => x.classList.remove("active","bg-gray-900/50"));
        a.classList.add("active","bg-gray-900/50");

        if (form === "ficha-aluno") loadFicha();
        // futuros forms: else if (form === "outro-form") { ... }
    });
});

// Carrega default
loadFicha();

// Toggle sidebar (mobile)
const btn = document.getElementById("btn-toggle-sidebar");
const sidebar = document.getElementById("sidebar");
btn?.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    sidebar?.classList.toggle("-translate-x-full");
});
