// Initialize the Digital Dog Site
class DigitalDogSite {
    constructor() {
        console.log('🚀 Digital Dog Site initializing...');
        
        // Initialize performance optimization
        this.initPerformanceOptimization();
        
        // Bind methods to this context
        this.init();
    }
    // Portfolio Ticker Setup (horizontal scrolling, vertical images)
    setupPortfolioTicker() {
        const viewport = document.getElementById('portfolioTicker');
        if (!viewport) {
            console.warn('Portfolio ticker viewport not found');
            return;
        }

        const track = viewport.querySelector('.ticker-track');
        if (!track) return;

        // Duplicate items to create seamless loop
        const items = Array.from(track.children);
        if (items.length === 0) return;

        // Ensure enough width to loop
        const cloneOnce = items.map(el => el.cloneNode(true));
        const cloneTwice = items.map(el => el.cloneNode(true));
        cloneOnce.forEach(c => track.appendChild(c));
        cloneTwice.forEach(c => track.appendChild(c));

        // Animation state
        const isMobileTicker = window.innerWidth <= 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        const initialBaseSpeed = isMobileTicker ? 0.5 : 0.25; // mobile mais rápido
        const state = {
            offset: 0,
            speed: initialBaseSpeed
        };

        // Compute total width of first set to wrap (including gap)
        const gap = 24;
        const firstSetWidth = items.reduce((acc, el) => acc + el.offsetWidth + gap, 0);

        const animate = () => {
            state.offset -= state.speed;
            // Wrap quando passar um conjunto completo - usa modulo para loop perfeito
            if (state.offset <= -firstSetWidth) {
                state.offset = state.offset % firstSetWidth;
            }
            track.style.transform = `translate3d(${state.offset}px, 0, 0)`;
            requestAnimationFrame(animate);
        };

        // Start
        requestAnimationFrame(animate);

        // Bloquear context menu e gestos de toque prolongado nas imagens do ticker
        viewport.addEventListener('contextmenu', (e) => {
            if (e.target && (e.target.tagName === 'IMG' || e.target.closest('.ticker-item'))) {
                e.preventDefault();
            }
        });
        viewport.addEventListener('touchstart', (e) => {
            if (e.target && (e.target.tagName === 'IMG' || e.target.closest('.ticker-item'))) {
                e.preventDefault();
            }
        }, { passive: false });
        viewport.addEventListener('mousedown', (e) => {
            if (e.button === 2 && (e.target && (e.target.tagName === 'IMG' || e.target.closest('.ticker-item')))) {
                e.preventDefault();
            }
        });
    }


    // Performance optimization based on device capabilities
    initPerformanceOptimization() {
        const isMobile = window.innerWidth <= 768 || 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0);
        const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
        
        // Add performance class to body for CSS targeting
        document.body.classList.add('performance-mode');
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        if (isLowPerformance || isSlowConnection) {
            document.body.classList.add('low-performance');
            console.log('🔧 Low-performance mode activated');
        }
        
        // Reduce animation complexity on low-end devices
        if (isLowPerformance) {
            // Store original values for potential restoration
            this.originalAnimationSettings = {
                reducedMotion: false
            };
        }
        
