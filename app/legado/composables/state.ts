// Sistema (Global):
// A URL da API agora vem do runtimeConfig do site novo (nuxt.config.ts / NUXT_PUBLIC_API_URL).
// Getter para funcionar também nas funções chamadas fora do setup dos componentes.
const urlPadrao = "https://erp-api.grupoembalarte.com.br/api";
// const urlPadrao = "https://localhost:7116/api";    
const urlApi = () => (tryUseNuxtApp()?.$config.public.apiUrl as string | undefined) ?? urlPadrao
export const useUrlProd = () => urlApi();

export const useUrlProdSistema = () => useState<string>("urlProdSistema", () => `${urlApi()}/sistema`);
export const useIsSideMenuOpen = () => useState<boolean>("isSideMenuOpen", () => false);
export const useIsSideMenuItemSelected = () => useState<string>("isSideMenuItemSelected", () => "selected-item-navegacao");
export const useAddRemoveGrowthStyle = () => useState<boolean>("addRemoveGrowthStyle", () => true);

// Financeiro:
export const useUrlProdFinanceiro = () => useState<string>("urlProdFinanceiro", () => `${urlApi()}/financeiro`);
export const UseShowCadastroPages = () => useState<boolean>("showCadastroPages", () => false);
export const useShowMovimentacoesPages = () => useState<boolean>('showMovimentacaoPages', () => true);
export const useShowDashboardPages = () => useState<boolean>('showDashboardPages', () => false);

// Produção:
export const useUrlProdProducao = () => useState<string>("urlProdProducao", () => `${urlApi()}/producao`);
export const useUrlTreinamentoFilho = () => useState<string>("urlTreinamentoFilho", () => `${urlApi()}/producao/controladoria/treinamento-filho`);
export const useUrlProdControladoria = () => useState<string>("urlProdControladoria", () => `${urlApi()}/controladoria`);
export const useShowRotinaPages = () => useState<boolean>('showRotinaPages', () => true);
export const UseShowCadastroProdPages = () => useState<boolean>("showCadastroProdPages", () => false);

// RH:
export const useUrlProdRH = () => useState<string>("urlProdRH", () => `${urlApi()}/recursoshumanos`);
export const useUrProdGeral = () => useState<string>("urlGeral", () => urlApi());

// ESTOQUE:
export const useUrlEstoque = () => useState<string>("urlEstoque", () => `${urlApi()}/estoque`);
export const useIDComponente = () => useState<number | null>("IDComponente", () => 10);