import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !!process.env.VITE_DEV_SERVER_URL;
let win: BrowserWindow | null = null;

async function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    if (isDev) {
        await win.loadURL(process.env.VITE_DEV_SERVER_URL!);
        win.webContents.openDevTools();
    } else {
        await win.loadFile(path.join(__dirname, "renderer", "index.html"));
    }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// IPC: versão
ipcMain.handle("app:getVersion", () => app.getVersion());

// IPC: imprimir/gerar PDF (nativo do Electron)
ipcMain.handle("print-current-page", async () => {
    if (!win) return;

    // Modo 1: diálogo de impressão nativo:
    await win.webContents.print({ silent: false });

    // Modo 2: gerar PDF silencioso (salvar arquivo):
    // const pdf = await win.webContents.printToPDF({ pageSize: "A4", printBackground: true });
    // const { filePath } = await dialog.showSaveDialog(win, {
    //   title: "Salvar PDF",
    //   defaultPath: "ficha.pdf",
    //   filters: [{ name: "PDF", extensions: ["pdf"] }]
    // });
    // if (filePath) fs.writeFileSync(filePath, pdf);
});