        // Performance monitoring
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.monitorPerformance();
            });
        }
    }

    // Monitor performance and adjust accordingly
    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) { // Every second
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // If FPS is consistently low, activate performance mode
                if (fps < 30) {
                    document.body.classList.add('low-fps');
                    console.log(`⚠️ Low FPS detected (${fps}fps), activating performance optimizations`);
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }
    
    init() {
        // Initialize backgrounds (adiar no mobile para melhorar FCP/LCP)
        const isMobile = window.innerWidth <= 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        if (isMobile && 'requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.initTechBackground();
                this.initPortfolioBackground();
                this.initPricingBackground();
                this.initContactBackground();
            }, { timeout: 1500 });
        } else {
            this.initTechBackground();
            this.initPortfolioBackground();
            this.initPricingBackground();
            this.initContactBackground();
        }
        
        // If DOM is already loaded, initialize immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupPortfolioTicker();
                this.setupContactForm();
            });
        } else {
            this.setupPortfolioTicker();
            this.setupContactForm();
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

        // Detect mobile/low-performance devices
        const isMobile = window.innerWidth <= 768 || 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0);
        const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        
        this.shuffleState = {
            cards: Array.from(shuffleContainer.children),
            currentIndex: 0,
            animationDuration: isMobile || isLowPerformance ? 5000 : 4000, // Slower animations
            transitionDuration: isMobile || isLowPerformance ? 800 : 700, // Smoother transitions
            isMobile: isMobile,
            isLowPerformance: isLowPerformance
        };
        
        console.log('Cards found:', this.shuffleState.cards.length);
        console.log('Cards:', this.shuffleState.cards);

        console.log('Shuffle portfolio initialized with', this.shuffleState.cards.length, 'cards');
        console.log('Performance settings:', {
            isMobile: this.shuffleState.isMobile,
            isLowPerformance: this.shuffleState.isLowPerformance,
            animationDuration: this.shuffleState.animationDuration,
            transitionDuration: this.shuffleState.transitionDuration
        });

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
        if (this.shuffleState.isMobile) {
            // Mobile: Skip this completely - ticker handles display
            console.log('📱 Mobile detected - skipping initShuffleEffect');
            return;
        }
        
        // Desktop deck logic
        this.shuffleState.cards.forEach((card, index) => {
            card.classList.remove('active', 'shuffle-out', 'shuffle-in');
            
            const isActive = (index === this.shuffleState.currentIndex);
            
            // Posicionamento baseado na posição atual
            const stackIndex = isActive ? 0 : index;
            const baseOffset = 8;
            const translateX = isActive ? 0 : stackIndex * baseOffset;
            const translateY = isActive ? 0 : stackIndex * baseOffset;
            const rotate = isActive ? 0 : stackIndex * 0.8;
            const scale = isActive ? 1 : Math.max(0.98, 1 - (stackIndex * 0.008));
            
            // Z-index dinâmico
            const zIndex = isActive ? 
                this.shuffleState.cards.length + 10 : 
                (this.shuffleState.cards.length - stackIndex);
            
            console.log(`Desktop: Setting card ${index} (${card.dataset.project}) - active: ${isActive}`);
            this.setElementProps(card, {
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

    // Helper function to set element properties with or without anime.js
    setElementProps(element, props) {
        console.log(`Setting props for ${element.dataset.project}. Using ${this.shuffleState.isMobile || this.shuffleState.isLowPerformance ? 'DIRECT CSS' : 'ANIME.JS'}`);
        try {
            if (this.shuffleState.isMobile || this.shuffleState.isLowPerformance) {
                // Direct style manipulation for better performance
                this.setElementPropsDirectly(element, props);
            } else {
                // Use anime.js for smooth animations
                if (typeof anime !== 'undefined') {
                    // Clean props for anime.js - remove transform if individual properties exist
                    const animeProps = { ...props };
                    if (animeProps.translateX !== undefined || animeProps.translateY !== undefined) {
                        delete animeProps.transform; // Let anime.js handle individual properties
                    }
                    anime.set(element, animeProps);
                } else {
                    // Fallback if anime.js isn't available
                    this.setElementPropsDirectly(element, props);
                }
            }
        } catch (error) {
            console.warn('Error in setElementProps, using fallback:', error);
            // Always fallback to direct style setting if anime.js fails
            this.setElementPropsDirectly(element, props);
        }
    }
    
    // Fallback method for direct style setting
    setElementPropsDirectly(element, props) {
        // Handle transform reset first
        if (props.transform === 'none' || props.transform === '') {
            element.style.transform = '';
            // Don't return early - continue to apply other properties
        } else if (props.translateX !== undefined || props.translateY !== undefined) {
            const tx = props.translateX || 0;
            const ty = props.translateY || 0;
            const rotate = props.rotate || 0;
            const scale = props.scale !== undefined ? props.scale : 1;
            element.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rotate}deg) scale(${scale})`;
        } else if (props.transform && props.transform !== 'none' && props.transform !== '') {
            element.style.transform = props.transform;
        }
        
        // Always apply other properties
        if (props.opacity !== undefined) {
            element.style.opacity = props.opacity;
        }
        if (props.zIndex !== undefined) {
            element.style.zIndex = props.zIndex;
        }
    }
    
    // Helper function to animate elements with or without anime.js
    animateElement(element, props, options = {}) {
        return new Promise((resolve) => {
            if (this.shuffleState.isMobile || this.shuffleState.isLowPerformance) {
                // Direct style manipulation with timeout to simulate animation
                this.setElementPropsDirectly(element, props);
                setTimeout(resolve, options.duration || 300);
            } else if (typeof anime !== 'undefined') {
                // Use anime.js for smooth animations
                anime({
                    targets: element,
                    ...props,
                    ...options,
                    complete: resolve
                });
            } else {
                // Fallback: direct style setting
                this.setElementPropsDirectly(element, props);
                setTimeout(resolve, options.duration || 300);
            }
        });
    }

    setupCardDragFunctionality() {
        const shuffleContainer = document.querySelector('.shuffle-stack');
        if (!shuffleContainer) {
            console.error('Shuffle container not found!');
            return;
        }

        console.log('Setting up drag functionality. isMobile:', this.shuffleState.isMobile, 'window width:', window.innerWidth);
        
        if (this.shuffleState.isMobile) {
            console.log('Setting up mobile ticker');
            // Mobile ticker functionality
            this.setupMobileTicker(shuffleContainer);
        } else {
            console.log('Setting up desktop drag');
            // Desktop drag functionality
            this.setupDesktopDrag(shuffleContainer);
        }
    }

    setupMobileTicker(container) {
        console.log('🎬 Setting up mobile ticker');
        console.log('📦 Container:', container);
        console.log('🃏 Available cards:', this.shuffleState.cards.length);
        
        // Hide desktop shuffle stack
        container.style.display = 'none';
        
        // Create ticker container
        const tickerContainer = document.createElement('div');
        tickerContainer.className = 'portfolio-ticker';
        
        // Create multiple copies for seamless loop
        const cards = [
            ...this.shuffleState.cards, 
            ...this.shuffleState.cards,
            ...this.shuffleState.cards
        ];
        console.log('🔄 Tripled cards for seamless loop:', cards.length);
        
        cards.forEach((card, index) => {
            console.log(`🎴 Creating ticker card ${index} for project: ${card.dataset?.project}`);
            const tickerCard = this.createTickerCard(card);
            tickerContainer.appendChild(tickerCard);
        });
        
        // Replace shuffle-stack with ticker
        const shuffleContainer = container.parentNode;
        console.log('📍 Inserting ticker before:', container);
        shuffleContainer.insertBefore(tickerContainer, container);
        
        // Start animation immediately - even before images load
        tickerContainer.style.animationDelay = '0s';
        tickerContainer.style.visibility = 'visible';
        
        // Update instruction text
        const instructionText = document.querySelector('.shuffle-instruction span');
        if (instructionText) {
            instructionText.textContent = 'PASSE O DEDO PARA PAUSAR';
            console.log('✏️ Updated instruction text');
        }
        
        console.log('✅ Mobile ticker created with', cards.length, 'cards');
        console.log('🎯 Ticker container created:', tickerContainer);
    }
    
    createTickerCard(originalCard) {
        const tickerCard = document.createElement('div');
        tickerCard.className = 'ticker-card';
        
        // Get data from original card
        const title = originalCard.querySelector('h3')?.textContent || 'Projeto';
        const description = originalCard.querySelector('p')?.textContent || 'Descrição do projeto';
        const tags = originalCard.querySelectorAll('.portfolio-tags .tag');
        const projectName = originalCard.dataset.project || 'exemplo.com.br';
        
        // Map project names to images
        const imageMap = {
            'veterinario-florianopolis': '1 - veterinarioflorianopolis.com.br.jpg',
            'aumivet': '2 - aumivet.com.br.jpg', 
            'morganeted': '3 - morganeted.com.br.jpg',
            'rzvet': '4 - rzvet.com.br.jpg',
            'vetberg': '5 - vetberg.com.br.jpg',
            'petshop-araucaria': '6 - petshoparaucaria.com.br.jpg'
        };
        
        const imagePath = `assets/images/prints-portfolio-compactado/${imageMap[projectName] || '1 - veterinarioflorianopolis.com.br.jpg'}`;
        
        tickerCard.innerHTML = `
            <div class="browser-bar">
                <div class="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="browser-url">${projectName}</div>
            </div>
            <div class="card-image">
                <img src="${imagePath}" alt="${title}" loading="eager" decoding="async">
            </div>
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <p class="card-description">${description}</p>
                <div class="card-tags">
                    ${Array.from(tags).map(tag => `<span class="tag">${tag.textContent}</span>`).join('')}
                </div>
            </div>
        `;
        
        return tickerCard;
    }

    setupDesktopDrag(container) {
        // Drag state variables for desktop only
        this.dragState = {
            isDragging: false,
            isAnimating: false,
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
        this.setupEventDelegation(container);
    }

    setupEventDelegation(container) {
        console.log('Setting up desktop drag event delegation');
        
        // Desktop-only mouse events
        container.addEventListener('mousedown', (e) => {
            const card = e.target.closest('.portfolio-card');
            if (card && this.shuffleState.cards.includes(card)) {
                this.handleDragStart(e, card);
            }
        });

        // Set cursor and visual indicators for all cards
        this.shuffleState.cards.forEach(card => {
            card.style.cursor = 'grab';
            card.title = 'Drag to navigate cards';
        });
        
        console.log('Event delegation setup complete for', this.shuffleState.cards.length, 'cards');
        
        // Mobile navigation removed - using swipe only
    }
    
    
    goToNextCard() {
        // Block this desktop function on mobile
        if (this.shuffleState.isMobile) return;
        if (this.dragState.isAnimating) return;
        
        // Move current card to end (same logic as successful drag)
        const currentCard = this.shuffleState.cards[this.shuffleState.currentIndex];
        if (!currentCard) return;
        
        this.dragState.isAnimating = true;
        
        // Animate current card out
        this.animateElement(currentCard, {
            translateX: '-150%',
            rotate: '-25deg',
            scale: 0.7,
            opacity: 0
        }, {
            duration: 400,
            easing: 'easeOutQuad'
        }).then(() => {
            // Move to end and reset
            this.shuffleState.cards.splice(this.shuffleState.currentIndex, 1);
            this.shuffleState.cards.push(currentCard);
            
            this.setElementProps(currentCard, {
                translateX: 0, translateY: 0, rotate: 0, 
                scale: 1, opacity: 1, zIndex: 0,
                transform: 'none'
            });
            currentCard.style.transform = '';
            currentCard.classList.remove('active');
            
            this.shuffleState.currentIndex = 0;
            this.shuffleState.cards[0].classList.add('active');
            
            this.initShuffleEffect();
            this.dragState.isAnimating = false;
        });
    }
    
    goToPreviousCard() {
        // Block this desktop function on mobile
        if (this.shuffleState.isMobile) return;
        if (this.dragState.isAnimating) return;
        
        // Move last card to front
        const lastCard = this.shuffleState.cards[this.shuffleState.cards.length - 1];
        if (!lastCard) return;
        
        this.dragState.isAnimating = true;
        
        // Move last card to front
        this.shuffleState.cards.pop();
        this.shuffleState.cards.unshift(lastCard);
        
        // Current card is no longer active
        const oldActive = document.querySelector('.portfolio-card.active');
        if (oldActive) oldActive.classList.remove('active');
        
        // New first card becomes active
        this.shuffleState.currentIndex = 0;
        lastCard.classList.add('active');
        
        this.initShuffleEffect();
        
        // Short animation delay
        setTimeout(() => {
            this.dragState.isAnimating = false;
        }, 300);
    }

    handleDragStart(e, targetCard = null) {
        // Desktop-only drag functionality
        if (this.dragState.isAnimating) {
            return;
        }
        
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        e.preventDefault();
        
        this.dragState.isDragging = true;
        this.dragState.draggedCard = targetCard || e.currentTarget;
        
        this.dragState.startX = e.clientX;
        this.dragState.currentX = e.clientX;

        // Visual feedback for desktop drag
        this.dragState.draggedCard.classList.add('dragging');
        this.dragState.draggedCard.style.cursor = 'grabbing';
        this.setElementProps(this.dragState.draggedCard, { zIndex: 100 });
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.add('shuffle-dragging');
        
        // Add desktop mouse listeners
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
        
        document.body.style.userSelect = 'none';
    }
    
    // Helper function to clean up drag state
    cleanupDragState() {
        if (this.dragState.draggedCard) {
            this.dragState.draggedCard.classList.remove('dragging');
            this.dragState.draggedCard.style.cursor = 'grab';
            this.dragState.draggedCard.style.transform = '';
            this.dragState.draggedCard.style.opacity = '';
        }
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        if (shuffleContainer) {
            shuffleContainer.classList.remove('shuffle-dragging');
        }
        
        document.body.style.userSelect = '';
        document.body.style.touchAction = '';
        console.log('🔓 Scroll restored - drag ended');
        
        // Remove listeners based on interaction type
        if (this.dragState.isTouchInteraction) {
            document.removeEventListener('touchmove', this.handleDragMove);
            document.removeEventListener('touchend', this.handleDragEnd);
            document.removeEventListener('touchcancel', this.handleDragEnd);
        } else {
            document.removeEventListener('mousemove', this.handleDragMove);
            document.removeEventListener('mouseup', this.handleDragEnd);
        }
        
        this.dragState.draggedCard = null;
        this.dragState.swipeDirection = null;
    }
    
    handleDragMove(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        this.dragState.currentX = e.clientX;
        const deltaX = this.dragState.currentX - this.dragState.startX;
        
        // Desktop drag effects
        const rotation = Math.max(-10, Math.min(10, deltaX * 0.06));
        const scale = Math.max(0.98, 1 - Math.abs(deltaX) * 0.0003);
        const opacity = Math.max(0.9, 1 - Math.abs(deltaX) * 0.001);
        
        this.setElementProps(this.dragState.draggedCard, {
            translateX: deltaX,
            rotate: rotation,
            scale: scale,
            opacity: opacity
        });

        // Visual feedback
        const absX = Math.abs(deltaX);
        if (absX > 30) {
            this.dragState.draggedCard.classList.toggle('swipe-right', deltaX > 0);
            this.dragState.draggedCard.classList.toggle('swipe-left', deltaX < 0);
        } else {
            this.dragState.draggedCard.classList.remove('swipe-left', 'swipe-right');
        }
    }

    handleDragEnd() {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        const deltaX = this.dragState.currentX - this.dragState.startX;
        const shouldChangeCard = Math.abs(deltaX) > this.dragState.threshold;
        
        this.dragState.isDragging = false;
        
        // Clean up visual feedback
        this.dragState.draggedCard.classList.remove('dragging', 'swipe-left', 'swipe-right');
        this.dragState.draggedCard.style.cursor = 'grab';
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.remove('shuffle-dragging');
        
        document.body.style.userSelect = '';
        
        if (shouldChangeCard) {
            // Animation lock
            this.dragState.isAnimating = true;
            
            // Desktop drag animation
            this.animateElement(this.dragState.draggedCard, {
                translateX: deltaX > 0 ? '150%' : '-150%',
                rotate: deltaX > 0 ? '25deg' : '-25deg',
                scale: 0.7,
                opacity: 0
            }, {
                duration: 400,
                easing: 'easeOutQuad'
            }).then(() => {
                this.dragState.isAnimating = false;
                
                const draggedCardElement = this.dragState.draggedCard;
                this.dragState.draggedCard = null;
                
                // Move dragged card to end of array
                const originalIndex = this.shuffleState.cards.indexOf(draggedCardElement);
                if (originalIndex > -1) {
                    this.shuffleState.cards.splice(originalIndex, 1);
                    this.shuffleState.cards.push(draggedCardElement);
                }
                
                // Reset card properties
                this.setElementProps(draggedCardElement, {
                    translateX: 0, translateY: 0, rotate: 0, 
                    scale: 1, opacity: 1, zIndex: 0
                });
                
                draggedCardElement.style.transform = '';
                draggedCardElement.classList.remove('active');
                
                // New active card
                this.shuffleState.currentIndex = 0;
                this.shuffleState.cards[0].classList.add('active');
                
                this.initShuffleEffect();
                if (navigator.vibrate) navigator.vibrate(50);
            });
        } else {
            // Return animation
            this.dragState.isAnimating = true;
            
            this.animateElement(this.dragState.draggedCard, {
                translateX: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            }, {
                duration: 300,
                easing: 'easeOutElastic(1, 0.8)'
            }).then(() => {
                this.dragState.isAnimating = false;
                this.dragState.draggedCard = null;
            });
        }
        
        // Remove desktop listeners
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }

    // Tech Background Animation (Hero Section) - Static grid with radial gradient
    initTechBackground() {
        const canvas = document.getElementById('tech-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
        }

        function draw() {
            const isMobile = width < 768;
            const gridSize = isMobile ? 60 : 100;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

            // Base black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Grid lines first
            ctx.strokeStyle = isMobile ? 'rgba(0, 188, 212, 0.12)' : 'rgba(0, 188, 212, 0.08)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Radial gradient on top - lighter in center, darker at edges
            const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            bgGradient.addColorStop(0, isMobile ? 'rgba(10, 13, 21, 0.7)' : 'rgba(10, 13, 21, 0.6)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);
        }

        window.addEventListener('resize', resize);

        // Initialize
        resize();
    }

    // Portfolio Background Animation - Same as hero
    initPortfolioBackground() {
        const canvas = document.getElementById('portfolio-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
        }

        function draw() {
            const isMobile = width < 768;
            const gridSize = isMobile ? 60 : 100;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

            // Base black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Grid lines first
            ctx.strokeStyle = isMobile ? 'rgba(0, 188, 212, 0.12)' : 'rgba(0, 188, 212, 0.08)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Radial gradient on top - lighter in center, darker at edges
            const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            bgGradient.addColorStop(0, isMobile ? 'rgba(10, 13, 21, 0.7)' : 'rgba(10, 13, 21, 0.6)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);
        }

        window.addEventListener('resize', resize);

        // Initialize
        resize();
    }

    // Pricing Background Animation - Same as hero
    initPricingBackground() {
        const canvas = document.getElementById('pricing-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
        }

        function draw() {
            const isMobile = width < 768;
            const gridSize = isMobile ? 60 : 100;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

            // Base black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Grid lines first
            ctx.strokeStyle = isMobile ? 'rgba(0, 188, 212, 0.12)' : 'rgba(0, 188, 212, 0.08)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Radial gradient on top - lighter in center, darker at edges
            const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            bgGradient.addColorStop(0, isMobile ? 'rgba(10, 13, 21, 0.7)' : 'rgba(10, 13, 21, 0.6)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);
        }

        window.addEventListener('resize', resize);

        // Initialize
        resize();
    }

    // Contact Background Animation - Same as hero
    initContactBackground() {
        const canvas = document.getElementById('contact-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            draw();
        }

        function draw() {
            const isMobile = width < 768;
            const gridSize = isMobile ? 60 : 100;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

            // Base black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Grid lines first
            ctx.strokeStyle = isMobile ? 'rgba(0, 188, 212, 0.12)' : 'rgba(0, 188, 212, 0.08)';
            ctx.lineWidth = 1;

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Radial gradient on top - lighter in center, darker at edges
            const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
            bgGradient.addColorStop(0, isMobile ? 'rgba(10, 13, 21, 0.7)' : 'rgba(10, 13, 21, 0.6)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);
        }

        window.addEventListener('resize', resize);

        // Initialize
        resize();
    }

    // Contact Form Setup
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('form-success-message');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page navigation
            
            // Show loading state
            const submitButton = contactForm.querySelector('.form-submit');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Enviando...</span>';
            submitButton.disabled = true;
            
            // Hide any previous messages
            successMessage.style.display = 'none';
            
            try {
                // Send via AJAX to FormSubmit.co
                const formData = new FormData(contactForm);
                
                const response = await fetch('https://formsubmit.co/joohxd123@gmail.com', {
                    method: 'POST',
                    body: formData
                });

                // Track Lead event for Meta Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Form Submission',
                        source: 'contact_form'
                    });
                }
                
                // Show success message without leaving page
                successMessage.innerHTML = '✅ Formulário enviado com sucesso!';
                successMessage.className = 'form-message form-message-success';
                successMessage.style.display = 'block';
                
                // Clear form
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                // Show error message
                successMessage.innerHTML = '❌ Erro ao enviar. Tente novamente.';
                successMessage.className = 'form-message form-message-error';
                successMessage.style.display = 'block';
            } finally {
                // Restore button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
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

// Make instance globally accessible for debugging
window.digitalDogSite = digitalDogSite;