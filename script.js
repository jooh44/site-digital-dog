// Initialize the Digital Dog Site
class DigitalDogSite {
    constructor() {
        console.log('🚀 Digital Dog Site initializing...');
        
        // Bind methods to this context
        this.init();
    }
    
    init() {
        // Initialize backgrounds
        this.initTechBackground();
        this.initPortfolioBackground();
        
        // If DOM is already loaded, initialize immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupShufflePortfolio();
            });
        } else {
            this.setupShufflePortfolio();
        }
        
        console.log('✅ Digital Dog Site initialized successfully');
    }

    // Shuffle Portfolio Setup
    setupShufflePortfolio() {
        const shuffleContainer = document.querySelector('.shuffle-stack');
        const portfolioCta = document.querySelector('.portfolio-cta');
        
        if (!shuffleContainer) {
            console.error('Shuffle container not found');
            return;
        }

        this.shuffleState = {
            cards: Array.from(shuffleContainer.children),
            currentIndex: 0,
            animationDuration: 3000,
            transitionDuration: 600
        };

        console.log('Shuffle portfolio initialized with', this.shuffleState.cards.length, 'cards');

        // Initialize the shuffle effect
        this.initShuffleEffect();
        this.setupCardDragFunctionality();
        
        // Setup event listeners (indicators removed)

        // Setup portfolio CTA
        if (portfolioCta) {
            portfolioCta.addEventListener('click', () => {
                document.querySelector('#contato').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Setup contact form
        this.setupContactForm();

        // Add debugging functions to window
        window.testDrag = () => {
            console.log('Testing drag functionality...');
            console.log('Shuffle state:', this.shuffleState);
            console.log('All cards:', this.shuffleState.cards.map(card => ({ 
                project: card.dataset.project, 
                cursor: card.style.cursor,
                title: card.title,
                zIndex: getComputedStyle(card).zIndex
            })));
        };
    }

    initShuffleEffect() {
        this.shuffleState.cards.forEach((card, index) => {
            card.classList.remove('active', 'shuffle-out', 'shuffle-in');
            
            const isActive = (index === this.shuffleState.currentIndex);
            
            // Posicionamento baseado na posição atual
            const stackIndex = isActive ? 0 : index;
            const translateX = isActive ? 0 : stackIndex * 8;
            const translateY = isActive ? 0 : stackIndex * 8;
            const rotate = isActive ? 0 : stackIndex * 0.8;
            const scale = isActive ? 1 : Math.max(0.97, 1 - (stackIndex * 0.008));
            
            // Z-index dinâmico
            const zIndex = isActive ? 
                this.shuffleState.cards.length + 10 : 
                (this.shuffleState.cards.length - stackIndex);
            
            anime.set(card, {
                translateX, translateY, rotate, scale, zIndex
            });
            
            if (isActive) {
                card.classList.add('active');
            }
        });
        
        // this.updateIndicators(); // removed indicators
    }

    // updateIndicators() {
    //     const indicators = document.querySelectorAll('.indicator');
    //     indicators.forEach((indicator, index) => {
    //         indicator.classList.toggle('active', index === this.shuffleState.currentIndex);
    //     });
    // }

    setupCardDragFunctionality() {
        const shuffleContainer = document.querySelector('.shuffle-stack');
        if (!shuffleContainer) return;

        // Drag state variables WITH ANIMATION LOCK
        this.dragState = {
            isDragging: false,
            isAnimating: false, // ✅ Animation lock to prevent rapid dragging
            startX: 0,
            currentX: 0,
            draggedCard: null,
            threshold: 50
        };

        // Bind event handler methods to this context
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragMove = this.handleDragMove.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);

        // Use event delegation on the container
        this.setupEventDelegation(shuffleContainer);
    }

    setupEventDelegation(container) {
        console.log('Setting up event delegation for all cards');
        
        // Event delegation on the container
        container.addEventListener('mousedown', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (card && this.shuffleState.cards.includes(card)) {
                this.handleDragStart(e, card);
            }
        });

        container.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (card && this.shuffleState.cards.includes(card)) {
                this.handleDragStart(e, card);
            }
        }, { passive: false });

        // Set cursor and visual indicators for all cards
        this.shuffleState.cards.forEach(card => {
            card.style.cursor = 'grab';
            card.title = 'Drag to navigate cards';
        });
        
        console.log('Event delegation setup complete for', this.shuffleState.cards.length, 'cards');
    }

    handleDragStart(e, targetCard = null) {
        // ✅ ANIMATION PROTECTION: Block drag if animation is in progress
        if (this.dragState.isAnimating) {
            console.log('🚫 Drag blocked: Animation in progress');
            return;
        }

        console.log('Drag start:', e.type, e.button);
        
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        e.preventDefault();
        
        this.dragState.isDragging = true;
        this.dragState.draggedCard = targetCard || e.currentTarget;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        this.dragState.startX = clientX;
        this.dragState.currentX = clientX;

        // Visual feedback
        this.dragState.draggedCard.classList.add('dragging');
        this.dragState.draggedCard.style.cursor = 'grabbing';
        anime.set(this.dragState.draggedCard, { zIndex: 100 });
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.add('shuffle-dragging');
        
        // Add global listeners
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.addEventListener('touchmove', this.handleDragMove, { passive: false });
        document.addEventListener('touchend', this.handleDragEnd);
        
        document.body.style.userSelect = 'none';
    }

    handleDragMove(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        this.dragState.currentX = clientX;
        const deltaX = this.dragState.currentX - this.dragState.startX;
        
        // Calculate transform values
        const rotation = Math.max(-15, Math.min(15, deltaX * 0.08));
        const scale = Math.max(0.95, 1 - Math.abs(deltaX) * 0.0003);
        const opacity = Math.max(0.85, 1 - Math.abs(deltaX) * 0.001);
        
        if (typeof anime !== 'undefined') {
            anime.set(this.dragState.draggedCard, {
                translateX: deltaX,
                rotate: rotation,
                scale: scale,
                opacity: opacity
            });
        }

        // Visual feedback
        if (Math.abs(deltaX) > 20) {
            this.dragState.draggedCard.classList.remove('swipe-left', 'swipe-right');
            this.dragState.draggedCard.classList.add(deltaX > 0 ? 'swipe-right' : 'swipe-left');
        } else {
            this.dragState.draggedCard.classList.remove('swipe-left', 'swipe-right');
        }
    }

    handleDragEnd() {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        const deltaX = this.dragState.currentX - this.dragState.startX;
        const shouldChangeCard = Math.abs(deltaX) > this.dragState.threshold;
        console.log('DragEnd - deltaX:', deltaX, 'shouldChangeCard:', shouldChangeCard);
        
        this.dragState.isDragging = false;
        
        // Remove visual feedback
        this.dragState.draggedCard.classList.remove('dragging', 'swipe-left', 'swipe-right');
        this.dragState.draggedCard.style.cursor = 'grab';
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.remove('shuffle-dragging');
        
        document.body.style.userSelect = '';
        
        if (shouldChangeCard) {
            // ✅ ANIMATION PROTECTION: Set animation lock
            this.dragState.isAnimating = true;
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.dragState.draggedCard,
                    translateX: deltaX > 0 ? '150%' : '-150%',
                    rotate: deltaX > 0 ? '25deg' : '-25deg',
                    scale: 0.7,
                    opacity: 0,
                    duration: 400,
                    easing: 'easeOutQuad',
                    complete: () => {
                        // ✅ CRITICAL: Animation complete - release lock
                        this.dragState.isAnimating = false;
                        
                        const draggedCardElement = this.dragState.draggedCard;
                        this.dragState.draggedCard = null;
                        
                        // Move dragged card to end of array
                        const originalIndex = this.shuffleState.cards.indexOf(draggedCardElement);
                        if (originalIndex > -1) {
                            this.shuffleState.cards.splice(originalIndex, 1);
                            this.shuffleState.cards.push(draggedCardElement);
                        }
                        
                        // Reset properties
                        anime.set(draggedCardElement, {
                            translateX: 0, translateY: 0, rotate: 0, 
                            scale: 1, opacity: 1, zIndex: 0
                        });
                        draggedCardElement.classList.remove('active');
                        
                        // New active card is always first
                        this.shuffleState.currentIndex = 0;
                        this.shuffleState.cards[0].classList.add('active');
                        
                        this.initShuffleEffect();
                        // this.updateIndicators(); // removed indicators

                        if (navigator.vibrate) navigator.vibrate(50);
                    }
                });
            }
        } else {
            // ✅ ANIMATION PROTECTION: Set animation lock for return animation
            this.dragState.isAnimating = true;
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.dragState.draggedCard,
                    translateX: 0,
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 300,
                    easing: 'easeOutElastic(1, 0.8)',
                    complete: () => {
                        this.dragState.isAnimating = false;
                        this.dragState.draggedCard = null;
                    }
                });
            }
        }
        
        // Remove global listeners
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.removeEventListener('touchmove', this.handleDragMove);
        document.removeEventListener('touchend', this.handleDragEnd);
    }

    // Tech Background Animation (Hero Section)
    initTechBackground() {
        const canvas = document.getElementById('tech-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const particleSettings = {
            count: 120,
            minSpeed: 0.05,
            maxSpeed: 0.4,
            minRadius: 0.5,
            maxRadius: 2,
            connectionDistance: 120,
            connectionOpacity: 0.03,
        };

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            particles = [];
            for (let i = 0; i < particleSettings.count; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed) * (Math.random() < 0.5 ? -1 : 1);
                this.vy = (Math.random() * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed) * (Math.random() < 0.5 ? -1 : 1);
                this.radius = Math.random() * (particleSettings.maxRadius - particleSettings.minRadius) + particleSettings.minRadius;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 188, 212, 0.2)';
                ctx.fill();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < particleSettings.connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 188, 212, ${particleSettings.connectionOpacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // Portfolio Background Animation
    initPortfolioBackground() {
        const canvas = document.getElementById('portfolio-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const particleSettings = {
            count: 80,
            minSpeed: 0.05,
            maxSpeed: 0.3,
            minRadius: 0.8,
            maxRadius: 1.8,
            connectionDistance: 100,
            connectionOpacity: 0.03,
        };

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            particles = [];
            for (let i = 0; i < particleSettings.count; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed) * (Math.random() < 0.5 ? -1 : 1);
                this.vy = (Math.random() * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed) * (Math.random() < 0.5 ? -1 : 1);
                this.radius = Math.random() * (particleSettings.maxRadius - particleSettings.minRadius) + particleSettings.minRadius;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 188, 212, 0.3)';
                ctx.fill();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < particleSettings.connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 188, 212, ${particleSettings.connectionOpacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // Contact Form Setup
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const nome = formData.get('nome');
            const email = formData.get('email');
            const telefone = formData.get('telefone');
            const clinica = formData.get('clinica');
            const mensagem = formData.get('mensagem');

            // Create email body
            const emailBody = `Nome: ${nome}%0D%0AEmail: ${email}%0D%0ATelefone: ${telefone}%0D%0AClínica: ${clinica}%0D%0AMensagem: ${mensagem}`;
            const subject = `Contato Digital Dog - ${nome}`;

            // Create mailto link
            const mailtoLink = `mailto:joohxd123@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

            // Try to open email client
            try {
                window.location.href = mailtoLink;
                
                // Show success message
                this.showFormMessage('✅ Redirecionando para seu cliente de email...', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                }, 2000);
                
            } catch (error) {
                // Fallback to WhatsApp
                const whatsappMessage = `Olá! Meu nome é ${nome}. ${mensagem}. Email: ${email}. Telefone: ${telefone}. Clínica: ${clinica}`;
                const whatsappLink = `https://wa.me/5547988109155?text=${encodeURIComponent(whatsappMessage)}`;
                
                window.open(whatsappLink, '_blank');
                this.showFormMessage('📱 Redirecionando para WhatsApp...', 'success');
            }
        });
    }

    // Show form message
    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        
        // Insert message
        const submitButton = document.querySelector('.form-submit');
        submitButton.parentNode.insertBefore(messageEl, submitButton);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Initialize the application
const digitalDogSite = new DigitalDogSite();