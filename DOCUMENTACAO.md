# Documentação Técnica - Croqui SAF

## Estruturas de Dados

### Planta (Plant)
Estrutura base para definição de tipos de plantas no sistema.

```javascript
{
  id: String,              // ID único da planta
  name: String,            // Nome comum (ex: "Bananeira")
  scientificName: String,  // Nome científico (ex: "Musa spp.")
  icon: String,            // Emoji/ícone (ex: "🍌")
  color: String,           // Cor em hex (ex: "#fbbf24")
  canopyRadius: Number,    // Raio da copa em metros
  category: String         // Categoria: emergente|alto|médio|baixo|rasteiro|trepadeira
}
```

### Planta Posicionada (PlacedPlant)
Instância de uma planta no canvas com posição específica.

```javascript
{
  id: String,              // ID único da instância
  plantId: String,         // Referência ao ID da planta base
  plantName: String,       // Nome da planta (cópia)
  scientificName: String,  // Nome científico (cópia)
  icon: String,            // Ícone (cópia)
  color: String,           // Cor (cópia)
  canopyRadius: Number,    // Raio da copa (cópia)
  category: String,        // Categoria (cópia)
  x: Number,               // Posição X em metros
  y: Number                // Posição Y em metros
}
```

### Projeto (Project)
Estrutura completa de um projeto SAF.

```javascript
{
  name: String,            // Nome do projeto
  terrainWidth: Number,    // Largura do terreno em metros
  terrainHeight: Number,   // Altura do terreno em metros
  placedPlants: Array,     // Array de PlacedPlant
  createdAt: Number,       // Timestamp de criação
  updatedAt: Number        // Timestamp de última atualização
}
```

## Composables

### usePlants()
Gerencia a biblioteca de plantas do sistema.

**Retorna:**
- `plants` (Ref): Array reativo de todas as plantas
- `categories` (Computed): Lista de categorias únicas
- `plantsByCategory` (Computed): Plantas agrupadas por categoria
- `addPlant(plant)`: Adiciona nova planta
- `updatePlant(id, updates)`: Atualiza planta existente
- `deletePlant(id)`: Remove planta
- `getPlantById(id)`: Busca planta por ID
- `resetToDefault()`: Restaura plantas padrão

**Persistência:** localStorage chave `saf-plants`

### useProject()
Gerencia o projeto atual e suas operações.

**Retorna:**
- `currentProject` (Ref): Projeto atual
- `placedPlants` (Computed): Plantas no canvas
- `plantCount` (Computed): Contagem por tipo de planta
- `totalArea` (Computed): Área total do terreno
- `addPlantToCanvas(plantData, x, y)`: Adiciona planta ao canvas
- `updatePlantPosition(id, x, y)`: Move planta
- `removePlantFromCanvas(id)`: Remove planta
- `clearCanvas()`: Limpa todo o canvas
- `setTerrainDimensions(width, height)`: Altera dimensões
- `setProjectName(name)`: Altera nome do projeto
- `undo()`: Desfaz última ação
- `redo()`: Refaz ação desfeita
- `canUndo` (Computed): Se pode desfazer
- `canRedo` (Computed): Se pode refazer
- `exportProject()`: Exporta como JSON string
- `importProject(jsonString)`: Importa projeto
- `newProject()`: Cria novo projeto

**Persistência:** 
- localStorage chave `saf-current-project`
- Histórico de até 50 estados para undo/redo

## Componentes

### App.vue
Componente raiz da aplicação. Orquestra todos os outros componentes e gerencia:
- Estado global da aplicação
- Notificações
- Atalhos de teclado
- Exportação de imagem
- Salvar/Carregar projetos

### SafCanvas.vue
Canvas SVG interativo onde as plantas são posicionadas.

**Props:**
- `terrainWidth`: Largura do terreno
- `terrainHeight`: Altura do terreno
- `showGrid`: Exibir grid
- `gridSize`: Tamanho do grid em metros

**Eventos:**
- `plant-selected`: Emitido quando planta é selecionada
- `plant-deleted`: Emitido quando planta é excluída

**Métodos Expostos:**
- `zoomIn()`: Aumenta zoom
- `zoomOut()`: Diminui zoom
- `resetView()`: Reseta visualização

**Interações:**
- Arrastar canvas vazio: Pan
- Mouse wheel: Zoom
- Arrastar planta: Mover
- Clicar planta: Selecionar
- Delete/Backspace: Excluir selecionada
- Drop: Adicionar nova planta

### PlantLibrary.vue
Painel lateral com biblioteca de plantas disponíveis.

**Eventos:**
- `add-plant`: Emitido quando botão "Nova Planta" é clicado

**Funcionalidades:**
- Busca/filtro de plantas
- Organização por categoria
- Drag and drop para canvas
- Contador de plantas por categoria

