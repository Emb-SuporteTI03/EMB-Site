<script setup>
// Documentação (como instanciar e chamar as funções onde ele é instanciado):

{/* <BasicElementVue3SelectPequeno
              ref="clienteSelectREF"
              :divClass="'WIDTH-15 col-1 MARGIN-T14'"
              :selectClass="''"
              label="CLIENTE:"
              :options="clientes"
              optionLabel="cNmFantasia"
              v-model="selectedCliente"
              :widthLista="'150px'"

              @keyup="e => 'aqui vai a função'"
              @update:modelValue="onChangeFiltroCliente"
              @Open="onClickFiltroCliente"
              @close="onBlurFiltroCliente"
            /> */}
// this.$refs.SelectRef.habilitarSelect();


// Resumos:
// computed => valor automático baseado em reatividade.
// Com get/set, ele vira uma ponte inteligente para v-model.
// Nesse caso, é essencial para comunicar o valor entre o componente pai e o filho.

// Computed:
// computed é uma função reativa que cria propriedades derivadas, ou seja,
// Você cria um valor que depende de outros valores.
// E automaticamente ele é recalculado só quando esses valores mudam.
import { watch, nextTick, ref, computed } from 'vue';

// Importações da biblioteca:
import V3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';

// PROPS:
// Basicamente é o TIPO 'type' e o valor default caso não instancie com nenhum valor:
const props = defineProps({
  // Aqui passa o v-model:
  modelValue: {
    type: [String, Number, Object, null],
    default: '',
  },
  // Aqui passa o Array:
  options: {
    type: Array,
    default: () => [],
  },
  // Aqui é o nome da label mesmo:
  label: {
    type: String,
    default: '',
  },
  // Essa é a chave do OBJETO que está dentro do array:
  optionLabel: {
    type: String,
    default: '',
  },
  // Acho que é pra ser filtrável só:
  filterable: {
    type: Boolean,
    default: true,
  },
  // Quando não encontra nada correspondente a pesquisa no INPUT:
  noOptionsText: {
    type: String,
    default: 'Não há opções correspondentes.',
  },

  titulo: {
    type: String,
    default: '',
  },

  // Props para customizar classes externas
  divClass: {
    type: String,
    default: '',
  },
  labelClass: {
    type: String,
    default: '',
  },
  selectClass: {
    type: String,
    default: '',
  },
  loadingClass: {
    type: String,
    default: '',
  },
  
  widthLista: {
    type: String,
    default: '100%',
  },

  // isDisabled: {
  //   type: Boolean,
  //   default: false
  // },

  isLoadingInput: {
    type: Boolean,
    default: false
  }

});

// 'emit': é o mecanismo do VUE para avisar ao componente PAI algo que ocorreu no componente FILHO.
//         => dispara um evento personalizado, que o componente pai pode escutar.
const emit = defineEmits([
  'update:modelValue',
  'open',
  'close',
  'search',
  'keyup'
]);


// Esse 'computed' é usado para criar um 'meio campo' entre o v-model do pai e o v-model do filho:
const modelValueProxy = computed({
  // O 'get' é chamado para ler o valor atual (que vem do pai)
  get: () => props.modelValue,
  // o 'set' é chamado para escrever/atualizar o valor e informar ao pai que mudou.
  set: (value) => emit('update:modelValue', value),
});

// Métodos e variáveis: --------------------------------------------------------------------------\
const isDisabled = ref(false);
const isLoading = ref(false);
const divRef = ref(null);
const labelRef = ref(null);
const selectRef = ref(null);

const enableSelect = () => {
  isDisabled.value = false;
};

const disableSelect = () => {
  isDisabled.value = true;
};

const disableLabel = () => {
  if (labelRef.value) {
    labelRef.value.classList.add('BGC-input-disabled');
    labelRef.value.classList.remove('BGC-branco');
  }
};

const enableLabel = () => {
  if (labelRef.value) {
    labelRef.value.classList.remove('BGC-input-disabled');
    labelRef.value.classList.add('BGC-branco');
  }
};

const habilitar = () => {
  if (selectRef) {
    enableLabel();
    enableSelect();
  }
};

const desabilitar = () => {
  if (selectRef) {
    disableLabel();
    disableSelect();
  }
};

const addDivClass = (classe) => {
  if (divRef.value && !divRef.value.classList.contains(classe)) {
    divRef.value.classList.add(classe);
  }
};

const removeDivClass = (classe) => {
  if (divRef.value && divRef.value.classList.contains(classe)) {
    divRef.value.classList.remove(classe);
  }
};

const PaintBackGroundColorOpcaoLista = (index, color) => {
  const options = document.querySelectorAll('.vs__dropdown-option');
  const el = options[index];
  if (el) el.style.backgroundColor = hexToRgba(color, 0.4);
};

const MarcarOpcaoSelecionadaComClasse = (classe = 'green-option') => {
  const root = rootRef.value?.$el || rootRef.value;
  if (!root) return;

  // remove classe anterior, caso exista
  const prev = root.querySelector(`.${classe}`);
  if (prev) prev.classList.remove(classe);

  // adiciona no item atual selecionado
  const selected = root.querySelector('.vs__selected');
  if (selected) {
    selected.classList.add(classe);
  }
};


// const PaintBackGroundColor = (index) => {
//   const options = document.querySelectorAll('.vs__dropdown-option');
//   const el = options[index];
//   if (el) {
//     el.classList.add('green-option');
//   }
// };


const hexToRgba = (hex, alpha = 0.4) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const bigint = parseInt(c, 16);
  return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${alpha})`;
};

// Adiciona e remove classe na label
const addLabelClass = (classe) => {
  if (labelRef.value && !labelRef.value.classList.contains(classe)) {
    labelRef.value.classList.add(classe);
  }
};

const removeLabelClass = (classe) => {
  if (labelRef.value && labelRef.value.classList.contains(classe)) {
    labelRef.value.classList.remove(classe);
  }
};

// Adiciona e remove classe no select
const addSelectClass = (classe) => {
  if (selectRef.value && !selectRef.value.$el.classList.contains(classe)) {
    selectRef.value.$el.classList.add(classe);
  }
};

const removeSelectClass = (classe) => {
  if (selectRef.value && selectRef.value.$el.classList.contains(classe)) {
    selectRef.value.$el.classList.remove(classe);
  }
};

watch(isDisabled, async (novoValor) => {
  await nextTick();
  const dropdown = selectRef.value?.$el?.querySelector('.vs__dropdown-toggle');
  const meiodoSelect = selectRef.value?.$el?.querySelector('.vs__open-indicator');
  const indicador = selectRef.value?.$el?.querySelector('.vs__search');
  if (dropdown) {
    dropdown.style.backgroundColor = novoValor ? '#e9ecef' : 'white';
    meiodoSelect.style.backgroundColor = novoValor ? '#e9ecef' : 'white';
    indicador.style.backgroundColor = novoValor ? '#e9ecef' : 'white';
  }
});


// keyup handler
const defineKeyup = (event) => {
  emit('keyup', event); // Emite o evento 'keyup' com o parâmetro 'event'
};

const focusInput = () => {
  nextTick(() => {
    const inputEl = selectRef.value?.$el?.querySelector('input');
    if (inputEl) {
      inputEl.focus();
      inputEl.dispatchEvent(new Event('click')); // dispara o dropdown
    }
  });
};

const addRemoveEstilosObrigatorios = () => {
  const valor = modelValueProxy.value;

  const dropdownEl = selectRef.value?.$el?.querySelector('.vs__dropdown-toggle');

  if (!dropdownEl) return;

  if (!valor || valor.toString().trim() === '') {
    // Adiciona a borda vermelha
    dropdownEl.classList.add('required-red-border');

    // Dá foco no componente
    focusInput();
  } else {
    // Remove a borda vermelha, se existir
    dropdownEl.classList.remove('required-red-border');
  }
};

const isLoadingInputValue = (bool) => {
  isLoading.value = bool;
  (bool || isDisabled.value) ? disableLabel() : enableLabel();
};

// Método para selecionar a primeira correspondência ao apertar TAB ou clicar fora
const selectFirstMatch = async (event) => {
  const inputElement = event.target;
  
  const highlightedOption = document.querySelector('.vs__dropdown-option--highlight');
  
  // Permite sair se o campo estiver vazio e se nao existir o highlightedOption
  if (!inputElement.value.trim() && !highlightedOption) {
    return;
  }

  // Se não houver opção destacada, mantém o foco no campo e interrompe a saída
  if (!highlightedOption) {
    event.preventDefault();
    setTimeout(() => focusInput(), 0);
    return;
  }

  const selectedText = highlightedOption.textContent.trim();

  // Busca o objeto que corresponde ao texto selecionado
  const matchedOption = props.options.find(opt =>
    opt[props.optionLabel].toLowerCase().trim() === selectedText.toLowerCase()
  );

  // Se encontrar, atualiza o v-model
  if (matchedOption) {
    modelValueProxy.value = matchedOption;
  }
};

// Aciona a seleção ao pressionar TAB
const onKeyDown = (event) => {
  if (event.key === "Tab") {
    selectFirstMatch(event);
  }
};

// Também aciona a seleção ao perder o foco, mas só se não estiver vazio
const onBlur = async (event) => {
  if (event.target.value.trim()) {
    await selectFirstMatch(event);
  }
};

// Remove qualquer highlighted
const internalOnOpen = () => {
  // Remove highlight das opções
  const highlighted = document.querySelectorAll('.vs__dropdown-option--highlight');
  highlighted.forEach(el => el.classList.remove('vs__dropdown-option--highlight'));

  // Limpa input
  const input = document.querySelector('.vs__search');
  if (input) {
    input.value = '';
  }

  // Evita highlight interno automático
  setTimeout(() => {
    const internalHighlighted = document.querySelectorAll('.vs__dropdown-option--highlight');
    internalHighlighted.forEach(el => el.classList.remove('vs__dropdown-option--highlight'));
  }, 0);
};

const handleOpen = () => {
  // 1. Executa o fixo
  internalOnOpen();

  // 2. Depois dispara o evento 'open' para o pai
  emit('open');
};



// Manage keyup listener on internal input
const addKeyupListener = () => {
  setTimeout(() => {
    const input = selectRef.value?.$el.querySelector('input');
    if (input) input.addEventListener('keyup', defineKeyup);
  });
};
const removeKeyupListener = () => {
  const input = selectRef.value?.$el.querySelector('input');
  if (input) input.removeEventListener('keyup', defineKeyup);
};


onMounted(addKeyupListener);
onBeforeUnmount(removeKeyupListener);

// Expondo as funções para o componente pai
defineExpose({
  habilitar,
  desabilitar,
  enableSelect,
  getDivClass: () => props.divClass,
  addDivClass,
  removeDivClass,
  PaintBackGroundColorOpcaoLista,
  // PaintBackGroundColorOpcaoListaSelecionado,
  MarcarOpcaoSelecionadaComClasse,
  addLabelClass,
  removeLabelClass,
  addSelectClass,
  removeSelectClass,
  isLoadingInputValue,
  focusInput,
  addRemoveEstilosObrigatorios,
});

// -----------------------------------------------------------------------------------------------/
</script>

<template>
  <div ref="divRef" :class="['input-group-sm POSITION-relative', divClass]">
    <label ref="labelRef"
      :class="['form-label BORRAD-5 FWEIGHT-bold PADDING-R5-L5 label-sobreposta BGC-branco', labelClass]"
    >{{ label }}</label>

    <div v-if="isLoading"
      :class="['loading-div TEXTALI-center BOR-grey BORRAD-5 BGC-input-disabled', selectClass, loadingClass]"
      style="margin-right: 10px; "    
    >
      <img src="/assets/images/gif-carregamento-horizontal.gif" alt="Carregando..." class=""
        style="width: 20px; max-height: 20px;"/>
    </div>

    <v3-select v-else
      ref="selectRef"
      :class="['form-control BORRAD-5 MARGIN-T-10 BOR-none BGC-transparent PADDING-L-9 ', selectClass]"
      :style="{ '--dropdown-width': widthLista }"
      v-model="modelValueProxy"
      :title="titulo"
      :options="options"
      :label="optionLabel"
      :filterable="filterable"
      :disabled="isDisabled"
      @search="(val) => $emit('search', val)"
      @close="() => $emit('close')"
      @open="handleOpen"
      @keydown="onKeyDown"
      @blur="onBlur"
    >
      <!-- @open="() => $emit('open')" -->
      <template #no-options>
        {{ noOptionsText }}
      </template>
    </v3-select>
  </div>
</template>

<style scoped>
.label-sobreposta {
  position: absolute;
  top: -1px;
  left: 10px;
  padding: 0 4px;
  z-index: 10;
}

.loading-div {
  max-height: 31px !important;
  height: 31px !important;
  /* width: 90%; */
}

/* Input (Esse precisa ter o max-height customizavel para cada instanciação) */
::v-deep(.vs__dropdown-toggle) {
  max-height: 31px !important;
  height: 31px !important;
  border: 1px solid gray;
  text-transform: uppercase;
  background-color: white;
  /* width: 100% + 100px; */
  margin-left: -9px;
  /* border: 1px solid red; */
/* background-color: rgba(0, 128, 0, 0.4) !important; */


}

/* Texto que aparece enquanto digitamos (Esse precisa ter o font-size customizavel para cada instanciação) */
::v-deep(.vs__search) {
  font-size: 14px !important;
  text-transform: uppercase;
  background-color: white;

}

/* Aqui é o texto que aparece quando esta selecionado */
::v-deep(.vs__selected) {
  font-size: 14px !important;
  text-transform: uppercase;
}

::v-deep(.vs__open-indicator) {
  background-color: white; /* muda a cor da setinha */
  margin: 0px;
  cursor: pointer;
  /* border: 1px solid red; */

}

/* Esse aqui é fixo para todos */
::v-deep(.vs__dropdown-option) {
  padding: 4px 8px !important;
  font-size: 14px !important;
/* border: 1px solid red; */
}

/* Esse aqui é fixo para todos */
::v-deep(.vs__dropdown-option--highlight) {
  background-color: yellow !important;
  color: black !important;
  font-weight: bold;
}

/* Aumenta a largura da lista */
::v-deep(.vs__dropdown-menu) {
  width: var(--dropdown-width, 100%) !important;
  max-height: 300px !important;  /* Mantém o limite de altura com scroll */
  
}

.green-option {
  background-color: rgba(0, 128, 0, 0.4);
}
</style>
