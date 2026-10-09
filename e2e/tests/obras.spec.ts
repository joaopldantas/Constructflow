import { uid } from '../support/api'
import { expect, test } from '../support/fixtures'

test.describe('Obras', () => {
  test('cadastra uma obra com máscara de CEP', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const nome = `Residencial ${uid()}`

    await page.goto('/obras')
    await page.getByRole('button', { name: 'Nova obra' }).first().click()

    const dialog = page.getByRole('dialog', { name: 'Nova obra' })
    await dialog.getByLabel('Nome').fill(nome)
    await dialog.getByLabel('Endereço').fill('Av. Brasil, 500 - Campinas/SP')
    await dialog.getByLabel('CEP').fill('13010000')
    await expect(dialog.getByLabel('CEP')).toHaveValue('13010-000')
    await dialog.getByLabel('Engenheiro responsável').selectOption({ label: `${engenheiro.nome} · ${engenheiro.email}` })
    await dialog.getByRole('button', { name: 'Cadastrar obra' }).click()

    await expect(page.getByText('Obra cadastrada.')).toBeVisible()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('link', { name: new RegExp(nome) })).toBeVisible()
  })

  test('valida os campos obrigatórios', async ({ adminPage: page }) => {
    await page.goto('/obras')
    await page.getByRole('button', { name: 'Nova obra' }).first().click()

    const dialog = page.getByRole('dialog', { name: 'Nova obra' })
    await dialog.getByLabel('CEP').fill('123')
    await dialog.getByRole('button', { name: 'Cadastrar obra' }).click()

    await expect(dialog.getByText('Informe o nome da obra.')).toBeVisible()
    await expect(dialog.getByText('Informe o endereço.')).toBeVisible()
    await expect(dialog.getByText('Use o formato 00000-000.')).toBeVisible()
    await expect(dialog.getByText('Selecione o engenheiro responsável.')).toBeVisible()
  })

  test('filtra por busca e por status', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const termo = uid()
    const planejada = await api.criarObra({ responsavelId: engenheiro.id, nome: `Planejada ${termo}` })
    const emAndamento = await api.criarObra({
      responsavelId: engenheiro.id,
      nome: `Andamento ${termo}`,
      status: 'EM_ANDAMENTO',
    })

    await page.goto('/obras')
    await page.getByPlaceholder('Buscar por nome, endereço ou CEP').fill(termo)

    const cardPlanejada = page.getByRole('link', { name: new RegExp(planejada.nome) })
    const cardAndamento = page.getByRole('link', { name: new RegExp(emAndamento.nome) })
    await expect(cardPlanejada).toBeVisible()
    await expect(cardAndamento).toBeVisible()

    await page.getByRole('group', { name: 'Filtrar por status' }).getByRole('button', { name: 'Em andamento' }).click()
    await expect(cardAndamento).toBeVisible()
    await expect(cardPlanejada).toBeHidden()
  })

  test('percorre a máquina de estados até finalizar', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })

    await page.goto(`/obras/${obra.id}`)
    const detalhes = page.locator('.detail-card')
    await expect(detalhes.getByText('Planejada')).toBeVisible()

    await detalhes.getByRole('button', { name: 'Em andamento' }).click()
    await page.getByRole('dialog', { name: 'Alterar status' }).getByRole('button', { name: 'Confirmar' }).click()
    await expect(page.getByText('Status alterado para Em andamento.')).toBeVisible()

    await detalhes.getByRole('button', { name: 'Finalizada' }).click()
    const confirmacao = page.getByRole('dialog', { name: 'Alterar status' })
    await expect(confirmacao).toContainText('Este status é final')
    await confirmacao.getByRole('button', { name: 'Confirmar' }).click()

    await expect(detalhes.getByText('Finalizada')).toBeVisible()
    await expect(detalhes.getByText('Avançar status:')).toBeHidden()
  })

  test('edita os dados de uma obra', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })
    const novoNome = `Obra renomeada ${uid()}`

    await page.goto(`/obras/${obra.id}`)
    await page.getByRole('button', { name: 'Editar' }).click()

    const dialog = page.getByRole('dialog', { name: 'Editar obra' })
    await dialog.getByLabel('Nome').fill(novoNome)
    await dialog.getByRole('button', { name: 'Salvar alterações' }).click()

    await expect(page.getByText('Obra atualizada.')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(novoNome)
  })

  test('exclui uma obra', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })

    await page.goto(`/obras/${obra.id}`)
    await page.getByRole('button', { name: 'Excluir' }).click()
    await page.getByRole('dialog', { name: 'Excluir obra' }).getByRole('button', { name: 'Excluir' }).click()

    await expect(page).toHaveURL(/\/obras$/)
    await expect(page.getByText('Obra excluída.')).toBeVisible()
    await expect(page.getByRole('link', { name: new RegExp(obra.nome) })).toBeHidden()
  })
})
