<template>
  <nav>
    <ul class="pagination">
      <!-- Botões "Primeiro" e "Anterior" -->
      <li class="page-item group">
        <button class="page-link" 
                @click="mudarPagina(1)" 
                :class="{ disabled: paginaAtual === 1 || desabilitarPaginacao }">
          Primeiro
        </button>
        <button class="page-link" 
                @click="mudarPagina(paginaAtual - 1)" 
                :class="{ disabled: paginaAtual === 1 || desabilitarPaginacao }">
          <
        </button>
      </li>

      <!-- Contêiner dos números da página -->
      <div class="page-numbers">
        <li
          v-for="pagina in paginasVisiveis"
          :key="pagina"
          class="page-item"
          :class="{ active: pagina === paginaAtual }"
        >
          <button 
            v-if="typeof pagina === 'number'" 
            class="page-link" 
            @click="mudarPagina(pagina)"
            :class="{ disabled: desabilitarPaginacao }"
          >
            {{ pagina }}
          </button>
          <span v-else class="page-dots">...</span>
        </li>
      </div>

      <!-- Botões "Próximo" e "Último" -->
      <li class="page-item group">
        <button class="page-link" 
                @click="mudarPagina(paginaAtual + 1)" 
                :class="{ disabled: paginaAtual === totalPaginas || desabilitarPaginacao }">
          >
        </button>
        <button class="page-link" 
                @click="mudarPagina(totalPaginas)" 
                :class="{ disabled: paginaAtual === totalPaginas || desabilitarPaginacao }">
          Último
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    paginaAtual: Number,
    totalPaginas: Number,
    desabilitarPaginacao: Boolean, // Nova prop
  },
  computed: {
    paginasVisiveis() {
      if (this.totalPaginas <= 6) {
        return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
      }

      const paginas = [];
      const ultimaPagina = this.totalPaginas;

      if (this.paginaAtual <= 3) {
        paginas.push(1, 2, 3, 4, "...", ultimaPagina);
      } else if (this.paginaAtual >= ultimaPagina - 2) {
        paginas.push(1, "...", ultimaPagina - 3, ultimaPagina - 2, ultimaPagina - 1, ultimaPagina);
      } else {
        paginas.push(1, "...", this.paginaAtual - 1, this.paginaAtual, this.paginaAtual + 1, "...", ultimaPagina);
      }

      return paginas;
    }
  },
  methods: {
    mudarPagina(novaPagina) {
      if (this.desabilitarPaginacao === true) return; // Bloqueia a navegação se estiver desabilitado
      if (typeof novaPagina === "number" && novaPagina > 0 && novaPagina <= this.totalPaginas) {
        this.$emit("update:paginaAtual", novaPagina);
      }
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  gap: 50px;
}

.page-item {
  display: flex;
  align-items: center;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.group {
  display: flex;
  gap: 5px;
}

.page-item .page-link {
  cursor: pointer;
  padding: 5px 12px;
  border: 1px solid #ccc;
  background: #fff;
  color: rgb(40, 52, 180);
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
}

/* Botão desativado */
.page-link.disabled {
  pointer-events: none; /* Impede clique */
  opacity: 0.5; /* Deixa o botão visualmente desabilitado */
  background: #f0f0f0; /* Tom mais claro */
  color: #999; /* Cor de texto mais clara */
  border-color: #ddd; /* Borda mais clara */
}

/* Botão ativo (página atual) */
.page-item.active .page-link {
  background: none;
  border-bottom: 3px solid rgb(40, 52, 180);
  border-radius: 0;
  font-weight: bold;
}

/* Desativando botões quando paginação estiver bloqueada */
.page-item.disabled .page-link {
  pointer-events: none; /* Impede clique */
  opacity: 0.5; /* Deixa o botão visualmente desabilitado */
  background: #f0f0f0; /* Tom mais claro */
  color: #999; /* Cor de texto mais clara */
  border-color: #ddd; /* Borda mais clara */
}

/* Estilizando os "..." */
.page-dots {
  font-size: 25px;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
}
</style>
