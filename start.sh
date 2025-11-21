#!/bin/bash

echo "🌱 Iniciando Croqui SAF..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

echo "🚀 Iniciando servidor de desenvolvimento..."
echo "📍 Acesse: http://localhost:3000"
echo ""
echo "⚡ Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev
