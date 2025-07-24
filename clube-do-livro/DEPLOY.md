# 🚀 Deploy do Clube do Livro no Netlify

## 📋 Instruções de Deploy

### 1. Preparação Local

Antes de fazer o deploy, certifique-se de que tudo está funcionando localmente:

```bash
# Instalar dependências
npm install

# Testar build local
npm run build:netlify

# Verificar se não há erros
npm run test
```

### 2. Deploy no Netlify

#### Opção A: Deploy via Git (Recomendado)

1. **Conectar repositório ao Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub/GitLab
   
2. **Configurações de Build:**
   - **Build command:** `npm run build:netlify`
   - **Publish directory:** `build`
   - **Branch:** `main`

3. **Variáveis de Ambiente (se necessário):**
   ```
   NODE_VERSION=18
   GENERATE_SOURCEMAP=false
   CI=true
   ```

#### Opção B: Deploy Manual

```bash
# Build para produção
npm run build:netlify

# Deploy via Netlify CLI
npx netlify-cli deploy --prod --dir=build
```

### 3. Configurações Importantes

O arquivo `netlify.toml` já está configurado com:

- ✅ **SPA Routing:** Redirecionamentos para React Router
- ✅ **Headers de Segurança:** X-Frame-Options, CSP, etc.
- ✅ **Cache Otimizado:** Assets estáticos com cache longo
- ✅ **Compressão:** CSS, JS e imagens otimizadas
- ✅ **Lighthouse:** Métricas de performance automáticas

### 4. Verificações Pós-Deploy

Após o deploy, verifique:

1. **Navegação:** Todas as rotas funcionando
2. **Performance:** Lighthouse Score > 90
3. **Responsividade:** Mobile e desktop
4. **Assets:** Imagens e fontes carregando
5. **Funcionalidades:** Login, checkout, etc.

### 5. Domínio Personalizado (Opcional)

Para usar um domínio próprio:

1. No painel Netlify, vá em "Domain settings"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 6. SSL/HTTPS

O Netlify fornece SSL gratuito automaticamente via Let's Encrypt.

## 🔧 Otimizações Implementadas

### Performance
- ✅ Code splitting com React.lazy
- ✅ Bundle size otimizado (95.89kB gzip)
- ✅ Cache service implementado
- ✅ Lazy loading de imagens

### SEO
- ✅ Meta tags configuradas
- ✅ Robots.txt
- ✅ Sitemap.xml (recomendado adicionar)

### Acessibilidade
- ✅ Contraste WCAG AA
- ✅ Aria-labels implementados
- ✅ Navegação por teclado
- ✅ Screen reader friendly

### Segurança
- ✅ Headers de segurança
- ✅ CSP configurado
- ✅ XSS protection

## 📊 Métricas Esperadas

Com as otimizações implementadas, espere:

- **Performance:** 90-95 (Lighthouse)
- **Accessibility:** 95-100 (Lighthouse)
- **Best Practices:** 90-95 (Lighthouse)
- **SEO:** 90-95 (Lighthouse)

## 🚨 Troubleshooting

### Build Falhando
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar versão Node
node --version # Deve ser 18+
```

### Rotas 404
- Verifique se `netlify.toml` está na raiz
- Confirme redirecionamento SPA configurado

### Assets não Carregando
- Verifique paths relativos
- Confirme public folder configurado

## 📞 Suporte

Em caso de problemas:
1. Verifique logs do Netlify
2. Teste build local primeiro
3. Confirme configurações de DNS (se domínio próprio)

---

## 🎯 Comandos Rápidos

```bash
# Deploy rápido
npm run build:netlify && npx netlify-cli deploy --prod --dir=build

# Preview local
npm start

# Análise de bundle
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```