import { useEffect, useState } from "react";
import { http } from "../api/http";

export default function Obras({ onLogout }) {
    const [obras, setObras] = useState([]);

    useEffect(() => {
        http.get("/obras").then((res) => setObras(res.data)).catch(() => onLogout());
    }, [onLogout]);

    return (
        <div>
            <button onClick={onLogout}>Sair</button>
            <h2>Obras</h2>
            <ul>
                {obras.map((o) => (
                    <li key={o.id}>{o.nome} - {o.status}</li>
                ))}
            </ul>
        </div>
    );
}