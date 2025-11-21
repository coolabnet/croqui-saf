# 🌱 Croqui SAF - Sistema de Prototipação de Sistemas Agroflorestais

Sistema web interativo para planejamento visual de áreas de cultivo agroflorestal, desenvolvido com Vue.js 3 (Composition API).

## 🌐 Demo Online

⚡ **Teste o sistema agora:** [https://coolabnet.github.io/croqui-saf/](https://coolabnet.github.io/croqui-saf/)

Não é necessário instalar nada! O sistema roda completamente no navegador.

## ✨ Funcionalidades

### Canvas de Desenho
- ✅ Canvas interativo SVG com zoom e pan
- ✅ Drag and drop de plantas no canvas
- ✅ Grid opcional configurável
- ✅ Zoom in/out com mouse wheel
- ✅ Pan (arrastar) para navegar
- ✅ Dimensões configuráveis do terreno (10-200m)

### Biblioteca de Plantas
- ✅ 10 plantas pré-cadastradas
- ✅ Busca/filtro de plantas
- ✅ Organização por categoria/estrato
- ✅ Cada planta com nome, científico, ícone, cor e raio da copa
- ✅ Drag and drop para adicionar no canvas

### Cadastro de Plantas
- ✅ Modal para adicionar novas plantas
- ✅ Campos: nome, científico, ícone, cor, raio da copa, categoria
- ✅ Seletor de emoji visual
- ✅ Color picker
- ✅ Validação de campos
- ✅ Persistência em localStorage

### Manipulação no Canvas
- ✅ Selecionar plantas posicionadas
- ✅ Mover plantas com drag and drop
- ✅ Excluir com Delete/Backspace
- ✅ Tooltip ao passar o mouse
- ✅ Painel lateral com detalhes da planta selecionada
- ✅ Visualização de raio da copa

### Funcionalidades Extras
- ✅ Salvar projeto como JSON
- ✅ Carregar projeto de arquivo
- ✅ Exportar como imagem PNG
- ✅ Limpar canvas
- ✅ Undo/Redo (Ctrl+Z / Ctrl+Y)
- ✅ Contador de plantas por espécie
- ✅ Cálculo de área do terreno
- ✅ Atalhos de teclado
- ✅ Notificações toast
- ✅ Persistência automática no localStorage

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+ e npm/yarn

### Passos

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acessar a aplicação:**
Abra o navegador em `http://localhost:3000`

## 📖 Como Usar

### 1. Adicionar Plantas ao Canvas
- Arraste uma planta da biblioteca lateral para o canvas
- A planta será posicionada onde você soltar
- O círculo colorido representa o raio da copa

### 2. Manipular Plantas
- **Mover:** Clique e arraste a planta no canvas
- **Selecionar:** Clique na planta para ver detalhes
- **Excluir:** Selecione e pressione Delete/Backspace, ou use o botão no painel lateral

### 3. Navegação no Canvas
- **Pan:** Clique e arraste no espaço vazio do canvas
- **Zoom:** Use a roda do mouse ou os botões na toolbar
- **Resetar View:** Botão ↺ na toolbar

### 4. Configurar Terreno
- Ajuste as dimensões (largura × altura) na toolbar
- Dimensões em metros (10-200m)

### 5. Cadastrar Nova Planta
- Clique em "+ Nova Planta" na biblioteca
- Preencha os campos obrigatórios (marcados com *)
- Selecione um emoji clicando no campo de ícone
- Escolha uma cor no color picker
- As plantas ficam salvas no navegador

### 6. Salvar/Carregar Projetos
- **Salvar:** Clique em "💾 Salvar" - baixa arquivo JSON
- **Carregar:** Clique em "📂 Carregar" - selecione arquivo JSON
- Projetos também são salvos automaticamente no localStorage

### 7. Exportar Imagem
- Clique em "📷 Exportar" para baixar PNG do canvas

### 8. Atalhos de Teclado
- `Ctrl+Z`: Desfazer
- `Ctrl+Y` ou `Ctrl+Shift+Z`: Refazer
- `Ctrl+S`: Salvar projeto
- `Delete` ou `Backspace`: Excluir planta selecionada

## 🏗️ Estrutura do Projeto

```
croqui-saf/
├── index.html              # HTML principal
├── package.json            # Dependências
├── vite.config.js          # Configuração Vite
└── src/
    ├── main.js             # Ponto de entrada
    ├── style.css           # Estilos globais
    ├── App.vue             # Componente principal
    ├── components/
    │   ├── SafCanvas.vue   # Canvas SVG interativo
    │   ├── PlantLibrary.vue # Biblioteca de plantas
    │   ├── PlantForm.vue   # Formulário de cadastro
    │   └── Toolbar.vue     # Barra de ferramentas
    └── composables/
        ├── usePlants.js    # Gerenciamento de plantas
        └── useProject.js   # Gerenciamento de projetos
```

## 🌿 Plantas Pré-cadastradas

O sistema vem com **40 plantas** comuns em SAFs brasileiros, organizadas por estrato:

### 🌳 Emergentes (15-30m)
- Ipê Amarelo, Jatobá, Castanheira

### 🌲 Alto (8-15m)
- Abacateiro, Mangueira, Jaqueira, Cajueiro, Laranjeira, Limoeiro
- Goiabeira, Pitangueira, Jabuticabeira

### 🌴 Médio (4-8m)
- Bananeira, Cacau, Açaí, Pupunheira, Coqueiro Anão
- Araçazeiro, Aceroleira, Gravioleira

### 🌿 Baixo (2-4m)
- Mamão, Café, Lichia, Cajá-Manga, Pêssego
- Ameixa, Romãzeira, Figueira

### 🍃 Rasteiro (0-2m)
- Abacaxi, Mandioca, Inhame, Batata-Doce, Taioba, Morango

### 🌱 Trepadeiras
- Maracujá, Uva, Chuchu, Kiwi, Pimenta-do-Reino, Baunilha

## 🌱 Tecnologias

- **Vue.js 3** - Framework JavaScript reativo
- **Composition API** - API moderna do Vue
- **Vite** - Build tool e dev server
- **SVG** - Canvas vetorial para visualização
- **LocalStorage** - Persistência local de dados
- **Canvas API** - Exportação de imagem
- **GitHub Pages** - Hospedagem estática

## 🚀 Deploy

### GitHub Pages (Automático)
O projeto está configurado com GitHub Actions para deploy automático:
- Todo push na branch `main` gera um novo deploy
- Build e publicação automáticos
- Disponível em: https://coolabnet.github.io/croqui-saf/

### Deploy Manual
```bash
# Executar script de deploy
./deploy.sh
```

### Build Local
```bash
# Gerar build de produção
npm run build

# Preview do build
npm run preview
```

## 📝 Notas

- Todos os dados são armazenados localmente no navegador (localStorage)
- Não há backend - sistema 100% frontend
- Compatível com navegadores modernos
- Responsivo para diferentes resoluções

## 🤝 Contribuindo

Este é um projeto de código aberto. Sugestões e melhorias são bem-vindas!

## 📄 Licença

MIT License - sinta-se livre para usar e modificar.

---

Desenvolvido com 🌱 para facilitar o planejamento de Sistemas Agroflorestais
