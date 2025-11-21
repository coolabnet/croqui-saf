<template>
  <div class="canvas-container">
    <div class="canvas-wrapper" ref="wrapperRef">
      <svg
        ref="svgRef"
        class="canvas-svg"
        :width="viewBoxWidth"
        :height="viewBoxHeight"
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        @mousedown="onCanvasMouseDown"
        @mousemove="onCanvasMouseMove"
        @mouseup="onCanvasMouseUp"
        @mouseleave="onCanvasMouseUp"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @wheel.prevent="onWheel"
        @drop.prevent="onDrop"
        @dragover.prevent
      >
        <!-- Grid -->
        <g v-if="showGrid" class="grid">
          <defs>
            <pattern
              id="grid"
              :width="gridSize * scale"
              :height="gridSize * scale"
              patternUnits="userSpaceOnUse"
            >
              <rect
                :width="gridSize * scale"
                :height="gridSize * scale"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </g>

        <!-- Background -->
        <rect
          width="100%"
          height="100%"
          :fill="showGrid ? 'transparent' : '#f9fafb'"
        />

        <!-- Área do terreno -->
        <rect
          :x="offset.x"
          :y="offset.y"
          :width="terrainWidth * scale"
          :height="terrainHeight * scale"
          fill="#e8f5e9"
          stroke="#4caf50"
          stroke-width="2"
          stroke-dasharray="5,5"
          opacity="0.3"
        />

        <!-- Plantas posicionadas -->
        <g
          v-for="plant in placedPlants"
          :key="plant.id"
          :transform="`translate(${plant.x * scale + offset.x}, ${plant.y * scale + offset.y})`"
          @mousedown.stop="onPlantMouseDown(plant, $event)"
          @touchstart.stop="onPlantTouchStart(plant, $event)"
          @mouseenter="onPlantMouseEnter(plant, $event)"
          @mouseleave="onPlantMouseLeave"
          class="plant-item"
          :class="{ selected: selectedPlantId === plant.id }"
        >
          <!-- Copa da planta -->
          <circle
            :r="plant.canopyRadius * scale"
            :fill="plant.color"
            opacity="0.2"
            stroke="none"
          />
          <circle
            :r="plant.canopyRadius * scale"
            fill="none"
            :stroke="plant.color"
            stroke-width="1.5"
            opacity="0.5"
          />
          
          <!-- Ícone da planta -->
          <text
            text-anchor="middle"
            dominant-baseline="middle"
            :font-size="Math.max(20, plant.canopyRadius * scale * 0.5)"
            style="pointer-events: none; user-select: none;"
          >
            {{ plant.icon }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible"
      class="tooltip"
      :style="{
        left: tooltip.x + 'px',
        top: tooltip.y + 'px'
      }"
    >
      <div style="font-weight: 600;">{{ tooltip.plant?.plantName }}</div>
      <div style="font-size: 11px; opacity: 0.8;">
        {{ tooltip.plant?.scientificName }}
      </div>
      <div style="font-size: 11px; margin-top: 4px;">
        Copa: {{ tooltip.plant?.canopyRadius }}m
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProject } from '../composables/useProject'

const props = defineProps({
  terrainWidth: { type: Number, required: true },
  terrainHeight: { type: Number, required: true },
  showGrid: { type: Boolean, default: true },
  gridSize: { type: Number, default: 1 }
})

const emit = defineEmits(['plant-selected', 'plant-deleted'])

const {
  placedPlants,
  addPlantToCanvas,
  updatePlantPosition,
  removePlantFromCanvas
} = useProject()

// Refs
const svgRef = ref(null)
const wrapperRef = ref(null)

// Canvas state
const viewBoxWidth = ref(1000)
const viewBoxHeight = ref(800)
const scale = ref(10) // pixels por metro
const offset = ref({ x: 50, y: 50 })

// Interação
const isPanning = ref(false)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const selectedPlantId = ref(null)
const draggedPlant = ref(null)

// Tooltip
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  plant: null
})

// Ajustar viewBox ao container
function updateViewBox() {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect()
    viewBoxWidth.value = rect.width
    viewBoxHeight.value = rect.height
  }
}

onMounted(() => {
  updateViewBox()
  window.addEventListener('resize', updateViewBox)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewBox)
  window.removeEventListener('keydown', onKeyDown)
})

// Zoom
function onWheel(event) {
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const newScale = scale.value * delta
  
  // Limitar zoom
  if (newScale >= 5 && newScale <= 50) {
    scale.value = newScale
  }
}

// Pan do canvas
function onCanvasMouseDown(event) {
  if (event.button === 0 && !event.target.closest('.plant-item')) {
    isPanning.value = true
    dragStart.value = {
      x: event.clientX - offset.value.x,
      y: event.clientY - offset.value.y
    }
    selectedPlantId.value = null
    emit('plant-selected', null)
  }
}

