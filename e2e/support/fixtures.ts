import { test as base, expect, type Page } from '@playwright/test'
import { ADMIN, ApiClient, obterToken, type Credenciais } from './api'

const TOKEN_KEY = 'constructflow.token'

/** Autentica a página injetando o JWT, sem passar pela tela de login. */
export async function autenticar(page: Page, credenciais: Credenciais) {
  const token = await obterToken(credenciais)
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [TOKEN_KEY, token] as const,
  )
}

interface Fixtures {
  /** Cliente da API autenticado como ADMIN para preparar dados. */
  api: ApiClient
  /** Página já autenticada como ADMIN. */
  adminPage: Page
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const api = await ApiClient.comoAdmin()
    await use(api)
    await api.dispose()
  },
  adminPage: async ({ page }, use) => {
    await autenticar(page, ADMIN)
    await use(page)
  },
})

export { expect }
