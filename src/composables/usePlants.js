import { ref, computed } from 'vue'

const STORAGE_KEY = 'saf-plants'

// Plantas padrão do sistema
const defaultPlants = [
  // Emergentes (15-30m)
  {
    id: '1',
    name: 'Ipê Amarelo',
    scientificName: 'Handroanthus albus',
    icon: '🌳',
    color: '#fbbf24',
    canopyRadius: 4,
    category: 'emergente'
  },
  {
    id: '2',
    name: 'Jatobá',
    scientificName: 'Hymenaea courbaril',
    icon: '🌲',
    color: '#166534',
    canopyRadius: 6,
    category: 'emergente'
  },
  {
    id: '3',
    name: 'Castanheira',
    scientificName: 'Bertholletia excelsa',
    icon: '🌰',
    color: '#92400e',
    canopyRadius: 8,
    category: 'emergente'
  },
  
  // Alto (8-15m)
  {
    id: '4',
    name: 'Abacateiro',
    scientificName: 'Persea americana',
    icon: '🥑',
    color: '#16a34a',
    canopyRadius: 5,
    category: 'alto'
  },
  {
    id: '5',
    name: 'Mangueira',
    scientificName: 'Mangifera indica',
    icon: '🥭',
    color: '#ea580c',
    canopyRadius: 6,
    category: 'alto'
  },
  {
    id: '6',
    name: 'Jaqueira',
    scientificName: 'Artocarpus heterophyllus',
    icon: '🍈',
    color: '#84cc16',
    canopyRadius: 7,
    category: 'alto'
  },
  {
    id: '7',
    name: 'Cajueiro',
    scientificName: 'Anacardium occidentale',
    icon: '🥜',
    color: '#ef4444',
    canopyRadius: 5,
    category: 'alto'
  },
  {
    id: '8',
    name: 'Laranjeira',
    scientificName: 'Citrus sinensis',
    icon: '🍊',
    color: '#f97316',
    canopyRadius: 4,
    category: 'alto'
  },
  {
    id: '9',
    name: 'Limoeiro',
    scientificName: 'Citrus limon',
    icon: '🍋',
    color: '#fde047',
    canopyRadius: 3.5,
    category: 'alto'
  },
  {
    id: '10',
    name: 'Goiabeira',
    scientificName: 'Psidium guajava',
    icon: '🍐',
    color: '#22c55e',
    canopyRadius: 4,
    category: 'alto'
  },
  {
    id: '11',
    name: 'Pitangueira',
    scientificName: 'Eugenia uniflora',
    icon: '🍒',
    color: '#dc2626',
    canopyRadius: 3,
    category: 'alto'
  },
  {
    id: '12',
    name: 'Jabuticabeira',
    scientificName: 'Plinia cauliflora',
    icon: '🫐',
    color: '#581c87',
    canopyRadius: 4,
    category: 'alto'
  },
  
  // Médio (4-8m)
  {
    id: '13',
    name: 'Bananeira',
    scientificName: 'Musa spp.',
    icon: '🍌',
    color: '#fbbf24',
    canopyRadius: 2,
    category: 'médio'
  },
  {
    id: '14',
    name: 'Cacau',
    scientificName: 'Theobroma cacao',
    icon: '🍫',
    color: '#78350f',
    canopyRadius: 3,
    category: 'médio'
  },
  {
    id: '15',
    name: 'Açaí',
    scientificName: 'Euterpe oleracea',
    icon: '🫐',
    color: '#7c3aed',
    canopyRadius: 2,
    category: 'médio'
  },
  {
    id: '16',
    name: 'Pupunheira',
    scientificName: 'Bactris gasipaes',
    icon: '🌴',
    color: '#ea580c',
    canopyRadius: 2,
    category: 'médio'
  },
  {
    id: '17',
    name: 'Coqueiro Anão',
    scientificName: 'Cocos nucifera',
    icon: '🥥',
    color: '#92400e',
    canopyRadius: 3,
    category: 'médio'
  },
  {
    id: '18',
    name: 'Araçazeiro',
    scientificName: 'Psidium cattleyanum',
    icon: '🍇',
    color: '#dc2626',
    canopyRadius: 2.5,
    category: 'médio'
  },
  {
    id: '19',
    name: 'Aceroleira',
    scientificName: 'Malpighia glabra',
    icon: '🍒',
    color: '#f43f5e',
    canopyRadius: 3,
    category: 'médio'
  },
  {
    id: '20',
    name: 'Gravioleira',
    scientificName: 'Annona muricata',
    icon: '💚',
    color: '#16a34a',
    canopyRadius: 4,
    category: 'médio'
  },
  
  // Baixo (2-4m)
  {
    id: '21',
    name: 'Mamão',
    scientificName: 'Carica papaya',
    icon: '🍈',
    color: '#f97316',
    canopyRadius: 1.5,
    category: 'baixo'
  },
  {
    id: '22',
    name: 'Café',
    scientificName: 'Coffea arabica',
    icon: '☕',
    color: '#78350f',
    canopyRadius: 1.5,
    category: 'baixo'
  },
  {
    id: '23',
    name: 'Lichia',
    scientificName: 'Litchi chinensis',
    icon: '🍒',
    color: '#f43f5e',
    canopyRadius: 2.5,
    category: 'baixo'
  },
  {
    id: '24',
    name: 'Cajá-Manga',
    scientificName: 'Spondias dulcis',
    icon: '🥭',
    color: '#fbbf24',
    canopyRadius: 3,
    category: 'baixo'
  },
  {
    id: '25',
    name: 'Pêssego',
    scientificName: 'Prunus persica',
    icon: '🍑',
    color: '#fb923c',
    canopyRadius: 3,
    category: 'baixo'
  },
  {
    id: '26',
    name: 'Ameixa',
    scientificName: 'Prunus domestica',
    icon: '🍑',
    color: '#a855f7',
    canopyRadius: 3,
    category: 'baixo'
  },
  {
    id: '27',
    name: 'Romãzeira',
    scientificName: 'Punica granatum',
    icon: '🌺',
    color: '#dc2626',
    canopyRadius: 2,
    category: 'baixo'
  },
  {
    id: '28',
    name: 'Figueira',
    scientificName: 'Ficus carica',
    icon: '🍐',
    color: '#7c3aed',
    canopyRadius: 3,
    category: 'baixo'
  },
  
  // Rasteiro (0-2m)
  {
    id: '29',
    name: 'Abacaxi',
    scientificName: 'Ananas comosus',
    icon: '🍍',
    color: '#fbbf24',
    canopyRadius: 0.5,
    category: 'rasteiro'
  },
  {
    id: '30',
    name: 'Mandioca',
    scientificName: 'Manihot esculenta',
    icon: '🥔',
    color: '#d97706',
    canopyRadius: 0.5,
    category: 'rasteiro'
  },
  {
    id: '31',
    name: 'Inhame',
    scientificName: 'Dioscorea spp.',
    icon: '🥔',
    color: '#92400e',
    canopyRadius: 0.3,
    category: 'rasteiro'
  },
  {
    id: '32',
    name: 'Batata-Doce',
    scientificName: 'Ipomoea batatas',
    icon: '🍠',
    color: '#ea580c',
    canopyRadius: 0.4,
    category: 'rasteiro'
  },
  {
    id: '33',
    name: 'Taioba',
    scientificName: 'Xanthosoma sagittifolium',
    icon: '🌿',
    color: '#16a34a',
    canopyRadius: 0.5,
    category: 'rasteiro'
  },
  {
    id: '34',
    name: 'Morango',
    scientificName: 'Fragaria × ananassa',
    icon: '🍓',
    color: '#f43f5e',
    canopyRadius: 0.3,
    category: 'rasteiro'
  },
  
  // Trepadeiras
  {
    id: '35',
    name: 'Maracujá',
    scientificName: 'Passiflora edulis',
    icon: '💜',
    color: '#a855f7',
    canopyRadius: 1,
    category: 'trepadeira'
  },
  {
    id: '36',
    name: 'Uva',
    scientificName: 'Vitis vinifera',
    icon: '🍇',
    color: '#7c3aed',
    canopyRadius: 1.5,
    category: 'trepadeira'
  },
  {
    id: '37',
    name: 'Chuchu',
    scientificName: 'Sechium edule',
    icon: '🥒',
    color: '#84cc16',
    canopyRadius: 1,
    category: 'trepadeira'
  },
  {
    id: '38',
    name: 'Kiwi',
    scientificName: 'Actinidia deliciosa',
    icon: '🥝',
    color: '#16a34a',
    canopyRadius: 1.5,
    category: 'trepadeira'
  },
  {
    id: '39',
    name: 'Pimenta-do-Reino',
    scientificName: 'Piper nigrum',
    icon: '🌶️',
    color: '#15803d',
    canopyRadius: 0.5,
    category: 'trepadeira'
  },
  {
    id: '40',
    name: 'Baunilha',
    scientificName: 'Vanilla planifolia',
    icon: '🌿',
    color: '#78350f',
    canopyRadius: 0.5,
    category: 'trepadeira'
  }
]

