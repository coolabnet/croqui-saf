import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'saf-current-project'
const PROJECTS_LIST_KEY = 'saf-projects-list'

const currentProject = ref({
  name: 'Novo Projeto',
  terrainWidth: 50,
  terrainHeight: 50,
  placedPlants: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
})

const history = ref([])
const historyIndex = ref(-1)
const maxHistorySize = 50

// Carregar projeto atual do localStorage
function loadProject() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const project = JSON.parse(stored)
      currentProject.value = project
      // Inicializar histórico com estado atual
      history.value = [JSON.parse(JSON.stringify(project.placedPlants))]
      historyIndex.value = 0
    }
  } catch (error) {
    console.error('Erro ao carregar projeto:', error)
  }
}

// Salvar projeto no localStorage
function saveProject() {
  try {
    currentProject.value.updatedAt = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProject.value))
  } catch (error) {
    console.error('Erro ao salvar projeto:', error)
  }
}

export function useProject() {
  // Inicializar projeto se ainda não foi feito
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveProject()
  } else {
    loadProject()
  }

  // Salvar automaticamente quando o projeto mudar
  watch(currentProject, saveProject, { deep: true })

  const placedPlants = computed(() => currentProject.value.placedPlants)

  const plantCount = computed(() => {
    const counts = {}
    currentProject.value.placedPlants.forEach(pp => {
      counts[pp.plantId] = (counts[pp.plantId] || 0) + 1
    })
    return counts
  })

  const totalArea = computed(() => {
    return currentProject.value.terrainWidth * currentProject.value.terrainHeight
  })

  function addPlantToCanvas(plantData, x, y) {
    const placedPlant = {
      id: Date.now().toString() + Math.random(),
      plantId: plantData.id,
      plantName: plantData.name,
      scientificName: plantData.scientificName,
      icon: plantData.icon,
      color: plantData.color,
      canopyRadius: plantData.canopyRadius,
      category: plantData.category,
      x,
      y
    }
    currentProject.value.placedPlants.push(placedPlant)
    saveToHistory()
    return placedPlant
  }

  function updatePlantPosition(id, x, y) {
    const plant = currentProject.value.placedPlants.find(p => p.id === id)
    if (plant) {
      plant.x = x
      plant.y = y
      saveToHistory()
    }
  }

  function removePlantFromCanvas(id) {
    currentProject.value.placedPlants = currentProject.value.placedPlants.filter(p => p.id !== id)
    saveToHistory()
  }

  function clearCanvas() {
    currentProject.value.placedPlants = []
    saveToHistory()
  }

  function setTerrainDimensions(width, height) {
    currentProject.value.terrainWidth = width
    currentProject.value.terrainHeight = height
  }

  function setProjectName(name) {
    currentProject.value.name = name
  }

  // Sistema de histórico (undo/redo)
  function saveToHistory() {
    // Remover histórico futuro se estamos no meio da pilha
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // Adicionar novo estado
    const snapshot = JSON.parse(JSON.stringify(currentProject.value.placedPlants))
    history.value.push(snapshot)
    historyIndex.value++

    // Limitar tamanho do histórico
    if (history.value.length > maxHistorySize) {
      history.value.shift()
      historyIndex.value--
    }
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentProject.value.placedPlants = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      currentProject.value.placedPlants = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // Exportar/Importar projeto
  function exportProject() {
    return JSON.stringify(currentProject.value, null, 2)
  }

  function importProject(jsonString) {
    try {
      const project = JSON.parse(jsonString)
      currentProject.value = project
      saveProject()
      // Reinicializar histórico
      history.value = [JSON.parse(JSON.stringify(project.placedPlants))]
      historyIndex.value = 0
      return true
    } catch (error) {
      console.error('Erro ao importar projeto:', error)
      return false
    }
  }

  function newProject() {
    currentProject.value = {
      name: 'Novo Projeto',
      terrainWidth: 50,
      terrainHeight: 50,
      placedPlants: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    history.value = [JSON.parse(JSON.stringify(currentProject.value.placedPlants))]
    historyIndex.value = 0
    saveProject()
  }

  return {
    currentProject,
    placedPlants,
    plantCount,
    totalArea,
    addPlantToCanvas,
    updatePlantPosition,
    removePlantFromCanvas,
    clearCanvas,
    setTerrainDimensions,
    setProjectName,
    undo,
    redo,
    canUndo,
    canRedo,
    exportProject,
    importProject,
    newProject
  }
}
