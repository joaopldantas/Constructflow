package joaopldantas.project.entities.enums;

public enum StatusObra {
    PLANEJADA,
    EM_ANDAMENTO,
    FINALIZADA,
    CANCELADA;

    public boolean podeIrPara(StatusObra novoStatus) {

        if (this == FINALIZADA || this == CANCELADA) {
            return false;
        }

        if (this == PLANEJADA && novoStatus == EM_ANDAMENTO) {
            return true;
        }

        if (this == EM_ANDAMENTO &&
                (novoStatus == FINALIZADA || novoStatus == CANCELADA)) {
            return true;
        }

        return false;
    }
}
