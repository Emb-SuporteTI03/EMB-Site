export const getMesPorExtenso = (mes) => {
    let nomeMes;
    switch (mes) {
        case 1:
            nomeMes = "JANEIRO";
            break;
        case 2:
            nomeMes = "FEVEREIRO";
            break;
        case 3:
            nomeMes = "MARÇO";
            break;
        case 4:
            nomeMes = "ABRIL";
            break;
        case 5:
            nomeMes = "MAIO";
            break;
        case 6:
            nomeMes = "JUNHO";
            break;
        case 7:
            nomeMes = "JULHO";
            break;
        case 8:
            nomeMes = "AGOSTO";
            break;
        case 9:
            nomeMes = "SETEMBRO";
            break;
        case 10:
            nomeMes = "OUTUBRO";
            break;
        case 11:
            nomeMes = "NOVEMBRO";
            break;
        case 12:
            nomeMes = "DEZEMBRO";
            break;
        default:
            nomeMes = "MÊS INVÁLIDO";
    }
    return nomeMes;
}