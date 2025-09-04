# Gerar Docs – Colégio da Polícia Militar

Aplicativo desktop (Electron + Vite + TypeScript + Tailwind) para preencher formulários de Matrícula/Inscrição e gerar fichas em HTML/PDF.

Projeto criado de forma voluntária para ajudar o Colégio da Polícia Militar. Não houve pagamento/remuneração pelo desenvolvimento.

**Principais recursos**
- **Formulários:** Matrícula e Inscrição com validações básicas.
- **Geração de arquivos:** HTML e PDF via processos no `main`.
- **Empacotamento:** Builds para Windows (ZIP/NSIS) com `electron-builder`.
- **UI moderna:** Vite + Tailwind CSS v4 + Bootstrap Icons.

**Stack**
- **Electron 38**, **Vite 7**, **TypeScript**, **Tailwind v4**, **tsup**.

## Pré‑requisitos
- **Node.js 18+** (recomendado 20+)
- **npm** 8+
- Para gerar instalador NSIS do Windows em Linux/macOS, é necessário **Wine**. Para gerar ZIP, Wine não é obrigatório.

## Instalação
- Instalação limpa recomendada:
  - `rm -rf node_modules package-lock.json && npm ci`
  - Alternativa: `npm install`

## Scripts
- **Dev:** `npm run dev`
  - Sobe Vite, compila `main/preload` com `tsup` e abre o Electron em modo dev.
- **Build:** `npm run build`
  - Limpa `dist/`, compila `main/preload` (tsup) e o renderer (Vite).
- **Distribuição:**
  - `npm run dist` → empacota conforme config do `electron-builder`.
  - `npm run win` → instala deps limpas, build e gera artefato Windows ZIP.
- **Start local:** `npm start` (usa `dist/` já gerado).

## Empacotamento (Windows)
- Gera app em `release/`. Para ZIP especificamente:
  - `npm run build`
  - `npx electron-builder --win zip`
- Ícone do executável:
  - Configurado em `package.json`.
  - Requisitos do `.ico`: deve possuir tamanho **≥ 256×256** (ideal multi‑tamanhos 16, 32, 48, 64, 128, 256).

Arquivos de configuração
- `package.json:build`
- `vite.config.ts`
- `tsup.config.ts`

## Estrutura
- `src/main.ts`
- `src/preload.ts`
- `src/renderer/index.html`
- `src/renderer/renderer.ts`
- `src/renderer/index.css`
- `src/renderer/pages/home.html`
- `src/renderer/pages/form-matricula.html`
- `src/renderer/pages/form-inscricao.html`
- `src/renderer/images/`

Saída de build: `dist/` (bundles de main/preload e renderer)

## IPC exposto ao Renderer
`src/preload.ts`
- `window.api.getVersion()`
- `window.api.getTurmasDisponiveis()`
- `window.api.gerarHtmlInscricao(candidato)` / `window.api.gerarPdfInscricao(candidato)`
- `window.api.gerarHtmlMatricula(matricula)` / `window.api.gerarPdfMatricula(matricula)`

Os PDFs e HTMLs são produzidos no processo principal por `FormInscricaoGerarPDFService` e `FormMatriculaGerarPDFService`. Os dados temporários usam:
- `app.getPath('userData')/gerar-docs/`
- Subpasta `fichas/` criada automaticamente

## Assets, imagens e fontes
- As páginas HTML do renderer são importadas como texto com `?raw` (sem `fetch`) para funcionar em produção com `file://`.
- Caminhos de imagem nos templates são reescritos em runtime com URLs processadas pelo Vite:
  - `src/renderer/renderer.ts` importa `./images/CPM-319x445.png` e `./images/brasao.png` e substitui os caminhos nos templates.
- Ícones (Bootstrap Icons):
  - Importados em `src/renderer/renderer.ts`: `import 'bootstrap-icons/font/bootstrap-icons.css'` para incluir `.woff2/.woff` no build.
- Fonte “Inter”:
  - Atualmente via Google Fonts em `src/renderer/index.css`.
  - Alternativa offline: `@fontsource/inter` (substituir o import remoto por CSS local).

## Desenvolvimento
- Dev usa `http://localhost:5173` (Vite) e abre o Electron com `VITE_DEV_SERVER_URL`.
- Produção carrega `dist/renderer/index.html` via `file://`.
- Para debugar produção, habilite DevTools temporariamente no `main` com `win.webContents.openDevTools()`.

## Observações
- As páginas do renderer são importadas como texto com `?raw` para funcionarem com `file://` em produção.
- Caminhos de imagem nos templates são reescritos em runtime com URLs processadas pelo Vite.
- Bootstrap Icons é importado no `renderer.ts` para garantir cópia das fontes no build.

## Build passo a passo (sugestão)
1. `npm ci`
2. `npm run build`
3. Teste com `npm start`
4. Empacote:
   - Windows ZIP: `npx electron-builder --win zip`
   - NSIS (requer Wine fora do Windows): `npx electron-builder --win nsis`

## Customização
- App ID, targets e saída: `package.json:build`
- Portas/paths do Vite: `vite.config.ts`
- Alvo de compilação Node/Electron: `tsup.config.ts`

## Licença
ISC
