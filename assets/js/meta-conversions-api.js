/**
 * Meta Conversions API Integration
 * Envia eventos server-side para melhor tracking e contornar bloqueadores
 */

class MetaConversionsAPI {
    constructor(config = {}) {
        // Usa configuração externa se disponível
        const metaConfig = window.MetaConfig || {};
        
        this.config = {
            pixelId: config.pixelId || metaConfig.pixelId || '766494342759761',
            accessToken: config.accessToken || metaConfig.accessToken,
            datasetId: config.datasetId || metaConfig.datasetId,
            testEventCode: config.testEventCode || metaConfig.testEventCode,
            backendUrl: config.backendUrl || metaConfig.backendUrl || '/api/meta-conversions.php',
            apiVersion: 'v18.0'
        };

        this.initSessionData();
        this.setupEventListeners();
        
        console.log('🎯 Meta Conversions API initialized');
    }

    // Inicializa dados da sessão do usuário
    initSessionData() {
        this.sessionData = {
            fbc: this.getFacebookClickId(),
            fbp: this.getFacebookBrowserId(),
            clientIpAddress: null, // Será capturado via server-side
            clientUserAgent: navigator.userAgent,
            timestamp: Math.floor(Date.now() / 1000)
        };

        // Gerar external_id baseado em dados disponíveis
        this.sessionData.externalId = this.generateExternalId();
    }

    // Captura Facebook Click ID (fbc)
    getFacebookClickId() {
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get('fbclid');
        
        if (fbclid) {
            const timestamp = Math.floor(Date.now() / 1000);
            return `fb.1.${timestamp}.${fbclid}`;
        }
        
        return null;
    }

    // Captura Facebook Browser ID (fbp) 
    getFacebookBrowserId() {
        // Tenta pegar do cookie _fbp
        const fbpCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('_fbp='));
            
        if (fbpCookie) {
            return fbpCookie.split('=')[1];
        }
        
        // Se não existir, gera um novo
        const timestamp = Math.floor(Date.now() / 1000);
        const randomNum = Math.floor(Math.random() * 2147483647);
        const fbp = `fb.1.${timestamp}.${randomNum}`;
        
