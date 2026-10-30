/** DTO enviado para registrar ou atualizar sessão de tela */
export interface RegistraAtualizaControleTelaRequestDTO {
  cDescricaoTela: string;
  ID_Objeto?: number;
  ID_Usuario: number;
}

/** Resultado da tentativa de acesso à tela */
export interface RegistrarSessaoTelaResult {
  liberado: boolean;           // true se pode entrar
  usuarioOcupando?: string;    // nome de quem está ocupando (undefined se liberado)
}

export interface objetoPadrao {
  id: number;
  cNome: string;
};

export interface VerificaUsuarioSenhaHierarquiaRequestDTO {
  iD_Area: number;
  cSenha: string;
};

export interface AuthStoreState {
  token: string | null
  tokenExpiration: string | null

  id_usuario: number | null
  nome: string | null
  nomeAbreviado: string | null
  origem: string | null
  userRole: string | null
  sigla: string | null
  hierarquia: string | null
  email: string | null

  ID_Unidade: number | null
  empresa: string | null
  ID_Carteira: number | null
}
