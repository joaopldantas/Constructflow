import { uid } from '../support/api'
import { expect, test } from '../support/fixtures'

test.describe('Usuários', () => {
  test('cadastra um usuário', async ({ adminPage: page }) => {
    const nome = `Fernanda ${uid()}`
    const email = `fernanda.${uid()}@constructflow.dev`

    await page.goto('/usuarios')
    await page.getByRole('button', { name: 'Novo usuário' }).click()

    const dialog = page.getByRole('dialog', { name: 'Novo usuário' })
    await dialog.getByLabel('Nome').fill(nome)
    await dialog.getByLabel('Email').fill(email)
    await dialog.getByLabel('Senha inicial').fill('senha123')
    await dialog.getByLabel('Papel').selectOption({ label: 'Backoffice' })
    await dialog.getByRole('button', { name: 'Cadastrar usuário' }).click()

    await expect(page.getByText('Usuário cadastrado.')).toBeVisible()
    const linha = page.getByRole('row', { name: new RegExp(email) })
    await expect(linha).toContainText(nome)
    await expect(linha).toContainText('Backoffice')
  })

  test('valida os campos antes de enviar', async ({ adminPage: page }) => {
    await page.goto('/usuarios')
    await page.getByRole('button', { name: 'Novo usuário' }).click()

    const dialog = page.getByRole('dialog', { name: 'Novo usuário' })
    await dialog.getByLabel('Email').fill('email-invalido')
    await dialog.getByLabel('Senha inicial').fill('123')
    await dialog.getByRole('button', { name: 'Cadastrar usuário' }).click()

    await expect(dialog.getByText('Informe o nome.')).toBeVisible()
    await expect(dialog.getByText('Informe um email válido.')).toBeVisible()
    await expect(dialog.getByText('A senha precisa ter ao menos 6 caracteres.')).toBeVisible()
  })

  test('mostra o erro da API para email duplicado', async ({ adminPage: page, api }) => {
    const existente = await api.criarUsuario('CAMPO')

    await page.goto('/usuarios')
    await page.getByRole('button', { name: 'Novo usuário' }).click()

    const dialog = page.getByRole('dialog', { name: 'Novo usuário' })
    await dialog.getByLabel('Nome').fill('Duplicado')
    await dialog.getByLabel('Email').fill(existente.email)
    await dialog.getByLabel('Senha inicial').fill('senha123')
    await dialog.getByRole('button', { name: 'Cadastrar usuário' }).click()

    await expect(dialog.getByRole('alert')).toHaveText('Email já cadastrado!')
  })

  test('altera o papel e exclui um usuário', async ({ adminPage: page, api }) => {
    const usuario = await api.criarUsuario('CAMPO')

    await page.goto('/usuarios')
    await page.getByPlaceholder('Buscar por nome ou email').fill(usuario.email)
    const linha = page.getByRole('row', { name: new RegExp(usuario.email) })

    await linha.getByRole('button', { name: `Editar ${usuario.nome}` }).click()
    const dialog = page.getByRole('dialog', { name: 'Editar usuário' })
    await dialog.getByLabel('Papel').selectOption({ label: 'Engenheiro' })
    await dialog.getByRole('button', { name: 'Salvar alterações' }).click()
    await expect(linha).toContainText('Engenheiro')

    await linha.getByRole('button', { name: `Excluir ${usuario.nome}` }).click()
    await page.getByRole('dialog', { name: 'Excluir usuário' }).getByRole('button', { name: 'Excluir' }).click()

    await expect(page.getByText('Usuário excluído.')).toBeVisible()
    await expect(linha).toBeHidden()
  })

  test('não permite excluir o próprio usuário', async ({ adminPage: page }) => {
    await page.goto('/usuarios')
    const propria = page.getByRole('row', { name: /\(você\)/ })

    await expect(propria.getByRole('button', { name: /^Excluir/ })).toBeDisabled()
  })
})
