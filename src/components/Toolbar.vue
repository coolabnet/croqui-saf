<template>
  <div class="toolbar">
    <div class="toolbar-section">
      <h1 class="toolbar-title">🌱 Croqui SAF</h1>
      <div class="project-name">
        <input
          v-model="projectName"
          @change="onProjectNameChange"
          class="project-name-input"
          placeholder="Nome do projeto"
        />
      </div>
    </div>

    <div class="toolbar-section toolbar-controls">
      <!-- Controles de Zoom -->
      <div class="control-group">
        <button class="btn btn-outline" @click="$emit('zoom-out')" title="Zoom Out">
          🔍−
        </button>
        <button class="btn btn-outline" @click="$emit('reset-view')" title="Resetar Visualização">
          ↺
        </button>
        <button class="btn btn-outline" @click="$emit('zoom-in')" title="Zoom In">
          🔍+
        </button>
      </div>

      <!-- Grid -->
      <div class="control-group">
        <button
          class="btn"
          :class="showGrid ? 'btn-primary' : 'btn-outline'"
          @click="$emit('toggle-grid')"
          title="Alternar Grid"
        >
          {{ showGrid ? '⊞' : '⊟' }} Grid
        </button>
      </div>

      <!-- Undo/Redo -->
      <div class="control-group">
        <button
          class="btn btn-outline"
          @click="$emit('undo')"
          :disabled="!canUndo"
          title="Desfazer (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          class="btn btn-outline"
          @click="$emit('redo')"
          :disabled="!canRedo"
          title="Refazer (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      <!-- Ações -->
      <div class="control-group">
        <button class="btn btn-secondary" @click="$emit('export-image')" title="Exportar como PNG">
          📷 Exportar
        </button>
        <button class="btn btn-outline" @click="$emit('save-project')" title="Salvar Projeto">
          💾 Salvar
        </button>
        <button class="btn btn-outline" @click="$emit('load-project')" title="Carregar Projeto">
          📂 Carregar
        </button>
        <button class="btn btn-danger" @click="$emit('clear-canvas')" title="Limpar Canvas">
          🗑️ Limpar
        </button>
      </div>

      <!-- Dimensões -->
      <div class="control-group terrain-dimensions">
        <label>Terreno:</label>
        <input
          type="number"
          v-model.number="localTerrainWidth"
          @change="onDimensionsChange"
          min="10"
          max="200"
          class="dimension-input"
        />
        <span>×</span>
        <input
          type="number"
          v-model.number="localTerrainHeight"
          @change="onDimensionsChange"
          min="10"
          max="200"
          class="dimension-input"
        />
        <span>m</span>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="toolbar-section stats">
      <div class="stat-item">
        <span class="stat-label">Área:</span>
        <span class="stat-value">{{ totalArea }}m²</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Plantas:</span>
        <span class="stat-value">{{ totalPlants }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  projectName: String,
  terrainWidth: Number,
  terrainHeight: Number,
  totalArea: Number,
  totalPlants: Number,
  showGrid: Boolean,
  canUndo: Boolean,
  canRedo: Boolean
})

const emit = defineEmits([
  'update:projectName',
  'update:terrainWidth',
  'update:terrainHeight',
  'zoom-in',
  'zoom-out',
  'reset-view',
  'toggle-grid',
  'undo',
  'redo',
  'export-image',
  'save-project',
  'load-project',
  'clear-canvas'
])

const projectName = ref(props.projectName)
const localTerrainWidth = ref(props.terrainWidth)
const localTerrainHeight = ref(props.terrainHeight)

watch(() => props.projectName, (val) => {
  projectName.value = val
})

watch(() => props.terrainWidth, (val) => {
  localTerrainWidth.value = val
})

watch(() => props.terrainHeight, (val) => {
  localTerrainHeight.value = val
})

function onProjectNameChange() {
  emit('update:projectName', projectName.value)
}

function onDimensionsChange() {
  emit('update:terrainWidth', localTerrainWidth.value)
  emit('update:terrainHeight', localTerrainHeight.value)
}
</script>

<style scoped>
.toolbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  white-space: nowrap;
}

.project-name {
  display: flex;
  align-items: center;
}

.project-name-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  width: 200px;
}

.toolbar-controls {
  flex: 1;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 12px;
  border-right: 1px solid #e5e7eb;
}

.control-group:last-child {
  border-right: none;
}

.control-group button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.terrain-dimensions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.terrain-dimensions label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

.dimension-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

.stats {
  margin-left: auto;
  gap: 20px;
  border-left: 2px solid #10b981;
  padding-left: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #10b981;
}

@media (max-width: 1200px) {
  .toolbar {
    padding: 12px 16px;
  }

  .control-group {
    padding: 0 8px;
  }

  .stats {
    width: 100%;
    margin-left: 0;
    border-left: none;
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    padding-left: 0;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 8px 12px;
    gap: 12px;
  }
  
  .toolbar-section {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toolbar-title {
    font-size: 16px;
  }
  
  .project-name-input {
    width: 150px;
    font-size: 13px;
    padding: 6px 10px;
  }
  
  .toolbar-controls {
    width: 100%;
    justify-content: flex-start;
  }
  
  .control-group {
    padding: 0 6px;
    border-right: none;
    margin-bottom: 8px;
  }
  
  .control-group button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .terrain-dimensions {
    flex-wrap: wrap;
  }
  
  .terrain-dimensions label {
    width: 100%;
    font-size: 12px;
  }
  
  .dimension-input {
    width: 50px;
    font-size: 12px;
  }
  
  .stats {
    gap: 12px;
    padding-top: 8px;
  }
  
  .stat-label {
    font-size: 10px;
  }
  
  .stat-value {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .toolbar-title {
    width: 100%;
    text-align: center;
  }
  
  .project-name {
    width: 100%;
  }
  
  .project-name-input {
    width: 100%;
  }
  
  .control-group {
    width: auto;
    flex-wrap: wrap;
  }
  
  .control-group button {
    font-size: 11px;
    padding: 5px 8px;
  }
}
</style>
