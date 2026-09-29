/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Google Apps Script web app that receives each SessionResult. Unset means results stay on this device.
  readonly VITE_RESULTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
