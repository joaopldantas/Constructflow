import { useState } from "react";
import Login from "./pages/Login";
import Obras from "./pages/Obras";

export default function App() {
    const [logado, setLogado] = useState(!!localStorage.getItem("token"));

    function onLogin() {
        setLogado(true);
    }

    function onLogout() {
        localStorage.removeItem("token");
        setLogado(false);
    }

    return logado ? <Obras onLogout={onLogout} /> : <Login onLogin={onLogin} />;
}