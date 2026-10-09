import { uid } from '../support/api'
import { expect, test } from '../support/fixtures'

test.describe('Documentos', () => {
  test('adiciona um documento a uma obra', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })
    const nome = `Contrato ${uid()}`

    await page.goto(`/obras/${obra.id}`)
    await page.getByRole('button', { name: 'Adicionar' }).click()

    const dialog = page.getByRole('dialog', { name: 'Novo documento' })
    await dialog.getByLabel('Nome').fill(nome)
    await dialog.getByLabel('Tipo').selectOption({ label: 'Contrato' })
    await dialog.getByRole('button', { name: 'Adicionar documento' }).click()

    await expect(page.getByText('Documento enviado para análise.')).toBeVisible()
    const linha = page.getByRole('row', { name: new RegExp(nome) })
    await expect(linha).toContainText('Contrato')
    await expect(linha).toContainText('Pendente')
  })

  test('aprova e reprova um documento', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })
    const documento = await api.criarDocumento({ obraId: obra.id })

    await page.goto(`/obras/${obra.id}`)
    const linha = page.getByRole('row', { name: new RegExp(documento.nome) })

    await linha.getByRole('button', { name: `Aprovar ${documento.nome}` }).click()
    await expect(linha).toContainText('Aprovado')
    await expect(linha.getByRole('button', { name: `Aprovar ${documento.nome}` })).toBeHidden()

    await linha.getByRole('button', { name: `Reprovar ${documento.nome}` }).click()
    await expect(linha).toContainText('Reprovado')
  })

  test('renomeia e exclui um documento', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })
    const documento = await api.criarDocumento({ obraId: obra.id })
    const novoNome = `Renomeado ${uid()}`

    await page.goto(`/obras/${obra.id}`)
    await page.getByRole('button', { name: `Renomear ${documento.nome}` }).click()

    const dialog = page.getByRole('dialog', { name: 'Renomear documento' })
    await dialog.getByLabel('Nome').fill(novoNome)
    await dialog.getByRole('button', { name: 'Salvar' }).click()

    const linha = page.getByRole('row', { name: new RegExp(novoNome) })
    await expect(linha).toBeVisible()

    await linha.getByRole('button', { name: `Excluir ${novoNome}` }).click()
    await page.getByRole('dialog', { name: 'Excluir documento' }).getByRole('button', { name: 'Excluir' }).click()

    await expect(page.getByText('Documento excluído.')).toBeVisible()
    await expect(linha).toBeHidden()
  })

  test('filtra a lista geral por status e mantém o filtro na URL', async ({ adminPage: page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const termo = uid()
    const obra = await api.criarObra({ responsavelId: engenheiro.id, nome: `Obra ${termo}` })
    const pendente = await api.criarDocumento({ obraId: obra.id, nome: `Pendente ${termo}` })
    const aprovado = await api.criarDocumento({ obraId: obra.id, nome: `Aprovado ${termo}`, status: 'APROVADO' })

    await page.goto('/documentos')
    await page.getByPlaceholder('Buscar por nome, tipo ou obra').fill(termo)
    await expect(page.getByRole('row', { name: new RegExp(pendente.nome) })).toBeVisible()
    await expect(page.getByRole('row', { name: new RegExp(aprovado.nome) })).toBeVisible()

    await page.getByRole('group', { name: 'Filtrar por status' }).getByRole('button', { name: 'Aprovado' }).click()

    await expect(page).toHaveURL(/status=APROVADO/)
    await expect(page.getByRole('row', { name: new RegExp(aprovado.nome) })).toBeVisible()
    await expect(page.getByRole('row', { name: new RegExp(pendente.nome) })).toBeHidden()
  })
})
