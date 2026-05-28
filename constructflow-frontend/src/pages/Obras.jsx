import { useEffect, useState } from "react";
import { http } from "../api/http";
import "./Obras.css";

const formInicial = {
    nome: "",
    endereco: "",
    cep: "",
    status: "PLANEJADA",
    responsavelId: "",
};

const engenheiroInicial = {
    nome: "",
    email: "",
    senha: "",
};

const statusLabels = {
    PLANEJADA: "Planejada",
    EM_ANDAMENTO: "Em andamento",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
};

const statusOptions = Object.keys(statusLabels);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cepRegex = /^\d{5}-\d{3}$/;

function formatarCep(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

function statusPermitidos(statusAtual) {
    if (statusAtual === "PLANEJADA") return ["PLANEJADA", "EM_ANDAMENTO"];
    if (statusAtual === "EM_ANDAMENTO") return ["EM_ANDAMENTO", "FINALIZADA", "CANCELADA"];
    return [statusAtual];
}

export default function Obras({ onLogout }) {
    const [obras, setObras] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [abaAtiva, setAbaAtiva] = useState("obras");

    const [mostrarForm, setMostrarForm] = useState(false);
    const [dadosForm, setDadosForm] = useState(formInicial);
    const [cepFoiTocado, setCepFoiTocado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [obraProcessando, setObraProcessando] = useState(null);
    const [mostrarFormEngenheiro, setMostrarFormEngenheiro] = useState(false);
    const [dadosEngenheiro, setDadosEngenheiro] = useState(engenheiroInicial);
    const [emailFoiTocado, setEmailFoiTocado] = useState(false);
    const [salvandoEngenheiro, setSalvandoEngenheiro] = useState(false);
    const [engenheiroProcessando, setEngenheiroProcessando] = useState(null);

    const engenheiros = usuarios.filter((usuario) => usuario.papel === "ENGENHEIRO");
    const emailEngenheiro = dadosEngenheiro.email.trim();
    const emailValido = emailRegex.test(emailEngenheiro);
    const emailInvalido = emailFoiTocado && emailEngenheiro !== "" && !emailValido;
    const cepValido = cepRegex.test(dadosForm.cep);
    const cepInvalido = cepFoiTocado && dadosForm.cep !== "" && !cepValido;

    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                const [obrasResponse, usuariosResponse] = await Promise.all([http.get("/obras"), http.get("/usuarios")]);
                if (ativo) {
                    setObras(obrasResponse.data);
                    setUsuarios(usuariosResponse.data);
                }
            } catch (error) {
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    onLogout();
                    return;
                }

                if (ativo) setErro("Falha ao carregar as obras.");
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarDados();

        return () => {
            ativo = false;
        };
    }, [onLogout]);

    async function recarregarObras() {
        const { data } = await http.get("/obras");
        setObras(data);
    }

    function atualizarCampo(event) {
        const { name, value } = event.target;
        setDadosForm((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: name === "cep" ? formatarCep(value) : value,
        }));
    }

    function atualizarCampoEngenheiro(event) {
        const { name, value } = event.target;
        setDadosEngenheiro((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
    }

    function abrirForm() {
        setErro("");
        setSucesso("");
        setDadosForm({
            ...formInicial,
            responsavelId: engenheiros[0]?.id?.toString() || "",
        });
        setCepFoiTocado(false);
        setMostrarForm(true);
    }

    function fecharForm() {
        setMostrarForm(false);
        setDadosForm(formInicial);
        setCepFoiTocado(false);
    }

    function trocarAba(aba) {
        setAbaAtiva(aba);
        setErro("");
        setSucesso("");
    }

    function abrirFormEngenheiro() {
        setErro("");
        setSucesso("");
        setDadosEngenheiro(engenheiroInicial);
        setEmailFoiTocado(false);
        setMostrarFormEngenheiro(true);
    }

    function fecharFormEngenheiro() {
        setMostrarFormEngenheiro(false);
        setDadosEngenheiro(engenheiroInicial);
        setEmailFoiTocado(false);
    }

    async function criarObra(event) {
        event.preventDefault();
        setCepFoiTocado(true);
        if (!cepValido) return;

        setErro("");
        setSucesso("");
        setSalvando(true);

        try {
            await http.post("/obras", {
                nome: dadosForm.nome.trim(),
                endereco: dadosForm.endereco.trim(),
                cep: dadosForm.cep,
                status: dadosForm.status,
                responsavelId: Number(dadosForm.responsavelId),
            });
            await recarregarObras();
            fecharForm();
            setSucesso("Obra criada com sucesso.");
        } catch (error) {
            const mensagemApi = error?.response?.data?.message;
            setErro(mensagemApi || "Falha ao criar a obra.");
        } finally {
            setSalvando(false);
        }
    }

    async function criarEngenheiro(event) {
        event.preventDefault();
        setEmailFoiTocado(true);
        if (!emailValido) return;

        setErro("");
        setSucesso("");
        setSalvandoEngenheiro(true);

        try {
            const { data } = await http.post("/usuarios", {
                nome: dadosEngenheiro.nome.trim(),
                email: dadosEngenheiro.email.trim(),
                senha: dadosEngenheiro.senha,
                papel: "ENGENHEIRO",
            });
            setUsuarios((usuariosAtuais) => [...usuariosAtuais, data]);
            setDadosForm((dadosAtuais) => ({
                ...dadosAtuais,
                responsavelId: dadosAtuais.responsavelId || data.id.toString(),
            }));
            setDadosEngenheiro(engenheiroInicial);
            setEmailFoiTocado(false);
            setMostrarFormEngenheiro(false);
            setSucesso("Engenheiro cadastrado com sucesso.");
        } catch (error) {
            const mensagemApi = error?.response?.data?.message;
            setErro(mensagemApi || "Falha ao cadastrar engenheiro.");
        } finally {
            setSalvandoEngenheiro(false);
        }
    }

    async function atualizarStatus(obraId, status) {
        setErro("");
        setSucesso("");
        setObraProcessando(obraId);

        try {
            const { data } = await http.patch(`/obras/${obraId}/status`, { status });
            setObras((obrasAtuais) => obrasAtuais.map((obra) => (obra.id === obraId ? data : obra)));
            setSucesso("Status atualizado.");
        } catch (error) {
            const mensagemApi = error?.response?.data?.message;
            setErro(mensagemApi || "Falha ao atualizar o status.");
        } finally {
            setObraProcessando(null);
        }
    }

    async function deletarEngenheiro(engenheiroId) {
        const confirmado = window.confirm("Excluir este engenheiro?");
        if (!confirmado) return;

        setErro("");
        setSucesso("");
        setEngenheiroProcessando(engenheiroId);

        try {
            await http.delete(`/usuarios/${engenheiroId}`);
            setUsuarios((usuariosAtuais) => usuariosAtuais.filter((usuario) => usuario.id !== engenheiroId));
            setDadosForm((dadosAtuais) => ({
                ...dadosAtuais,
                responsavelId:
                    dadosAtuais.responsavelId === engenheiroId.toString()
                        ? ""
                        : dadosAtuais.responsavelId,
            }));
            setSucesso("Engenheiro excluido.");
        } catch (error) {
            const mensagemApi = error?.response?.data?.message;
            setErro(mensagemApi || "Falha ao excluir engenheiro. Verifique se ele nao esta vinculado a uma obra.");
        } finally {
            setEngenheiroProcessando(null);
        }
    }

    async function deletarObra(obraId) {
        const confirmado = window.confirm("Excluir esta obra?");
        if (!confirmado) return;

        setErro("");
        setSucesso("");
        setObraProcessando(obraId);

        try {
            await http.delete(`/obras/${obraId}`);
            setObras((obrasAtuais) => obrasAtuais.filter((obra) => obra.id !== obraId));
            setSucesso("Obra excluida.");
        } catch (error) {
            const mensagemApi = error?.response?.data?.message;
            setErro(mensagemApi || "Falha ao excluir a obra.");
        } finally {
            setObraProcessando(null);
        }
    }

    return (
        <main className="obras-page">
            <header className="obras-header">
                <div>
                    <span className="obras-eyebrow">ConstructFlow</span>
                    <h1>{abaAtiva === "obras" ? "Obras" : "Engenheiros"}</h1>
                    <p>
                        {abaAtiva === "obras"
                            ? "Acompanhe as obras cadastradas e seus status atuais."
                            : "Cadastre e gerencie os responsaveis tecnicos das obras."}
                    </p>
                </div>
                <div className="obras-header-actions">
                    <button className="logout-button" type="button" onClick={onLogout}>
                        Sair
                    </button>
                </div>
            </header>

            <nav className="obras-tabs" aria-label="Navegacao principal">
                <button
                    className={abaAtiva === "obras" ? "active" : ""}
                    type="button"
                    onClick={() => trocarAba("obras")}
                >
                    Obras
                </button>
                <button
                    className={abaAtiva === "engenheiros" ? "active" : ""}
                    type="button"
                    onClick={() => trocarAba("engenheiros")}
                >
                    Engenheiros
                </button>
            </nav>

            <section className="obras-summary" aria-label="Resumo das obras">
                <article>
                    <strong>{obras.length}</strong>
                    <span>Total</span>
                </article>
                <article>
                    <strong>{obras.filter((obra) => obra.status === "EM_ANDAMENTO").length}</strong>
                    <span>Em andamento</span>
                </article>
                <article>
                    <strong>{obras.filter((obra) => obra.status === "FINALIZADA").length}</strong>
                    <span>Finalizadas</span>
                </article>
            </section>

            {erro && <p className="obras-message obras-error">{erro}</p>}
            {sucesso && <p className="obras-message obras-success">{sucesso}</p>}

            {abaAtiva === "engenheiros" && mostrarFormEngenheiro && (
                <>
                    <section className="obras-form-panel">
                    <div className="obras-panel-header">
                        <h2>Novo engenheiro</h2>
                        <button className="text-button" type="button" onClick={fecharFormEngenheiro}>
                            Cancelar
                        </button>
                    </div>

                    <form className="obras-form engenheiro-form" onSubmit={criarEngenheiro}>
                        <label>
                            Nome
                            <input
                                name="nome"
                                value={dadosEngenheiro.nome}
                                onChange={atualizarCampoEngenheiro}
                                required
                            />
                        </label>
                        <label>
                            Email
                            <input
                                className={emailInvalido ? "campo-invalido" : emailValido ? "campo-valido" : ""}
                                name="email"
                                type="text"
                                inputMode="email"
                                placeholder="nome@dominio.com"
                                value={dadosEngenheiro.email}
                                onChange={atualizarCampoEngenheiro}
                                onBlur={() => setEmailFoiTocado(true)}
                                aria-invalid={emailInvalido}
                                required
                            />
                        </label>
                        <label>
                            Senha inicial
                            <input
                                name="senha"
                                type="password"
                                value={dadosEngenheiro.senha}
                                onChange={atualizarCampoEngenheiro}
                                minLength={6}
                                required
                            />
                        </label>
                        <button
                            className="primary-button"
                            type="submit"
                            disabled={salvandoEngenheiro || !emailValido}
                        >
                            {salvandoEngenheiro ? "Salvando..." : "Cadastrar"}
                        </button>
                    </form>
                    </section>

                </>
            )}

            {abaAtiva === "engenheiros" && (
                    <section className="obras-panel">
                        <div className="obras-panel-header">
                            <h2>Lista de engenheiros</h2>
                            <div className="panel-header-actions">
                                <span>{engenheiros.length} registros</span>
                                <button className="primary-button" type="button" onClick={abrirFormEngenheiro}>
                                    Novo engenheiro
                                </button>
                            </div>
                        </div>

                        {engenheiros.length === 0 ? (
                            <p className="obras-state">Nenhum engenheiro cadastrado.</p>
                        ) : (
                            <div className="obras-list">
                                {engenheiros.map((engenheiro) => (
                                    <article className="obra-card" key={engenheiro.id}>
                                        <div>
                                            <h3>{engenheiro.nome}</h3>
                                            <p>{engenheiro.email}</p>
                                        </div>
                                        <div className="obra-meta">
                                            <small>#{engenheiro.id}</small>
                                            <button
                                                className="danger-button"
                                                type="button"
                                                onClick={() => deletarEngenheiro(engenheiro.id)}
                                                disabled={engenheiroProcessando === engenheiro.id}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
            )}

            {abaAtiva === "obras" && mostrarForm && (
                <section className="obras-form-panel">
                    <div className="obras-panel-header">
                        <h2>Nova obra</h2>
                        <button className="text-button" type="button" onClick={fecharForm}>
                            Cancelar
                        </button>
                    </div>

                    <form className="obras-form" onSubmit={criarObra}>
                        <label>
                            Nome
                            <input name="nome" value={dadosForm.nome} onChange={atualizarCampo} required />
                        </label>
                        <label>
                            Endereco
                            <input name="endereco" value={dadosForm.endereco} onChange={atualizarCampo} required />
                        </label>
                        <label>
                            CEP
                            <input
                                className={cepInvalido ? "campo-invalido" : cepValido ? "campo-valido" : ""}
                                name="cep"
                                inputMode="numeric"
                                placeholder="00000-000"
                                value={dadosForm.cep}
                                onChange={atualizarCampo}
                                onBlur={() => setCepFoiTocado(true)}
                                aria-invalid={cepInvalido}
                                required
                            />
                        </label>
                        <label>
                            Status
                            <select name="status" value={dadosForm.status} onChange={atualizarCampo} required>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {statusLabels[status]}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Engenheiro responsavel
                            <select
                                name="responsavelId"
                                value={dadosForm.responsavelId}
                                onChange={atualizarCampo}
                                required
                                disabled={engenheiros.length === 0}
                            >
                                <option value="">Selecione</option>
                                {engenheiros.map((engenheiro) => (
                                    <option key={engenheiro.id} value={engenheiro.id}>
                                        {engenheiro.nome} #{engenheiro.id}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button className="primary-button" type="submit" disabled={salvando || engenheiros.length === 0 || !cepValido}>
                            {salvando ? "Salvando..." : "Criar obra"}
                        </button>
                    </form>

                    {engenheiros.length === 0 && (
                        <p className="obras-state">
                            Cadastre um usuario ENGENHEIRO para conseguir criar obras.
                            <button className="inline-button" type="button" onClick={() => trocarAba("engenheiros")}>
                                Cadastrar engenheiro
                            </button>
                        </p>
                    )}
                </section>
            )}

            {abaAtiva === "obras" && (
                <section className="obras-panel">
                <div className="obras-panel-header">
                    <h2>Lista de obras</h2>
                    <div className="panel-header-actions">
                        <span>{carregando ? "Carregando..." : `${obras.length} registros`}</span>
                        <button className="primary-button" type="button" onClick={abrirForm}>
                            Nova obra
                        </button>
                    </div>
                </div>

                {carregando ? (
                    <p className="obras-state">Buscando obras...</p>
                ) : obras.length === 0 ? (
                    <p className="obras-state">Nenhuma obra cadastrada.</p>
                ) : (
                    <div className="obras-list">
                        {obras.map((obra) => (
                            <article className="obra-card" key={obra.id}>
                                <div>
                                    <h3>{obra.nome}</h3>
                                    <p>{obra.endereco}</p>
                                    {obra.cep && <small className="obra-cep">CEP {obra.cep}</small>}
                                </div>
                                <div className="obra-meta">
                                    <select
                                        className={`obra-status status-${obra.status?.toLowerCase()}`}
                                        value={obra.status}
                                        onChange={(event) => atualizarStatus(obra.id, event.target.value)}
                                        disabled={obraProcessando === obra.id || statusPermitidos(obra.status).length === 1}
                                        aria-label={`Status da obra ${obra.nome}`}
                                    >
                                        {statusPermitidos(obra.status).map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabels[status]}
                                            </option>
                                        ))}
                                    </select>
                                    <small>Resp. #{obra.responsavelId}</small>
                                    <button
                                        className="danger-button"
                                        type="button"
                                        onClick={() => deletarObra(obra.id)}
                                        disabled={obraProcessando === obra.id}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                </section>
            )}
        </main>
    );
}
