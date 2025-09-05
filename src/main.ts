import { app, BrowserWindow, ipcMain, dialog, shell, globalShortcut } from "electron";
import path from "node:path";
import * as fs from 'fs-extra';
import {FormInscricaoGerarPDFService} from "./services/formInscricaoGerarPDFService";
import {Candidato} from "./types/candidato";
import {Matricula} from "./types/matricula";
import {FormMatriculaGerarPDFService} from "./services/formMatriculaGerarPDFService";

// __dirname é fornecido automaticamente em módulos CJS, não precisa redefinir.
const isDev = !!process.env.VITE_DEV_SERVER_URL;
let win: BrowserWindow | null = null;
let dataDir = path.join(app.getPath('userData'), 'gerar-docs');
let formInscricaoGerarPDF: FormInscricaoGerarPDFService = new FormInscricaoGerarPDFService(dataDir);
let formMatriculaGerarPDF: FormMatriculaGerarPDFService = new FormMatriculaGerarPDFService(dataDir);

// Permite forçar idioma do Chromium/DevTools (ex.: en-US) se necessário
const DEVTOOLS_LANG = process.env.DEVTOOLS_LANG;
if (DEVTOOLS_LANG) {
    try { app.commandLine.appendSwitch('lang', DEVTOOLS_LANG); } catch {}
}

// Compatibilidade gráfica: força renderização por software para evitar DevTools “tela preta”
try { app.disableHardwareAcceleration(); } catch {}
try { app.commandLine.appendSwitch('disable-gpu'); } catch {}
try { app.commandLine.appendSwitch('disable-gpu-compositing'); } catch {}
try { app.commandLine.appendSwitch('use-gl', 'swiftshader'); } catch {}
try { app.commandLine.appendSwitch('use-angle', 'swiftshader'); } catch {}
// Em Linux/Wayland alguns ambientes precisam do X11 para DevTools
if (process.platform === 'linux' && (process.env.XDG_SESSION_TYPE || '').toLowerCase() === 'wayland') {
    try { app.commandLine.appendSwitch('ozone-platform', 'x11'); } catch {}
}

function toggleDevToolsDetached(target?: BrowserWindow | null) {
    const w = target ?? BrowserWindow.getFocusedWindow();
    if (!w) return;
    const wc = w.webContents;
    if (wc.isDevToolsOpened()) wc.closeDevTools();
    else wc.openDevTools({ mode: 'detach' });
}

async function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        }
    });
    await fs.ensureDir(dataDir);
    await fs.ensureDir(path.join(dataDir, 'fichas'));

    // Registra todos os handlers IPC ANTES de carregar a URL
    setupIpcHandlers();
    win.setMenuBarVisibility(false);

    if (isDev) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL!);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "renderer", "index.html"));
    }
}

function setupIpcHandlers() {
    // Handler: versão do app
    ipcMain.handle("app:getVersion", () => app.getVersion());

    // Handler para obter turmas disponíveis
    ipcMain.handle('get-turmas-disponiveis', () => {
        console.log('IPC: get-turmas-disponiveis foi chamado no main.ts');
        return [
            "6º ano", "6º ano PCD", "7º ano", "7º ano PCD", "8º ano", "8º ano PCD", "9º ano", "9º ano PCD",
            "1º ano - EM - Informática para internet", "1º ano - EM - Informática para internet - PCD",
            "1º ano - EM - programação de jogos digitais", "1º ano - EM - programação de jogos digitais - PCD",
            "2º ano - EM - Informática para internet", "2º ano - EM - Informática para internet - PCD",
            "2º ano - EM - programação de jogos digitais", "2º ano - EM - programação de jogos digitais - PCD",
            "3º ano - EM - Informática para internet", "3º ano - EM - Informática para internet - PCD",
            "3º ano - EM - programação de jogos digitais", "3º ano - EM - programação de jogos digitais - PCD"
        ];
    });

    ipcMain.handle('gerar-pdf-form-inscricao', async (_, candidato: Candidato) => {
        try {
            if (!candidato) throw new Error('Candidato não encontrado');
            const caminhoArquivo = await formInscricaoGerarPDF.gerarPDFFicha(candidato);

            const result = await dialog.showSaveDialog(win!, {
                title: 'Salvar Ficha PDF',
                defaultPath: `ficha_${candidato.nome.replace(/\s+/g, '_')}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] }
                ]
            }) as any;

            if (!result.canceled && result.filePath) {
                await fs.copy(caminhoArquivo, result.filePath);

                const openResult = await dialog.showMessageBox(win!, {
                    type: 'question',
                    buttons: ['Sim', 'Não'],
                    defaultId: 0,
                    message: 'PDF gerado com sucesso!',
                    detail: 'Deseja abrir o arquivo agora?'
                }) as any;

                if (openResult.response === 0) {
                    shell.openPath(result.filePath);
                }

                return result.filePath;
            }

            return null;
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            throw error;
        }
    });

    ipcMain.handle('print-form-inscricao', async (_, candidato: Candidato) => {
        return formInscricaoGerarPDF.gerarHTMLFicha(candidato);
    });

    ipcMain.handle('print-form-matricula', async (_, matricula: Matricula) => {
        return formMatriculaGerarPDF.gerarHTMLFicha(matricula);
    })

    ipcMain.handle('gerar-pdf-form-matricula', async (_, matricula: Matricula) => {
        try {
            if (!matricula) throw new Error('matricula não encontrada');
            const caminhoArquivo = await formMatriculaGerarPDF.gerarPDFFicha(matricula);

            const result = await dialog.showSaveDialog(win!, {
                title: 'Salvar Ficha PDF',
                defaultPath: `Matricula_${matricula.nomeEducando.replace(/\s+/g, '_')}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] }
                ]
            }) as any;

            if (!result.canceled && result.filePath) {
                await fs.copy(caminhoArquivo, result.filePath);

                const openResult = await dialog.showMessageBox(win!, {
                    type: 'question',
                    buttons: ['Sim', 'Não'],
                    defaultId: 0,
                    message: 'PDF gerado com sucesso!',
                    detail: 'Deseja abrir o arquivo agora?'
                }) as any;

                if (openResult.response === 0) {
                    shell.openPath(result.filePath);
                }

                return result.filePath;
            }

            return null;
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            throw error;
        }
    });

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Libera atalhos globais na saída do app
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
