<template>
  <div class="app">
    <!-- Barra de Ferramentas -->
    <Toolbar
      :projectName="currentProject.name"
      :terrainWidth="currentProject.terrainWidth"
      :terrainHeight="currentProject.terrainHeight"
      :totalArea="totalArea"
      :totalPlants="placedPlants.length"
      :showGrid="showGrid"
      :canUndo="canUndo"
      :canRedo="canRedo"
      @update:projectName="setProjectName"
      @update:terrainWidth="(val) => setTerrainDimensions(val, currentProject.terrainHeight)"
      @update:terrainHeight="(val) => setTerrainDimensions(currentProject.terrainWidth, val)"
      @zoom-in="handleZoomIn"
      @zoom-out="handleZoomOut"
      @reset-view="handleResetView"
      @toggle-grid="showGrid = !showGrid"
      @undo="undo"
      @redo="redo"
      @export-image="handleExportImage"
      @save-project="handleSaveProject"
      @load-project="handleLoadProject"
      @clear-canvas="handleClearCanvas"
    />

    <!-- Área Principal -->
    <div class="main-content">
      <!-- Biblioteca de Plantas -->
      <PlantLibrary @add-plant="showPlantForm = true" />

      <!-- Canvas -->
      <SafCanvas
        ref="canvasRef"
        :terrainWidth="currentProject.terrainWidth"
        :terrainHeight="currentProject.terrainHeight"
        :showGrid="showGrid"
        :gridSize="1"
      />

      <!-- Painel Lateral Direito (Info da Planta Selecionada) -->
      <div class="info-panel" v-if="selectedPlant">
        <div class="info-header">
          <h3>Planta Selecionada</h3>
          <button class="btn btn-outline" @click="selectedPlant = null">×</button>
        </div>
        <div class="info-content">
          <div class="plant-detail">
            <div class="plant-detail-icon" :style="{ backgroundColor: selectedPlant.color + '20' }">
              {{ selectedPlant.icon }}
            </div>
            <div>
              <div class="plant-detail-name">{{ selectedPlant.plantName }}</div>
              <div class="plant-detail-scientific">{{ selectedPlant.scientificName }}</div>
            </div>
          </div>
          <div class="plant-properties">
            <div class="property">
              <span class="property-label">Categoria:</span>
              <span class="property-value">{{ selectedPlant.category }}</span>
            </div>
            <div class="property">
              <span class="property-label">Raio da Copa:</span>
              <span class="property-value">{{ selectedPlant.canopyRadius }}m</span>
            </div>
            <div class="property">
              <span class="property-label">Posição:</span>
              <span class="property-value">
                X: {{ selectedPlant.x.toFixed(1) }}m, Y: {{ selectedPlant.y.toFixed(1) }}m
              </span>
            </div>
          </div>
          <button class="btn btn-danger" @click="handleDeleteSelectedPlant" style="width: 100%;">
            🗑️ Excluir Planta
          </button>
        </div>

        <!-- Contador de Plantas -->
        <div class="plant-counter">
          <h4>Contagem de Plantas</h4>
          <div class="counter-list">
            <div v-for="(count, plantId) in plantCount" :key="plantId" class="counter-item">
              <span class="counter-name">{{ getPlantName(plantId) }}</span>
              <span class="counter-value">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulário de Planta -->
    <PlantForm
      v-if="showPlantForm"
      @close="showPlantForm = false"
      @added="handlePlantAdded"
    />

    <!-- Notification Toast -->
    <div v-if="notification.visible" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SafCanvas from './components/SafCanvas.vue'
import PlantLibrary from './components/PlantLibrary.vue'
import PlantForm from './components/PlantForm.vue'
import Toolbar from './components/Toolbar.vue'
import { useProject } from './composables/useProject'
import { usePlants } from './composables/usePlants'

