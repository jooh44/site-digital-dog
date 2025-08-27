# Meta Conversions API - Guia de Configuração

## 📋 Visão Geral

A Meta Conversions API permite enviar eventos de conversão diretamente do servidor para o Facebook/Meta, melhorando:
- Precisão do tracking (contorna bloqueadores de ads)
- Atribuição de conversões
- Otimização de campanhas

## 🚀 Passos de Configuração

### 1. Obter Access Token

1. Acesse: https://developers.facebook.com/tools/explorer/
2. Selecione seu aplicativo
3. Adicione as permissões:
   - `ads_management`
   - `business_management`
4. Gere o token de longa duração
5. **Salve o token com segurança**

### 2. Encontrar Dataset ID

1. Acesse Business Manager
2. Vá para **Sources** > **Datasets**
3. Clique no seu dataset
4. O ID aparece na URL: `/datasets/{DATASET_ID}`

### 3. Configurar Test Event Code (Opcional)

1. Events Manager > Fontes de Dados
2. Clique no seu Pixel
3. Aba **Test Events**
4. Crie um novo test event code
5. Use para testar os eventos

### 4. Configurar o Projeto

1. Copie `meta-config.example.js` para `meta-config.js`
2. Edite `meta-config.js` com seus dados:

```javascript
window.MetaConfig = {
    pixelId: '1814369106143188',           // Já configurado
    accessToken: 'SEU_ACCESS_TOKEN_AQUI',  // Cole seu token aqui
    datasetId: 'SEU_DATASET_ID_AQUI',      // Cole seu dataset ID aqui
    testEventCode: 'TEST12345',            // Opcional: seu test code
    backendUrl: '/api/meta-conversions.php'
};
```

3. Inclua o arquivo de configuração no HTML:

```html
<script src="meta-config.js"></script>
<script src="assets/js/meta-conversions-api.js"></script>
```

### 5. Configurar Backend (PHP)

1. Edite `api/meta-conversions.php`
2. Substitua os valores na seção `$CONFIG`:

```php
$CONFIG = [
    'ACCESS_TOKEN' => 'SEU_ACCESS_TOKEN_AQUI',
    'API_VERSION' => 'v18.0',
    'PIXEL_ID' => '1814369106143188'
];
```

### 6. Testar Configuração

1. Abra o site no navegador
2. Abra DevTools (F12) > Console
3. Procure por mensagens: `🎯 Meta Conversions API`
4. Verifique se não há erros
5. No Events Manager > Test Events, verifique se os eventos chegam

## 📊 Eventos Rastreados

### Automáticos
- **PageView**: Quando a página carrega
- **ViewContent**: Quando usuário vê 50% da hero section
- **Lead**: Clicks no WhatsApp e envio de formulários

### Manuais
```javascript
// Usar em qualquer lugar do site
window.metaAPI.track('Purchase', {
    value: 997.00,
    currency: 'BRL',
    content_name: 'Website Veterinário'
});
```

## 🔍 Debug e Monitoramento

### Console do Navegador
- Eventos são logados automaticamente
- Tabela com dados importantes é exibida

### Test Events (Meta)
1. Events Manager > Fontes de Dados
2. Clique no seu Pixel
3. Aba "Test Events"
4. Veja eventos em tempo real

### Logs do Servidor
- Arquivo: `api/meta-conversions.log`
- Remove em produção ou configure rotação

## 🔐 Segurança

### ⚠️ IMPORTANTE
- Nunca exponha o Access Token no frontend
- Use variáveis de ambiente no servidor
- Configure CORS adequadamente
- Use HTTPS em produção

### Exemplo com variáveis de ambiente:
```php
$CONFIG = [
    'ACCESS_TOKEN' => $_ENV['META_ACCESS_TOKEN'] ?? getenv('META_ACCESS_TOKEN'),
    'API_VERSION' => 'v18.0',
    'PIXEL_ID' => '1814369106143188'
];
```

## 🎯 Verificação de Funcionamento

### Checklist
- [ ] Access Token configurado
- [ ] Dataset ID configurado
- [ ] Backend endpoint funcionando
- [ ] Eventos aparecendo no Test Events
- [ ] Console sem erros
- [ ] IP do cliente sendo capturado corretamente

### Troubleshooting
- **Erro 400**: Verifique formato do payload
- **Erro 401**: Access Token inválido ou expirado
- **Erro 403**: Permissões insuficientes
- **Evento não aparece**: Verifique Test Event Code

## 📈 Próximos Passos

1. **Testar por alguns dias** com Test Events
2. **Remover Test Event Code** para produção
3. **Configurar mais eventos** conforme necessidade
4. **Monitorar performance** no Events Manager
5. **Otimizar campanhas** com dados melhorados

---

## 📞 Suporte

Se tiver dúvidas:
1. Consulte [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
2. Verifique logs do servidor
3. Use Test Events para debug