# 🚀 Guia de Setup do GitHub Pages

Este documento explica como configurar e usar o GitHub Pages para o Croqui SAF.

## ✅ O que já está configurado

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   - Deploy automático a cada push na branch `main`
   - Build e publicação automáticos
   - Usa Node.js 18 e npm

2. **Vite Config** (`vite.config.js`)
   - Base path configurado para `/croqui-saf/`
   - Build otimizado

3. **Script de Deploy Manual** (`deploy.sh`)
   - Para deploy manual quando necessário

## 📋 Passos para Ativar o GitHub Pages

### 1. Fazer Push para o GitHub

```bash
# Fazer push dos commits
git push origin main
```

### 2. Configurar GitHub Pages no Repositório

1. Acesse: https://github.com/coolabnet/croqui-saf/settings/pages
2. Em **Source**, selecione:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Clique em **Save**

### 3. Aguardar o Deploy

- O GitHub Actions será executado automaticamente
- Acompanhe em: https://github.com/coolabnet/croqui-saf/actions
- Primeiro deploy leva ~2-3 minutos

### 4. Acessar o Site

Após o deploy ser concluído:
**https://coolabnet.github.io/croqui-saf/**

## 🔄 Como Funciona

### Deploy Automático

Toda vez que você fizer push na branch `main`:

1. GitHub Actions detecta o push
2. Instala dependências (`npm ci`)
3. Gera build de produção (`npm run build`)
4. Publica pasta `dist/` na branch `gh-pages`
5. GitHub Pages atualiza o site automaticamente

### Deploy Manual

Se preferir fazer deploy manual:

```bash
# Executar script
./deploy.sh
```

Ou manualmente:

```bash
# Build
npm run build

# Navegar para dist
cd dist

# Criar repo e fazer push
git init
git add -A
git commit -m "deploy"
git push -f git@github.com:coolabnet/croqui-saf.git main:gh-pages
```

## 🔧 Troubleshooting

### Erro 404 ao acessar o site

**Problema:** Página não encontrada

**Solução:**
1. Verifique se o GitHub Pages está ativado nas configurações
2. Confirme que a branch `gh-pages` existe
3. Aguarde alguns minutos após o primeiro deploy

### Assets não carregam (404)

**Problema:** CSS/JS não carregam

**Solução:**
- Verifique se `base: '/croqui-saf/'` está no `vite.config.js`
- Reconstrua o projeto: `npm run build`

### Deploy falha no GitHub Actions

**Problema:** Workflow com erro

**Solução:**
1. Verifique os logs em Actions
2. Confirme que `package.json` está correto
3. Verifique se há erros de build localmente: `npm run build`

### Site mostra versão antiga

**Problema:** Mudanças não aparecem

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Aguarde 1-2 minutos após o deploy
3. Verifique se o workflow completou com sucesso

## 🎯 Verificações

### Antes de fazer push:

```bash
# Testar build local
npm run build

# Preview do build
npm run preview
# Acesse http://localhost:4173/croqui-saf/

# Verificar se tudo funciona
```

### Após fazer push:

1. ✅ Acompanhar workflow em Actions
2. ✅ Aguardar conclusão (badge verde)
3. ✅ Acessar URL do GitHub Pages
4. ✅ Testar funcionalidades principais

## 📝 Notas Importantes

- **Branch gh-pages é gerada automaticamente** - Não faça commits manuais nela
- **Build é feito a cada push** - Commits frequentes = deploys frequentes
- **Cache do navegador** - Pode ser necessário limpar para ver mudanças
- **Primeiro deploy** - Pode levar 3-5 minutos
- **Deploys subsequentes** - Levam 1-2 minutos

## 🔗 Links Úteis

- **Repositório:** https://github.com/coolabnet/croqui-saf
- **GitHub Pages:** https://coolabnet.github.io/croqui-saf/
- **Actions:** https://github.com/coolabnet/croqui-saf/actions
- **Settings:** https://github.com/coolabnet/croqui-saf/settings/pages

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do GitHub Actions
2. Teste o build localmente
3. Consulte a [documentação do GitHub Pages](https://docs.github.com/pages)
4. Abra uma issue no repositório

---

**Status:** ✅ Configuração completa e pronta para uso!