const {
  currentProject,
  placedPlants,
  plantCount,
  totalArea,
  setTerrainDimensions,
  setProjectName,
  removePlantFromCanvas,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  exportProject,
  importProject,
  newProject
} = useProject()

const { plants } = usePlants()

// Refs
const canvasRef = ref(null)
const showPlantForm = ref(false)
const showGrid = ref(true)
const selectedPlant = ref(null)

// Notification
const notification = ref({
  visible: false,
  message: '',
  type: 'success'
})

function showNotification(message, type = 'success') {
  notification.value = {
    visible: true,
    message,
    type
  }
  setTimeout(() => {
    notification.value.visible = false
  }, 3000)
}

// Canvas controls
function handleZoomIn() {
  canvasRef.value?.zoomIn()
}

function handleZoomOut() {
  canvasRef.value?.zoomOut()
}

function handleResetView() {
  canvasRef.value?.resetView()
}

// Plant actions
function handlePlantAdded(plant) {
  showNotification(`Planta "${plant.name}" adicionada com sucesso!`)
}

function handleDeleteSelectedPlant() {
  if (selectedPlant.value) {
    removePlantFromCanvas(selectedPlant.value.id)
    showNotification('Planta removida do canvas', 'info')
    selectedPlant.value = null
  }
}

function handleClearCanvas() {
  if (placedPlants.value.length === 0) {
    showNotification('O canvas já está vazio', 'info')
    return
  }

  if (confirm('Tem certeza que deseja limpar todo o canvas?')) {
    clearCanvas()
    selectedPlant.value = null
    showNotification('Canvas limpo com sucesso', 'info')
  }
}

// Export/Import
function handleExportImage() {
  try {
    const svg = canvasRef.value.$el.querySelector('svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = svg.width.baseVal.value
    canvas.height = svg.height.baseVal.value

    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentProject.value.name || 'croqui-saf'}.png`
        a.click()
        URL.revokeObjectURL(url)
        showNotification('Imagem exportada com sucesso!')
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  } catch (error) {
    console.error('Erro ao exportar imagem:', error)
    showNotification('Erro ao exportar imagem', 'error')
  }
}

function handleSaveProject() {
  try {
    const projectData = exportProject()
    const blob = new Blob([projectData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentProject.value.name || 'projeto'}.json`
    a.click()
    URL.revokeObjectURL(url)
    showNotification('Projeto salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar projeto:', error)
    showNotification('Erro ao salvar projeto', 'error')
  }
}

function handleLoadProject() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const success = importProject(event.target.result)
          if (success) {
            selectedPlant.value = null
            showNotification('Projeto carregado com sucesso!')
          } else {
            showNotification('Erro ao carregar projeto', 'error')
          }
        } catch (error) {
          console.error('Erro ao carregar projeto:', error)
          showNotification('Erro ao carregar projeto', 'error')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// Utils
function getPlantName(plantId) {
  const plant = plants.value.find(p => p.id === plantId)
  return plant?.name || 'Desconhecida'
}

// Keyboard shortcuts
function onKeyDown(event) {
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'z' && !event.shiftKey) {
      event.preventDefault()
      undo()
    } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
      event.preventDefault()
      redo()
    } else if (event.key === 's') {
      event.preventDefault()
      handleSaveProject()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.info-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.info-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h3 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.info-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant-detail {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.plant-detail-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.plant-detail-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.plant-detail-scientific {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

.plant-properties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.property-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.property-value {
  font-size: 13px;
  color: #111827;
  font-weight: 600;
}

.plant-counter {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.plant-counter h4 {
  font-size: 14px;
  color: #111827;
  margin: 0 0 12px 0;
}

.counter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.counter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.counter-name {
  font-size: 13px;
  color: #374151;
}

.counter-value {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
  background: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  border-left: 4px solid #10b981;
  color: #065f46;
}

.notification.error {
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.notification.info {
  border-left: 4px solid #3b82f6;
  color: #1e40af;
}
</style>
