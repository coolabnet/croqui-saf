#!/bin/bash

# Script de deploy para GitHub Pages

echo "🚀 Iniciando deploy para GitHub Pages..."
echo ""

# Build do projeto
echo "📦 Gerando build de produção..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build!"
    exit 1
fi

echo "✅ Build gerado com sucesso!"
echo ""

# Navegar para o diretório de build
cd dist

# Criar arquivo .nojekyll (necessário para GitHub Pages)
touch .nojekyll

echo "📝 Criando git no diretório dist..."
git init
git add -A
git commit -m "deploy: Atualização do GitHub Pages"

echo ""
echo "🌐 Enviando para branch gh-pages..."
git push -f git@github.com:coolabnet/croqui-saf.git main:gh-pages

cd ..

echo ""
echo "✅ Deploy concluído!"
echo "🌍 Seu site estará disponível em: https://coolabnet.github.io/croqui-saf/"
echo ""
echo "⏳ Aguarde alguns minutos para o GitHub Pages processar..."
