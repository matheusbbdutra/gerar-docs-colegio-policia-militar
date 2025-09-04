import { contextBridge, ipcRenderer } from "electron";
import {Candidato} from "./types/candidato";

contextBridge.exposeInMainWorld("api", {
    printCurrentPage: () => ipcRenderer.invoke("print-current-page"),
    getVersion: () => ipcRenderer.invoke("app:getVersion"),

    // Funções novas para o formulário de inscrição
    getTurmasDisponiveis: () => ipcRenderer.invoke('get-turmas-disponiveis'),
    gerarPdfInscricao: (candidato: Candidato) => ipcRenderer.invoke('gerar-pdf-form-inscricao', candidato),
    gerarHtmlInscricao: (candidato: Candidato) => ipcRenderer.invoke('print-form-inscricao', candidato),
    gerarPdfMatricula: (matricula: any) => ipcRenderer.invoke('gerar-pdf-form-matricula', matricula),
    gerarHtmlMatricula: (matricula: any) => ipcRenderer.invoke('print-form-matricula', matricula),
});

// Adicione a tipagem para o TypeScript não reclamar
declare global {
    interface Window {
        api: {
            printCurrentPage: () => Promise<void>;
            getVersion: () => Promise<string>;
            getTurmasDisponiveis: () => Promise<string[]>;
            gerarPdfInscricao: (candidato: Candidato) => Promise<string | null>;
            gerarHtmlInscricao: (candidato: Candidato) => Promise<string>;
            gerarPdfMatricula: (matricula: any) => Promise<string | null>;
            gerarHtmlMatricula: (matricula: any) => Promise<string>;
        }
    }
}
