/**
 * Configuração da Meta Conversions API
 * 
 * INSTRUÇÕES:
 * 1. Copie este arquivo para "meta-config.js"
 * 2. Substitua os valores pelos seus dados reais da Meta
 * 3. Adicione "meta-config.js" ao seu .gitignore
 */

window.MetaConfig = {
    // Seu Pixel ID (já configurado)
    pixelId: '766494342759761',
    
    // Access Token da Meta Conversions API
    // Obtenha em: https://developers.facebook.com/tools/explorer/
    accessToken: 'EAAPBgMMYMUgBPSKvO7hZCjWzqLkYT6oFWiMZAW21gJ898BCH5FgKDwt3E10POdc4EmRsRE6dgeXOnfIvTG8NpsMym8Pm8DPOaU5Y95za1VjChmvOq0YmVoHYXMLfiCEnXlthnHiZAOiIzTZCaPPhH45CtWTkFDDTfk5qxXViWaHNAbC8ZCuDg5btQ7shcfYSkgQZDZD',
    
    // Dataset ID da Meta Conversions API  
    // Encontre em: Business Manager > Sources > Datasets
    datasetId: '1406278840453678',
    
    // Test Event Code (opcional - para debug)
    // Obtenha em: Events Manager > Test Events
    testEventCode: 'TEST12345',
    
    // URL do seu endpoint backend
    backendUrl: '/api/meta-conversions.php'
};

/**
 * ONDE ENCONTRAR ESSAS INFORMAÇÕES:
 * 
 * 1. ACCESS TOKEN:
 *    - Vá para: https://developers.facebook.com/tools/explorer/
 *    - Selecione seu app
 *    - Adicione as permissions: ads_management, business_management
 *    - Gere o token
 * 
 * 2. DATASET ID:
 *    - Business Manager > Sources > Datasets
 *    - Clique no seu dataset
 *    - O ID aparece na URL: /datasets/{DATASET_ID}
 * 
 * 3. TEST EVENT CODE:
 *    - Events Manager > Fontes de Dados
 *    - Clique no seu Pixel
 *    - Aba "Test Events"
 *    - Crie um test event code
 * 
 * 4. VERIFICAÇÃO:
 *    - Use o Test Events para verificar se os eventos estão chegando
 *    - Events Manager > Fontes de Dados > Seu Pixel > Test Events
 */