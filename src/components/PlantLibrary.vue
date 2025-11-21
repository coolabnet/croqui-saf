<template>
  <div class="plant-library">
    <div class="library-header">
      <h2>Biblioteca de Plantas</h2>
      <button class="btn btn-primary" @click="$emit('add-plant')">
        + Nova Planta
      </button>
    </div>

    <div class="search-box">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar plantas..."
        class="search-input"
      />
    </div>

    <div class="plants-list">
      <div
        v-for="category in visibleCategories"
        :key="category"
        class="category-group"
      >
        <div class="category-header">
          <h3>{{ categoryLabels[category] || category }}</h3>
          <span class="category-count">
            {{ filteredPlantsByCategory[category]?.length || 0 }}
          </span>
        </div>

        <div class="category-plants">
          <div
            v-for="plant in filteredPlantsByCategory[category]"
            :key="plant.id"
            class="plant-card"
            draggable="true"
            @dragstart="onDragStart(plant, $event)"
          >
            <div class="plant-icon" :style="{ backgroundColor: plant.color + '20' }">
              {{ plant.icon }}
            </div>
            <div class="plant-info">
              <div class="plant-name">{{ plant.name }}</div>
              <div class="plant-scientific">{{ plant.scientificName }}</div>
              <div class="plant-meta">
                <span>Copa: {{ plant.canopyRadius }}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="visibleCategories.length === 0" class="empty-state">
        <div>🔍</div>
        <p>Nenhuma planta encontrada</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlants } from '../composables/usePlants'

const emit = defineEmits(['add-plant'])

const { plants, plantsByCategory, categories } = usePlants()

const searchQuery = ref('')

const categoryLabels = {
  'emergente': '🌳 Emergente',
  'alto': '🌲 Alto',
  'médio': '🌴 Médio',
  'baixo': '🌿 Baixo',
  'rasteiro': '🍃 Rasteiro',
  'trepadeira': '🌱 Trepadeira'
}

const categoryOrder = ['emergente', 'alto', 'médio', 'baixo', 'rasteiro', 'trepadeira']

const filteredPlants = computed(() => {
  if (!searchQuery.value) return plants.value

  const query = searchQuery.value.toLowerCase()
  return plants.value.filter(plant =>
    plant.name.toLowerCase().includes(query) ||
    plant.scientificName?.toLowerCase().includes(query) ||
    plant.category?.toLowerCase().includes(query)
  )
})

const filteredPlantsByCategory = computed(() => {
  const result = {}
  filteredPlants.value.forEach(plant => {
    if (!result[plant.category]) {
      result[plant.category] = []
    }
    result[plant.category].push(plant)
  })
  return result
})

const visibleCategories = computed(() => {
  return categoryOrder.filter(cat => filteredPlantsByCategory.value[cat]?.length > 0)
})

function onDragStart(plant, event) {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('plant', JSON.stringify(plant))
}
</script>

<style scoped>
.plant-library {
  width: 320px;
  height: 100%;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.library-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.library-header h2 {
  font-size: 18px;
  color: #111827;
  margin: 0;
  flex: 1;
}

.search-box {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.plants-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.category-group {
  margin-bottom: 24px;
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.category-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.category-count {
  background: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.category-plants {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plant-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

.plant-card:hover {
  background: #f3f4f6;
  border-color: #10b981;
  transform: translateX(4px);
}

.plant-card:active {
  cursor: grabbing;
}

.plant-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.plant-info {
  flex: 1;
  min-width: 0;
}

.plant-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.plant-scientific {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plant-meta {
  font-size: 11px;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #9ca3af;
}

.empty-state div {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .plant-library {
    width: 100%;
    max-height: 50vh;
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .library-header {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .library-header h2 {
    font-size: 16px;
    text-align: center;
  }
  
  .library-header button {
    width: 100%;
    justify-content: center;
  }
  
  .search-box {
    padding: 12px 16px;
  }
  
  .plants-list {
    padding: 12px 16px;
  }
  
  .plant-card {
    padding: 10px;
  }
  
  .plant-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .plant-name {
    font-size: 13px;
  }
  
  .plant-scientific {
    font-size: 11px;
  }
  
  .plant-meta {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .plant-library {
    max-height: 45vh;
  }
  
  .library-header h2 {
    font-size: 14px;
  }
  
  .category-header h3 {
    font-size: 13px;
  }
}
</style>
