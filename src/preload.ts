import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
    printCurrentPage: () => ipcRenderer.invoke("print-current-page"),
    getVersion: () => ipcRenderer.invoke("app:getVersion"),
});

declare global {
    interface Window {
        api: {
            printCurrentPage: () => Promise<void>;
            getVersion: () => Promise<string>;
        }
    }
}