### PlantForm.vue
Modal para cadastro de novas plantas.

**Eventos:**
- `close`: Fechar modal
- `added`: Planta adicionada com sucesso

**Validações:**
- Nome: obrigatório
- Ícone: obrigatório
- Cor: obrigatório, formato hexadecimal
- Raio da copa: obrigatório, 0.5-20m
- Categoria: obrigatória

### Toolbar.vue
Barra de ferramentas superior com controles e informações.

**Props:**
- `projectName`: Nome do projeto
- `terrainWidth/Height`: Dimensões
- `totalArea`: Área calculada
- `totalPlants`: Total de plantas
- `showGrid`: Estado do grid
- `canUndo/canRedo`: Estados de histórico

**Eventos:**
- Controles de zoom, grid, undo/redo
- Ações de projeto (salvar, carregar, exportar, limpar)
- Atualização de dimensões e nome

## localStorage

O sistema utiliza três chaves no localStorage:

1. **saf-plants**: Array de plantas cadastradas
2. **saf-current-project**: Projeto atual sendo editado
3. (Futuro) **saf-projects-list**: Lista de projetos salvos

## Fluxo de Dados

```
App.vue (Estado Global)
    │
    ├─→ Toolbar.vue (Controles)
    │       └─→ Eventos → App.vue
    │
    ├─→ PlantLibrary.vue
    │       ├─→ usePlants() (Dados)
    │       └─→ Drag Start → DataTransfer
    │
    ├─→ SafCanvas.vue
    │       ├─→ useProject() (Dados)
    │       ├─→ Drop → addPlantToCanvas()
    │       └─→ Eventos → App.vue
    │
    └─→ PlantForm.vue (Modal)
            ├─→ usePlants() (Ações)
            └─→ Eventos → App.vue
```

## Algoritmos Importantes

### Sistema de Undo/Redo
- Baseado em snapshots do array `placedPlants`
- Pilha de estados com índice atual
- Máximo de 50 estados salvos
- Deep clone com JSON para imutabilidade

### Drag and Drop
1. **Drag Start** (PlantLibrary): Serializa planta para DataTransfer
2. **Drag Over** (Canvas): Previne default para permitir drop
3. **Drop** (Canvas): 
   - Deserializa dados
   - Converte coordenadas do mouse para posição no terreno
   - Valida se está dentro dos limites
   - Adiciona planta ao projeto

### Zoom e Pan
- **Zoom**: Altera escala (pixels por metro) com limites 5-50
- **Pan**: Altera offset do viewBox do SVG
- Conversão de coordenadas: `posicaoReal = (mouseX - offset) / scale`

### Exportação de Imagem
1. Serializa SVG para string
2. Converte para data URL base64
3. Cria Image temporária
4. Desenha em Canvas HTML
5. Converte Canvas para Blob
6. Cria link de download e dispara

## Melhorias Futuras

### Funcionalidades
- [ ] Múltiplos projetos com lista de seleção
- [ ] Camadas (layers) para organização
- [ ] Régua/medidor de distância
- [ ] Snap to grid
- [ ] Rotação de elementos
- [ ] Grupos de plantas
- [ ] Notas e anotações no canvas
- [ ] Exportar para PDF
- [ ] Informações de sombreamento
- [ ] Cálculo de densidade
- [ ] Timeline de crescimento

### Técnicas
- [ ] Testes unitários (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] TypeScript
- [ ] PWA (Progressive Web App)
- [ ] Backend opcional para sync
- [ ] Impressão otimizada
- [ ] Modo escuro
- [ ] Internacionalização (i18n)

## Performance

### Otimizações Implementadas
- Componentes reativos com Composition API
- Computed properties para cálculos derivados
- Event delegation no canvas
- Debounce implícito em watchers

### Limites Recomendados
- Plantas no canvas: até 500 (performance ideal)
- Histórico: 50 estados
- Dimensão do terreno: 10-200m

## Compatibilidade

**Navegadores Suportados:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Recursos Necessários:**
- ES6+ (arrow functions, classes, modules)
- SVG 2.0
- LocalStorage
- Canvas API
- FileReader API
- Drag and Drop API

## Troubleshooting

### Plantas não aparecem no canvas
- Verificar se as dimensões do terreno são adequadas
- Checar console para erros JavaScript
- Limpar localStorage e recarregar

### Drag and drop não funciona
- Verificar se navegador suporta HTML5 Drag and Drop
- Testar em modo de navegação anônima (sem extensões)

### Exportação de imagem falha
- Verificar permissões de download no navegador
- Tentar em navegador diferente
- Canvas muito grande pode causar problemas

### Undo/Redo não funciona
- Pode estar no início/fim do histórico
- Verificar se ações foram salvas (devem gerar snapshot)
- Recarregar página para resetar histórico
