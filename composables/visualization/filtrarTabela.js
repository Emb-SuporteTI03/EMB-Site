export const filtrarTabela = (listaEstatica, pesquisa, chaves) => {
  return listaEstatica.filter(option => {
    return chaves.some(chave => {
        const valor = option[chave]?.toString(); // Verifica se o campo existe
        return valor?.includes(pesquisa); // Retorna true se o valor incluir a pesquisa
    });
});
}
// MANUAL DA FUNÇÃO
// O QUE FAZ: 
// Uma tabela itera sobre um Array, por exemplo: 
// v-for="item in filtradoOsTab1" :key="item.codigo"
// a ideia é trazer as linhas filtradas da tabela com base na chave informada

// O QUE É NECESSÁRIO: 
// a tabela deve iterar o item filtrado para mostrar as informações
// é preciso que haja um item estático (que não será alterado) que recebe todas as informações
// é preciso que seja passada a query de pesquisa
// é preciso que sejam passados os nomes das chaves em forma de array ex: [chave1, chave2...]
// sendo assim, o item filtrado receberá o filtro do item estático, podendo ser incluído mais de uma chave

// COMO CHAMAR:
// a chamada dessa função deve ser feita da seguinte forma:
// this.itensFiltrados = filtrarTabela(this.itensEstatico, this.queryaSerBuscada, ['chave1, chave2(opcional), ...']);
//     ARRAY                FUNÇÃO              ARRAY             STRING                     ARRAY DE STRINGS

// CONCLUSÃO: 
// dessa forma o seu item filtrado irá receber todos os objetos cuja as chaves contenham o valor passado na query