import type { RegistraAtualizaControleTelaRequestDTO, RegistrarSessaoTelaResult,
  VerificaUsuarioSenhaHierarquiaRequestDTO
 } from './interfaces';
import axios from 'axios'
// import { useAuthStore } from '~/stores/auth';

const urlProd = useUrlProd();

/**
 * Verifica se o usuário pode acessar a tela e registra/atualiza a sessão.
 * @param {RegistraAtualizaControleTelaRequestDTO} request - Dados da tela e usuário.
 * @returns {Promise<RegistrarSessaoTelaResult>} Resultado contendo liberado e usuário ocupando (se houver).
 */
export async function verificaAcessoTela(request: RegistraAtualizaControleTelaRequestDTO): Promise<RegistrarSessaoTelaResult> {
  try {
    // const authStore = useAuthStore();
    // const token = authStore.token;
    const response = await fetch(`${urlProd}/sistema/controle-sessao-tela/verificar-sessao`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer `,
        'Content-Type': 'application/json' // Adicionando o Content-Type adequado
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data: RegistrarSessaoTelaResult = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar acesso da tela:', error);
    return { liberado: false, usuarioOcupando: undefined }; // fallback seguro
  }
}

/**
 * Verifica se o usuário pode acessar a tela e registra/atualiza a sessão.
 * @param {RegistraAtualizaControleTelaRequestDTO} request - Dados da tela e usuário.
 * @returns {Promise<RegistrarSessaoTelaResult>} Resultado contendo liberado e usuário ocupando (se houver).
 */
export async function RegistraAtualizaAcessoTela(request: RegistraAtualizaControleTelaRequestDTO): Promise<RegistrarSessaoTelaResult> {
  try {
    // const authStore = useAuthStore();
    // const token = authStore.token;
    const response = await fetch(`${urlProd}/sistema/controle-sessao-tela/conferir-registrar-ou-atualizar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer $`,
        'Content-Type': 'application/json' // Adicionando o Content-Type adequado
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data: RegistrarSessaoTelaResult = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar acesso da tela:', error);
    return { liberado: false, usuarioOcupando: undefined }; // fallback seguro
  }
}

/**
 * Encerra a sessão da tela para o objeto informado.
 * @param {RegistraAtualizaControleTelaRequestDTO} request - Dados da tela, objeto e usuário.
 * @returns {Promise<{ message: string }>} Mensagem de sucesso.
 */
export async function encerrarSessaoTela(request: RegistraAtualizaControleTelaRequestDTO): Promise<{ message: string }> {
  try {
    // const authStore = useAuthStore();
    // const token = authStore.token;
    const response = await fetch(`${urlProd}/sistema/controle-sessao-tela/encerrar-sessao`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer `,
        'Content-Type': 'application/json' // Adicionando o Content-Type adequado
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data: { message: string } = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao encerrar sessão da tela:', error);
    return { message: 'Erro ao encerrar sessão.' };
  }
}


/**
 * Mostra ou oculta um modal do Bootstrap pelo ID.
 *
 * @param {string} modalId - O ID do modal a ser controlado.
 * @param {boolean} abrir - Se verdadeiro, abre o modal; se falso, fecha.
 */
export const showModal = (modalId: string, abrir: boolean): void => {
  const modalElement = document.getElementById(modalId) as HTMLElement | null;
  if (!modalElement) return;

  // Tenta pegar a instância existente
  // @ts-ignore
  let modal = window.bootstrap.Modal.getInstance(modalElement);

  // Se não existir, cria uma nova
  if (!modal) {
    // @ts-ignore
    modal = new window.bootstrap.Modal(modalElement, {
      backdrop: "static",
      keyboard: false
    });
  }

  if (abrir) {
    modal.show();
  } else {
    modal.hide();
    // Remove o backdrop, caso reste algum
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  }
};

/**
 * Ativa ou desativa todos os elementos com uma determinada classe.
 * 
 * - Se `bool` for `true`, os elementos serão desabilitados e a classe `opacity-03` será adicionada.
 * - Se `bool` for `false`, os elementos serão habilitados e a classe `opacity-03` será removida.
 *
 * @param {string} className - Nome da classe dos elementos que serão afetados.
 * @param {boolean} bool - Define se os elementos devem ser desabilitados (true) ou habilitados (false).
 */
export const DisableButtonByClassName = (className: string, bool: boolean): void => {
  const elements = document.querySelectorAll(`.${className}`)

  elements.forEach(el => {
    const htmlEl = el as HTMLElement // ✅ converte pra HTMLElement pra acessar .style

    // Se for botão ou input, aplica o disabled
    if (htmlEl instanceof HTMLButtonElement || htmlEl instanceof HTMLInputElement) {
      htmlEl.disabled = bool
    } else {
      // Outros elementos (div, a, etc.) usam pointer-events
      htmlEl.style.pointerEvents = bool ? 'none' : 'auto'
    }

    // Adiciona ou remove a classe de opacidade
    if (bool) {
      htmlEl.classList.add('OPACITY-03')
    } else {
      htmlEl.classList.remove('OPACITY-03')
    }
  })
};

/**
 * Ativa ou desativa um botão específico com base no seu ID.
 * 
 * - Se `bool` for `true`, o botão será desabilitado e receberá a classe `opacity-03`.
 * - Se `bool` for `false`, o botão será habilitado e a classe `opacity-03` será removida.
 *
 * @param {string} id - O ID do botão a ser afetado.
 * @param {boolean} bool - Define se o botão deve ser desabilitado (true) ou habilitado (false).
 */
export const DisableButtonById = (id: string, bool: boolean): void => {
  const el = document.getElementById(id) as HTMLButtonElement | null

  if (!el) return // se o botão não existir, sai da função

  el.disabled = bool

  if (bool) {
    el.classList.add('opacity-03')
  } else {
    el.classList.remove('opacity-03')
  }
};

/**
 * Ativa ou desativa um campo de input específico com base no seu ID.
 * 
 * - Se `bool` for `true`, o input será desabilitado e receberá a classe `opacity-03`.
 * - Se `bool` for `false`, o input será habilitado e a classe `opacity-03` será removida.
 *
 * @param {string} id - O ID do input a ser afetado.
 * @param {boolean} bool - Define se o input deve ser desabilitado (true) ou habilitado (false).
 */
export const DisableInputById = (id: string, bool: boolean): void => {
  const el = document.getElementById(id) as HTMLInputElement | null

  if (!el) return // se não encontrar, não faz nada

  el.disabled = bool

}

/**
 * Mostra ou oculta um elemento específico com base no seu ID.
 * 
 * - Se `bool` for `true`, o elemento será exibido (classe `d-none` será removida).
 * - Se `bool` for `false`, o elemento será ocultado (classe `d-none` será adicionada).
 *
 * @param {string} id - O ID do elemento que será mostrado ou ocultado.
 * @param {boolean} bool - Define se o elemento deve ser exibido (true) ou ocultado (false).
 */
export const ShowElementById = (id: string, bool: boolean): void => {
  const el = document.getElementById(id) as HTMLElement | null

  if (!el) return // se não encontrar, não faz nada

  if (bool) {
    el.classList.remove('D-none')
  } else {
    el.classList.add('D-none')
  }
}

import { nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth';

/**
 * Define o foco em um campo de input com base no seu ID,
 * aguardando o elemento estar disponível no DOM antes de aplicar o foco.
 * 
 * - Usa `nextTick()` para aguardar a renderização do DOM (Vue/Nuxt).
 * - Caso o elemento ainda não esteja visível, tenta novamente algumas vezes.
 *
 * @param {string} id - O ID do input que deve receber foco.
 * @param {number} [intervalMs=100] - Intervalo de checagem em milissegundos.
 */
export const FocusInputById = async (id: string, intervalMs: number = 100): Promise<void> => {
  await nextTick() // 🔹 Espera o DOM atualizar após mudanças reativas

  const maxAttempts = 20
  let attempts = 0
  
  const tryFocus = () => {
    const el = document.getElementById(id) as HTMLInputElement | null

    if (el && el.offsetParent !== null) {
      el.focus()
      return
    }

    if (attempts < maxAttempts) {
      attempts++
      setTimeout(tryFocus, intervalMs)
    }
  }

  tryFocus()
}

/**
 * Valida um usuário e sua hierarquia chamando a API responsável.
 *
 * - Recebe iD_Area e cSenha separadamente.
 * - Monta o body internamente antes de enviar ao backend.
 * - Retorna `true` ou `false` conforme a resposta do backend.
 * - Em caso de erro, sempre retorna `false`.
 *
 * @param {number} iD_Area - ID da área do usuário
 * @param {string} cSenha - Senha informada para validação
 * @returns {Promise<boolean>}
 */
export const VerificaUsuarioeHierarquia = async (iD_Area: number, cSenha: string): Promise<boolean> => {
  try {
    // const authStore = useAuthStore();
    // const token = authStore.token;
    const url = `${urlProd}/sistema/usuarios/verifica-usuario-senha-hierarquia`

    const body: VerificaUsuarioSenhaHierarquiaRequestDTO = { iD_Area, cSenha }

    const response = await axios.put<boolean>(url, body, {
      headers: { Authorization: `Bearer ` }
    })

    return response.data === true
  } catch {
    return false
  }
}

// src/composables/functions.ts
export class RequestManager {
  private controller: AbortController;

  constructor() {
    this.controller = new AbortController();
  }

  // retorna o signal para axios
  get signal() {
    return this.controller.signal;
  }

  // cancela tudo e cria um novo controller
  reset() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  // cancela as requisições atuais
  cancel() {
    this.controller.abort();
  }
}

export const LimpaLocalStor = () => {
  let siglaLogin = localStorage.getItem('sigla');
  localStorage.clear();
  localStorage.setItem('sigla', siglaLogin ?? "");

  // const authStore = useAuthStore();
  // authStore.logout();
};

// Reservas em aberto
export const BuscaQtdReservasEmAbertoPCP = async (ID_Carteira: number): Promise<number> => {

  const token = useAuthStore().token;

  try {
    // const authStore = useAuthStore()
    // const token = authStore.token
    const url = `${urlProd}/pcp/entrada-componente-reservado-pcp/reservas-em-aberto/${ID_Carteira}`

    const response = await axios.get<number>(url, {
      headers: { Authorization: `Bearer ${token ?? ''}` }
    })

    return response.data;
  } catch {
    return 0;
  }
};