        // Salva o cookie
        document.cookie = `_fbp=${fbp}; expires=${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
        
        return fbp;
    }

    // Gera um ID externo único para o usuário
    generateExternalId() {
        // Primeiro tenta usar email se disponível
        const emailInputs = document.querySelectorAll('input[type="email"]');
        if (emailInputs.length > 0 && emailInputs[0].value) {
            return this.hashString(emailInputs[0].value.toLowerCase().trim());
        }
        
        // Senão, gera baseado em dados da sessão
        const identifier = `${this.sessionData.clientUserAgent}_${window.location.hostname}_${Date.now()}`;
        return this.hashString(identifier);
    }

    // Hash simples para external_id (em produção, use SHA-256)
    hashString(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString();
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash).toString();
    }

    // Configura listeners para eventos automáticos
    setupEventListeners() {
        // PageView já é enviado pelo pixel, mas podemos reforçar via API
        this.trackPageView();

        // ViewContent - quando usuário rola 50% da página
        this.setupViewContentTracking();

        // Lead - formulário de contato
        this.setupLeadTracking();

        // WhatsApp clicks
        this.setupWhatsAppTracking();
    }

    // Rastreamento de PageView
    trackPageView() {
        this.sendEvent('PageView', {
            content_name: document.title,
            content_category: 'website',
            source_url: window.location.href
        });
    }

    // Rastreamento de ViewContent
    setupViewContentTracking() {
        let viewContentSent = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !viewContentSent) {
                    viewContentSent = true;
                    this.sendEvent('ViewContent', {
                        content_name: 'Digital Dog Homepage',
                        content_category: 'web_design_services',
                        content_ids: ['veterinary_website'],
                        value: 997.00,
                        currency: 'BRL'
                    });
                }
            });
        }, { threshold: 0.5 });

        // Observa quando o usuário vê 50% da hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    // Rastreamento de Lead via formulário
    setupLeadTracking() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                const formData = new FormData(contactForm);
                
                this.sendEvent('Lead', {
                    content_name: 'Contact Form Submission',
                    content_category: 'lead_generation',
                    value: 997.00,
                    currency: 'BRL',
                    custom_data: {
                        lead_type: 'contact_form',
                        service_interest: 'veterinary_website'
                    }
                });
            });
        }
    }

    // Rastreamento de cliques no WhatsApp
    setupWhatsAppTracking() {
        // Todos os elementos com onclick que contém wa.me
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[onclick*="wa.me"], a[href*="wa.me"]');
            if (element) {
                let source = 'unknown';
                
                if (element.closest('.hero')) source = 'hero_section';
                else if (element.closest('.portfolio')) source = 'portfolio_section';
                else if (element.closest('.whatsapp-float')) source = 'floating_button';
                else if (element.closest('.contact')) source = 'contact_section';
                
                this.sendEvent('Lead', {
                    content_name: 'WhatsApp Click',
                    content_category: 'lead_generation',
                    value: 997.00,
                    currency: 'BRL',
                    custom_data: {
                        lead_type: 'whatsapp_click',
                        source: source
                    }
                });
            }
        });
    }

    // Método principal para enviar eventos
    async sendEvent(eventName, eventData = {}) {
        try {
            const payload = {
                data: [{
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_source_url: window.location.href,
                    user_data: {
                        client_ip_address: '{{client_ip_address}}', // Será substituído no servidor
                        client_user_agent: this.sessionData.clientUserAgent,
                        fbc: this.sessionData.fbc,
                        fbp: this.sessionData.fbp,
                        external_id: this.sessionData.externalId
                    },
                    custom_data: {
                        currency: eventData.currency || 'BRL',
                        value: eventData.value || null,
                        content_name: eventData.content_name || '',
                        content_category: eventData.content_category || '',
                        content_ids: eventData.content_ids || [],
                        ...eventData.custom_data
                    }
                }],
                ...(this.config.testEventCode && { test_event_code: this.config.testEventCode })
            };

            // Em produção, isso deve ser enviado via seu servidor backend
            // Por agora, vamos simular o envio e logar para debug
            this.logEvent(eventName, payload);
            
            // TODO: Implementar envio real via backend
            // const response = await this.sendToBackend(payload);
            
        } catch (error) {
            console.error('❌ Erro ao enviar evento para Meta Conversions API:', error);
        }
    }

    // Log para debug (remover em produção)
    logEvent(eventName, payload) {
        console.log(`🎯 Meta Conversions API - ${eventName}:`, {
            event: eventName,
            timestamp: new Date().toISOString(),
            payload: payload
        });

        // Mostra dados importantes no console
        console.table({
            'Event': eventName,
            'FBP': this.sessionData.fbp,
            'FBC': this.sessionData.fbc || 'N/A',
            'External ID': this.sessionData.externalId,
            'URL': window.location.href
        });
    }

    // Método para enviar via backend
    async sendToBackend(payload) {
        if (!this.config.backendUrl) {
            console.warn('⚠️ Backend URL não configurado. Configure MetaConfig.backendUrl');
            return null;
        }

        const response = await fetch(this.config.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pixelId: this.config.pixelId,
                payload: payload
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Método público para enviar eventos customizados
    track(eventName, eventData = {}) {
        this.sendEvent(eventName, eventData);
    }
}

// Inicialização automática quando o script for carregado
window.MetaConversionsAPI = MetaConversionsAPI;

// Auto-inicializar se não estiver sendo importado como módulo
if (typeof module === 'undefined') {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.metaAPI = new MetaConversionsAPI();
        });
    } else {
        window.metaAPI = new MetaConversionsAPI();
    }
}