function onCanvasMouseMove(event) {
  if (isPanning.value) {
    offset.value = {
      x: event.clientX - dragStart.value.x,
      y: event.clientY - dragStart.value.y
    }
  } else if (isDragging.value && draggedPlant.value) {
    const svgRect = svgRef.value.getBoundingClientRect()
    const x = ((event.clientX - svgRect.left) - offset.value.x) / scale.value
    const y = ((event.clientY - svgRect.top) - offset.value.y) / scale.value
    
    // Limitar às dimensões do terreno
    const clampedX = Math.max(0, Math.min(props.terrainWidth, x))
    const clampedY = Math.max(0, Math.min(props.terrainHeight, y))
    
    updatePlantPosition(draggedPlant.value.id, clampedX, clampedY)
  }
}

function onCanvasMouseUp() {
  isPanning.value = false
  isDragging.value = false
  draggedPlant.value = null
}

// Arrastar planta existente
function onPlantMouseDown(plant, event) {
  if (event.button === 0) {
    event.stopPropagation()
    selectedPlantId.value = plant.id
    emit('plant-selected', plant)
    
    isDragging.value = true
    draggedPlant.value = plant
  }
}

// Drop de nova planta
function onDrop(event) {
  const plantData = event.dataTransfer.getData('plant')
  if (plantData) {
    const plant = JSON.parse(plantData)
    const svgRect = svgRef.value.getBoundingClientRect()
    const x = ((event.clientX - svgRect.left) - offset.value.x) / scale.value
    const y = ((event.clientY - svgRect.top) - offset.value.y) / scale.value
    
    // Verificar se está dentro do terreno
    if (x >= 0 && x <= props.terrainWidth && y >= 0 && y <= props.terrainHeight) {
      addPlantToCanvas(plant, x, y)
    }
  }
}

// Tooltip
function onPlantMouseEnter(plant, event) {
  tooltip.value = {
    visible: true,
    x: event.clientX + 10,
    y: event.clientY + 10,
    plant
  }
}

function onPlantMouseLeave() {
  tooltip.value.visible = false
}

// Teclado
function onKeyDown(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (selectedPlantId.value) {
      removePlantFromCanvas(selectedPlantId.value)
      emit('plant-deleted', selectedPlantId.value)
      selectedPlantId.value = null
    }
  }
}

// Touch events
let touchStartTime = 0
let lastTouchPlant = null

function onTouchStart(event) {
  touchStartTime = Date.now()
  if (event.touches.length === 1 && !event.target.closest('.plant-item')) {
    const touch = event.touches[0]
    isPanning.value = true
    dragStart.value = {
      x: touch.clientX - offset.value.x,
      y: touch.clientY - offset.value.y
    }
    selectedPlantId.value = null
    emit('plant-selected', null)
  }
}

function onTouchMove(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    if (isPanning.value) {
      offset.value = {
        x: touch.clientX - dragStart.value.x,
        y: touch.clientY - dragStart.value.y
      }
    } else if (isDragging.value && draggedPlant.value) {
      const svgRect = svgRef.value.getBoundingClientRect()
      const x = ((touch.clientX - svgRect.left) - offset.value.x) / scale.value
      const y = ((touch.clientY - svgRect.top) - offset.value.y) / scale.value
      
      const clampedX = Math.max(0, Math.min(props.terrainWidth, x))
      const clampedY = Math.max(0, Math.min(props.terrainHeight, y))
      
      updatePlantPosition(draggedPlant.value.id, clampedX, clampedY)
    }
  }
}

function onTouchEnd() {
  isPanning.value = false
  isDragging.value = false
  draggedPlant.value = null
}

function onPlantTouchStart(plant, event) {
  event.stopPropagation()
  const touchTime = Date.now()
  
  // Detectar toque duplo
  if (lastTouchPlant === plant.id && (touchTime - touchStartTime) < 300) {
    // Toque duplo - excluir planta
    if (confirm(`Excluir ${plant.plantName}?`)) {
      removePlantFromCanvas(plant.id)
      emit('plant-deleted', plant.id)
    }
    lastTouchPlant = null
  } else {
    // Toque simples - selecionar e preparar para arrastar
    selectedPlantId.value = plant.id
    emit('plant-selected', plant)
    isDragging.value = true
    draggedPlant.value = plant
    lastTouchPlant = plant.id
  }
  
  touchStartTime = touchTime
}

// Expor métodos
defineExpose({
  resetView() {
    scale.value = 10
    offset.value = { x: 50, y: 50 }
  },
  zoomIn() {
    scale.value = Math.min(scale.value * 1.2, 50)
  },
  zoomOut() {
    scale.value = Math.max(scale.value * 0.8, 5)
  }
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

.canvas-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.canvas-svg:active {
  cursor: grabbing;
}

.plant-item {
  cursor: move;
  transition: opacity 0.2s;
}

.plant-item:hover {
  opacity: 0.9;
}

.plant-item.selected circle:last-of-type {
  stroke: #2563eb !important;
  stroke-width: 3;
  opacity: 1;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .canvas-container {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x pan-y;
  }
  
  .canvas-wrapper {
    min-height: 100%;
    min-width: 100%;
  }
  
  .canvas-svg {
    min-height: 600px;
    cursor: default;
  }
  
  .plant-item {
    cursor: pointer;
  }
}

@media (max-width: 480px) {
  .canvas-svg {
    min-height: 500px;
  }
}
</style>
