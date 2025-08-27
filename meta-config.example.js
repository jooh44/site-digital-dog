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
    pixelId: '1814369106143188',
    
    // Access Token da Meta Conversions API
    // Obtenha em: https://developers.facebook.com/tools/explorer/
    accessToken: 'EAAKemxT6gHEBPR3QGuP9HzvZAAeBQcF39K9NZAy85KJ9mZB6fsNvv8Hku78EsvZCXq9UVAzHLZAr0Eisd2m2UT1mMZC0ambrhMaQj4kpKVhsuH53DITBvgVTPyiemu7msbbvuiVtsyCy4lx3ZC6VMXXM2GqhY1HekSCTNUjlc9mmZAcZCg8AJjPtf5ztpIXkQ0eDPtgZDZD',
    
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