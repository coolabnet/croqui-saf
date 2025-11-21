<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>Nova Planta</h2>
        <button class="modal-close" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Nome da Planta *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ex: Bananeira"
            required
          />
        </div>

        <div class="form-group">
          <label>Nome Científico</label>
          <input
            v-model="form.scientificName"
            type="text"
            placeholder="Ex: Musa spp."
          />
        </div>

        <div class="form-group">
          <label>Ícone/Emoji *</label>
          <div class="icon-selector">
            <input
              v-model="form.icon"
              type="text"
              placeholder="Clique para selecionar"
              readonly
              required
              @click="showEmojiPicker = !showEmojiPicker"
            />
            <div v-if="showEmojiPicker" class="emoji-picker">
              <div class="emoji-grid">
                <button
                  v-for="emoji in availableEmojis"
                  :key="emoji"
                  type="button"
                  class="emoji-option"
                  @click="selectEmoji(emoji)"
                  :class="{ selected: form.icon === emoji }"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Cor de Representação *</label>
          <div class="color-picker-group">
            <input
              v-model="form.color"
              type="color"
              required
            />
            <input
              v-model="form.color"
              type="text"
              placeholder="#10b981"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Raio da Copa (metros) *</label>
          <input
            v-model.number="form.canopyRadius"
            type="number"
            step="0.5"
            min="0.5"
            max="20"
            placeholder="Ex: 2.5"
            required
          />
        </div>

        <div class="form-group">
          <label>Categoria/Estrato *</label>
          <select v-model="form.category" required>
            <option value="">Selecione...</option>
            <option value="emergente">Emergente</option>
            <option value="alto">Alto</option>
            <option value="médio">Médio</option>
            <option value="baixo">Baixo</option>
            <option value="rasteiro">Rasteiro</option>
            <option value="trepadeira">Trepadeira</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            Adicionar Planta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { usePlants } from '../composables/usePlants'

const emit = defineEmits(['close', 'added'])

const { addPlant } = usePlants()

const form = reactive({
  name: '',
  scientificName: '',
  icon: '',
  color: '#10b981',
  canopyRadius: 2,
  category: ''
})

const showEmojiPicker = ref(false)

const availableEmojis = [
  '🌳', '🌲', '🌴', '🌱', '🌿', '🍀', '🌾', '🌵',
  '🍌', '🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍈',
  '🥜', '🫐', '🍫', '☕', '🥔', '💜', '🌻', '🌺',
  '🌸', '🌼', '🌷', '🏵️', '🍃', '🪴', '🌰', '🌶️'
]

function selectEmoji(emoji) {
  form.icon = emoji
  showEmojiPicker.value = false
}

function onSubmit() {
  const newPlant = addPlant({
    name: form.name,
    scientificName: form.scientificName,
    icon: form.icon,
    color: form.color,
    canopyRadius: form.canopyRadius,
    category: form.category
  })

  emit('added', newPlant)
  emit('close')
}
</script>

<style scoped>
.icon-selector {
  position: relative;
}

.emoji-picker {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-top: 4px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-option {
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 24px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.emoji-option:hover {
  background: #f3f4f6;
  transform: scale(1.1);
}

.emoji-option.selected {
  border-color: #10b981;
  background: #d1fae5;
}

.color-picker-group {
  display: flex;
  gap: 12px;
}

.color-picker-group input[type="color"] {
  width: 60px;
  height: 42px;
  padding: 4px;
  cursor: pointer;
}

.color-picker-group input[type="text"] {
  flex: 1;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .modal {
    max-width: 95%;
    padding: 20px 16px;
    max-height: 85vh;
  }
  
  .modal-header h2 {
    font-size: 18px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .emoji-option {
    font-size: 20px;
    padding: 6px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal {
    max-width: 100%;
    padding: 16px;
    border-radius: 8px;
  }
  
  .emoji-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .emoji-option {
    font-size: 18px;
    padding: 4px;
  }
}
</style>