const plants = ref([])

// Carregar plantas do localStorage ou usar padrão
function loadPlants() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      plants.value = JSON.parse(stored)
    } else {
      plants.value = [...defaultPlants]
      savePlants()
    }
  } catch (error) {
    console.error('Erro ao carregar plantas:', error)
    plants.value = [...defaultPlants]
  }
}

// Salvar plantas no localStorage
function savePlants() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants.value))
  } catch (error) {
    console.error('Erro ao salvar plantas:', error)
  }
}

export function usePlants() {
  // Inicializar plantas se ainda não foi feito
  if (plants.value.length === 0) {
    loadPlants()
  }

  const categories = computed(() => {
    const cats = [...new Set(plants.value.map(p => p.category))]
    return cats.sort()
  })

  const plantsByCategory = computed(() => {
    return categories.value.reduce((acc, cat) => {
      acc[cat] = plants.value.filter(p => p.category === cat)
      return acc
    }, {})
  })

  function addPlant(plant) {
    const newPlant = {
      ...plant,
      id: Date.now().toString()
    }
    plants.value.push(newPlant)
    savePlants()
    return newPlant
  }

  function updatePlant(id, updates) {
    const index = plants.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plants.value[index] = { ...plants.value[index], ...updates }
      savePlants()
    }
  }

  function deletePlant(id) {
    plants.value = plants.value.filter(p => p.id !== id)
    savePlants()
  }

  function getPlantById(id) {
    return plants.value.find(p => p.id === id)
  }

  function resetToDefault() {
    plants.value = [...defaultPlants]
    savePlants()
  }

  return {
    plants,
    categories,
    plantsByCategory,
    addPlant,
    updatePlant,
    deletePlant,
    getPlantById,
    resetToDefault
  }
}
