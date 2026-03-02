<template>
  <div class="D-flex JC-center ALITEM-center HEIGHT-100"
    :style="{ '--pagination-color': color }">
    <nav class="D-flex JC-space-between ALITEM-center WIDTH-100">
      <!-- ANTERIOR -->
      <button
        class="nav-btn WIDTH-10 D-flex ALITEM-center JC-flex-start"
        :disabled="!enabled || currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        &lt; Anterior
      </button>

      <!-- NÚMEROS -->
      <div class="pagination WIDTH-80 D-flex JC-center ALITEM-center">
        <button
          v-for="item in pagesToShow"
          :key="item.key"
          class="page"
          :class="{ active: item.page === currentPage, dots: item.dots }"
          :disabled="!enabled || item.dots"
          @click="changePage(item.page)"
        >
          {{ item.label }}
        </button>
      </div>

      <!-- PRÓXIMO -->
      <button
        class="nav-btn WIDTH-10 D-flex ALITEM-center JC-flex-end"
        :disabled="!enabled || currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Próximo &gt;
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue"

/* PROPS */
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#1a3d8f'
  }
})

/* EMITS */
const emit = defineEmits(["update:currentPage", "page-change"])

/* COMPUTED */
const pagesToShow = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage

  // Até 7 páginas: mostra tudo
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(pageItem(i))
    }
    return pages
  }

  const range = 2
  let start = current - range
  let end = current + range

  if (start < 2) {
    start = 2
    end = start + range * 2
  }

  if (end > total - 1) {
    end = total - 1
    start = end - range * 2
  }

  // Primeira página
  pages.push(pageItem(1))

  if (start > 2) pages.push(dotsItem("start-dots"))

  for (let i = start; i <= end; i++) {
    pages.push(pageItem(i))
  }

  if (end < total - 1) pages.push(dotsItem("end-dots"))

  // Última página
  pages.push(pageItem(total))

  return pages
})

/* METHODS */
function pageItem(page) {
  return {
    key: `page-${page}`,
    page,
    label: page,
    dots: false
  }
}

function dotsItem(key) {
  return {
    key,
    page: null,
    label: "...",
    dots: true
  }
}

function changePage(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return

  emit("update:currentPage", page)
  emit("page-change", page)
}
</script>

<style scoped>

/* Wrapper geral */
.pagination-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Botões anterior / próximo */
.nav-btn {
  background: none;
  border: none;
  font-size: 14px;
  /* color: var(--pagination-color); */
  cursor: pointer;
}



.nav-btn:disabled {
  color: #aaa;
  cursor: default;
}

/* Centraliza os números */
.pagination {
  display: flex;
  gap: 12px;
  margin: 0 auto; /* 🔥 isso gruda os botões nos lados */
}

/* Números */
.page {
  background: none;
  border: none;
  padding: 2px 4px 1px 4px;
  font-size: 16px;
  color: #555;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.page.active {
  font-weight: 700;
  color: var(--pagination-color);
  border-bottom: 2px solid var(--pagination-color);
}

.page.dots {
  cursor: default;
  color: #999;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
