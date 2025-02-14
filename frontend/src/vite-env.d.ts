/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGTO_ENDPOINT: string
  readonly VITE_LOGTO_APP_ID: string
  readonly VITE_API_RESOURCE: string

  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}