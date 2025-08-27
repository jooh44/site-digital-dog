# Digital Dog - Site para Veterinários

Site profissional para captação de clientes veterinários com integração completa da Meta Conversions API.

## 🚀 Funcionalidades

### Frontend
- **Design responsivo** otimizado para mobile e desktop
- **Portfolio interativo** com efeito shuffle de cards
- **Animações fluidas** com performance otimizada
- **SEO otimizado** com meta tags e schema markup
- **PWA ready** com manifest.json

### Tracking e Conversões
- **Meta Pixel** integrado para rastreamento básico
- **Meta Conversions API** para tracking server-side avançado
- **Eventos automáticos**: PageView, ViewContent, Lead (WhatsApp + Formulários)
- **Contorno de bloqueadores** de ads via server-side

## 📁 Estrutura do Projeto

```
├── index.html                    # Página principal
├── assets/
│   ├── css/styles.css            # Estilos principais  
│   ├── js/
│   │   ├── script.js             # JavaScript principal
│   │   └── meta-conversions-api.js # API de Conversões Meta
│   └── images/                   # Todas as imagens e logos
├── api/
│   └── meta-conversions.php      # Backend para Conversions API
├── docs/                         # Documentação técnica
├── meta-config.example.js        # Template de configuração
├── META-CONVERSIONS-SETUP.md     # Guia de configuração da Meta
├── robots.txt                    # SEO
├── sitemap.xml                   # SEO
└── manifest.json                 # PWA
```

## 🔧 Configuração

### 1. Meta Conversions API
1. Copie `meta-config.example.js` para `meta-config.js`
2. Configure seus tokens da Meta:
   - Access Token
   - Pixel ID: `766494342759761`
   - Dataset ID
3. Configure o backend PHP com o Access Token
4. Teste no Events Manager da Meta

### 2. Deploy
- Upload todos os arquivos para seu servidor
- Certifique-se que PHP está habilitado para o endpoint `/api/`
- Configure HTTPS (obrigatório para Meta Conversions API)

## 📊 Eventos Rastreados

### Automáticos
- **PageView**: Carregamento da página
- **ViewContent**: Usuário vê 50% do conteúdo
- **Lead**: Cliques no WhatsApp e envios de formulário

### Manuais (via JavaScript)
```javascript
window.metaAPI.track('Purchase', {
    value: 997.00,
    currency: 'BRL',
    content_name: 'Website Veterinário'
});
```

## 🎯 Conversões Rastreadas

### Fontes de Lead
- Botão principal da hero
- Portfolio CTA
- Formulário de contato
- Botão WhatsApp flutuante
- Links de contato

### Dados Capturados
- FBP (Facebook Browser ID)
- FBC (Facebook Click ID) 
- IP do cliente
- User Agent
- External ID único
- Dados de formulário (hasheados)

## 🔐 Segurança

- Access Token protegido via backend
- Dados pessoais hasheados (SHA-256)
- CORS configurado
- Logs de debug (remover em produção)

## 📈 Monitoramento

### Meta Events Manager
- Acesse Events Manager > Fontes de Dados
- Use Test Events para debug
- Monitore qualidade dos dados

### Console Debug
- Eventos logados automaticamente
- Tabela com dados importantes
- Erros de integração visíveis

## 🛠️ Suporte Técnico

### Documentação
- `META-CONVERSIONS-SETUP.md` - Configuração completa
- `docs/design-principles.md` - Princípios de design
- `CLAUDE.md` - Instruções para desenvolvimento

### Troubleshooting
- Verifique console do navegador
- Monitore Test Events na Meta
- Confira logs do servidor PHP

---

## 📞 Contato

**Digital Dog**
- WhatsApp: (47) 98810-9155
- Site: https://digitaldog.pet
- Instagram: @digitaldog.pet