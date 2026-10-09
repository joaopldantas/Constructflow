import { expect, test, autenticar } from '../support/fixtures'

test.describe('Permissões por papel', () => {
  test('engenheiro vê apenas as próprias obras e não gerencia usuários', async ({ page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const outroEngenheiro = await api.criarUsuario('ENGENHEIRO')
    const minha = await api.criarObra({ responsavelId: engenheiro.id })
    const deOutro = await api.criarObra({ responsavelId: outroEngenheiro.id })

    await autenticar(page, engenheiro)
    await page.goto('/obras')

    await expect(page.getByRole('link', { name: new RegExp(minha.nome) })).toBeVisible()
    await expect(page.getByRole('link', { name: new RegExp(deOutro.nome) })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Nova obra' })).toBeHidden()
    await expect(page.getByRole('link', { name: 'Usuários' })).toBeHidden()

    await page.goto('/usuarios')
    await expect(page).toHaveURL(/\/$/)

    await page.goto(`/obras/${deOutro.id}`)
    await expect(page.getByText('Não foi possível carregar a obra')).toBeVisible()
  })

  test('engenheiro avalia documentos da sua obra, mas não exclui', async ({ page, api }) => {
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id, status: 'EM_ANDAMENTO' })
    const documento = await api.criarDocumento({ obraId: obra.id })

    await autenticar(page, engenheiro)
    await page.goto(`/obras/${obra.id}`)

    const linha = page.getByRole('row', { name: new RegExp(documento.nome) })
    await expect(linha.getByRole('button', { name: `Excluir ${documento.nome}` })).toBeHidden()

    await linha.getByRole('button', { name: `Aprovar ${documento.nome}` }).click()
    await expect(linha).toContainText('Aprovado')

    // Responsável pode avançar o status, mas não editar nem excluir a obra.
    await expect(page.getByRole('button', { name: 'Finalizada' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Editar' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Excluir' })).toBeHidden()
  })

  test('backoffice cadastra e edita obras, mas não exclui nem muda status', async ({ page, api }) => {
    const backoffice = await api.criarUsuario('BACKOFFICE')
    const engenheiro = await api.criarUsuario('ENGENHEIRO')
    const obra = await api.criarObra({ responsavelId: engenheiro.id })

    await autenticar(page, backoffice)
    await page.goto(`/obras/${obra.id}`)

    await expect(page.getByRole('button', { name: 'Editar' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Excluir' })).toBeHidden()
    await expect(page.getByText('Avançar status:')).toBeHidden()

    await page.goto('/obras')
    await expect(page.getByRole('button', { name: 'Nova obra' })).toBeVisible()
  })

  test('campo não vê obras às quais não está vinculado', async ({ page, api }) => {
    const campo = await api.criarUsuario('CAMPO')

    await autenticar(page, campo)
    await page.goto('/obras')

    await expect(page.getByText('Nenhuma obra cadastrada')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Nova obra' })).toBeHidden()
    await expect(page.getByRole('link', { name: 'Usuários' })).toBeHidden()
  })
})
