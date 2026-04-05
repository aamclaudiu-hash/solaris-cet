/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIT_COMMIT_HASH: string
  readonly VITE_BUILD_TIMESTAMP: string
  readonly VITE_PUBLIC_SITE_URL?: string
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
