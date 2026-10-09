import { ADMIN } from '../support/api'
import { expect, test } from '../support/fixtures'

test.describe('Autenticação', () => {
  test('redireciona para o login quando não autenticado', async ({ page }) => {
    await page.goto('/obras')

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  })

  test('exige email e senha', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toHaveText('Informe email e senha.')
  })

  test('mostra erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(ADMIN.email)
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toContainText('Email ou senha inválidos')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('faz login, mantém a sessão ao recarregar e sai @mobile', async ({ page, isMobile }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(ADMIN.email)
    await page.getByLabel('Senha').fill(ADMIN.senha)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Olá')

    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Olá')

    if (isMobile) await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.getByRole('button', { name: 'Sair' }).click()

    await expect(page).toHaveURL(/\/login$/)
  })

  test('leva de volta à página pedida depois do login', async ({ page }) => {
    await page.goto('/documentos')
    await expect(page).toHaveURL(/\/login$/)

    await page.getByLabel('Email').fill(ADMIN.email)
    await page.getByLabel('Senha').fill(ADMIN.senha)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/documentos$/)
  })
})
