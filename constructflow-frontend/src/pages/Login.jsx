import { http } from "../api/http";
import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        try {
            const { data } = await http.post("/auth/login", { email, senha });
            localStorage.setItem("token", data);
            onLogin();
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setErro(apiMessage || "Erro ao conectar com a API");
        }
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1>ConstructFlow</h1>
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                <button type="submit">Entrar</button>
                {erro && <p className="erro">{erro}</p>}
            </form>
        </main>
    );
}
