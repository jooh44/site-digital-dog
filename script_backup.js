// Shuffle Portfolio Setup
    setupShufflePortfolio() {
        const shuffleContainer = document.querySelector('.shuffle-stack');
        const indicators = document.querySelectorAll('.indicator');
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
        
        // Setup event listeners
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToCard(index));
        });

        // Setup portfolio CTA
        if (portfolioCta) {
            portfolioCta.addEventListener('click', () => {
                document.querySelector('#contato').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Add a test function to window for debugging
        // Enhanced debugging and performance monitoring
        window.testDrag = () => {
            console.log('Testing drag functionality...');
            console.log('Shuffle state:', this.shuffleState);
            console.log('All cards:', this.shuffleState.cards.map(card => ({ 
                project: card.dataset.project, 
                cursor: card.style.cursor,
                title: card.title,
                zIndex: getComputedStyle(card).zIndex
            })));
            console.log('Container has delegation:', shuffleContainer._hasEventDelegation || 'Set up via container listeners');
            
            // Test if all cards have correct styling
            const allCardsReady = this.shuffleState.cards.every(card => 
                card.style.cursor === 'grab' && card.title === 'Drag to navigate cards'
            );
            console.log('All cards ready for dragging:', allCardsReady);
        };
        
        // Enhanced performance monitoring for smooth animations
        window.checkDragPerformance = () => {
            const cards = this.shuffleState.cards;
            console.log('🎯 Enhanced Drag Performance Check:');
            console.log('- Total cards:', cards.length);
            console.log('- GPU acceleration:', cards.every(card => 
                getComputedStyle(card).willChange.includes('transform')
            ));
            console.log('- 3D transforms supported:', 
                'perspective' in document.documentElement.style
            );
            console.log('- Backface visibility optimized:', cards.every(card =>
                getComputedStyle(card).backfaceVisibility === 'hidden'
            ));
            console.log('- Active drag state:', this.dragState.isDragging ? '🔥 Active' : '💤 Idle');
            console.log('- Timeline animations supported:', typeof anime !== 'undefined' && typeof anime.timeline === 'function');
            console.log('- Stagger effects available:', typeof anime !== 'undefined' && typeof anime.stagger === 'function');
            
            // Check easing functions
            console.log('- Custom easing available:', {
                easeOutQuart: typeof this.easeOutQuart === 'function',
                easeOutCubic: typeof this.easeOutCubic === 'function',
                easeOutElastic: typeof this.easeOutElastic === 'function'
            });

            // Check current stack positioning
            console.log('- Current stack state:', this.shuffleState.cards.map((card, index) => ({
                project: card.dataset.project,
                isActive: card.classList.contains('active'),
                zIndex: getComputedStyle(card).zIndex,
                transform: getComputedStyle(card).transform
            })));
        };

        // New debugging utility for stack verification
        window.verifyStackPositioning = () => {
            console.log('🔍 Verifying stack positioning...');
            
            const activeCardIndex = this.shuffleState.currentIndex;
            const activeCard = this.shuffleState.cards[activeCardIndex];
            
            console.log('📍 Active card:', activeCard.dataset.project, 'at index', activeCardIndex);
            
            // Check if active card is properly positioned
            const activeStyle = getComputedStyle(activeCard);
            const isActiveProperlyPositioned = 
                activeStyle.transform === 'matrix(1, 0, 0, 1, 0, 0)' || // identity matrix
                activeStyle.transform === 'none';
                
            console.log('✅ Active card properly centered:', isActiveProperlyPositioned);
            
            // Check stack order and positioning
            this.shuffleState.cards.forEach((card, index) => {
                const style = getComputedStyle(card);
                const isActive = index === activeCardIndex;
                
                console.log(`Card ${index} (${card.dataset.project}):`, {
                    active: isActive,
                    zIndex: style.zIndex,
                    transform: style.transform,
                    opacity: style.opacity
                });
            });
            
            return { activeProperlyPositioned: isActiveProperlyPositioned };
        };

        // Stack reset utility for debugging
        window.forceStackReset = () => {
            console.log('🔧 Force resetting stack...');
            this.resetStackWithTimeline(() => {
                console.log('✅ Stack force reset complete');
                window.verifyStackPositioning();
            });
        };
    }

    initShuffleEffect() {
        this.shuffleState.cards.forEach((card, index) => {
            card.classList.remove('active', 'shuffle-out', 'shuffle-in');
            
            const isActive = (index === this.shuffleState.currentIndex);
            
            // ✅ CORRETO: Posicionamento baseado na posição atual
            const stackIndex = isActive ? 0 : index;
            const translateX = isActive ? 0 : stackIndex * 8;  // Ainda mais sutil
            const translateY = isActive ? 0 : stackIndex * 8;  // Ainda mais sutil
            const rotate = isActive ? 0 : stackIndex * 0.8;    // Rotação bem sutil
            const scale = isActive ? 1 : Math.max(0.97, 1 - (stackIndex * 0.008)); // Diferença mínima
            
            // ✅ CRÍTICO: Z-index dinâmico
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
        
        this.updateIndicators();
    }

    nextCard() {
        const currentCard = this.shuffleState.cards[this.shuffleState.currentIndex];
        const nextIndex = (this.shuffleState.currentIndex + 1) % this.shuffleState.cards.length;
        const nextCard = this.shuffleState.cards[nextIndex];

        this.animateCardTransition(currentCard, nextCard, () => {
            this.shuffleState.currentIndex = nextIndex;
            this.updateIndicators();
        });
    }

    goToCard(index) {
        if (index === this.shuffleState.currentIndex) return;

        console.log(`🎯 Going to card ${index}...`);
        
        const currentCard = this.shuffleState.cards[this.shuffleState.currentIndex];
        const targetCard = this.shuffleState.cards[index];

        this.animateCardTransitionWithStagger(currentCard, targetCard, () => {
            // Clean state management
            currentCard.classList.remove('active');
            targetCard.classList.add('active');
            
            this.shuffleState.currentIndex = index;
            
            // Reset entire stack with timeline for perfect positioning
            this.resetStackWithTimeline(() => {
                this.updateIndicators();
                console.log(`✅ Successfully moved to card: ${targetCard.dataset.project}`);
            });
        });

        // Restart animation if playing
        if (this.shuffleState.isPlaying) {
            this.startShuffleAnimation();
        }
    }

    animateCardTransition(currentCard, nextCard, callback) {
        console.log('🔄 Using enhanced card transition...');
        
        // Delegate to enhanced transition method with stagger effects
        return this.animateCardTransitionWithStagger(currentCard, nextCard, () => {
            // Clean state management
            currentCard.classList.remove('active');
            nextCard.classList.add('active');
            
            // Reset to perfect stack after transition
            this.resetStackWithTimeline(() => {
                if (callback) callback();
            });
        });
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.shuffleState.currentIndex);
        });
    }

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

        // Use event delegation on the container instead of individual cards
        this.setupEventDelegation(shuffleContainer);
    }

    setupEventDelegation(container) {
        console.log('Setting up event delegation for all cards');
        
        // Set up event delegation on the container
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
        
        // Mark container as having event delegation for debugging
        container._hasEventDelegation = true;
        
        // Verify all cards are properly configured
        setTimeout(() => {
            const problemCards = this.shuffleState.cards.filter(card => 
                card.style.cursor !== 'grab' || card.title !== 'Drag to navigate cards'
            );
            if (problemCards.length > 0) {
                console.warn('Cards not properly configured:', problemCards);
            } else {
                console.log('All cards successfully configured for dragging!');
            }
        }, 100);
    }

    // Placeholder for shuffle animation control
    pauseShuffleAnimation() {
        console.log('Shuffle animation paused.');
        this.shuffleState.isPlaying = false;
    }

    resumeShuffleAnimation() {
        console.log('Shuffle animation resumed.');
        this.shuffleState.isPlaying = true;
    }

    handleDragStart(e, targetCard = null) {
        // ✅ ANIMATION PROTECTION: Block drag if animation is in progress
        if (this.dragState.isAnimating) {
            console.log('🚫 Drag blocked: Animation in progress');
            return;
        }

        console.log('Drag start:', e.type, e.button);
        
        // Only handle left mouse button or touch
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        e.preventDefault();
        
        this.dragState.isDragging = true;
        // Use targetCard if provided (from event delegation), otherwise fall back to currentTarget
        this.dragState.draggedCard = targetCard || e.currentTarget;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        this.dragState.startX = clientX;
        this.dragState.currentX = clientX;
        console.log('DragStart - startX:', this.dragState.startX, 'draggedCard:', this.dragState.draggedCard.dataset.project);

        // Pause shuffle animation during drag
        this.pauseShuffleAnimation();
        
        // Add visual feedback and ensure dragged card is on top
        this.dragState.draggedCard.classList.add('dragging');
        this.dragState.draggedCard.style.cursor = 'grabbing';
        anime.set(this.dragState.draggedCard, { zIndex: 100 }); // Ensure it's on top during drag
        
        // Subtle haptic feedback on drag start
        if (navigator.vibrate) navigator.vibrate([10]); // Very subtle start feedback
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.add('shuffle-dragging');
        
        // Add global move and end listeners
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.addEventListener('touchmove', this.handleDragMove, { passive: false });
        document.addEventListener('touchend', this.handleDragEnd);
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    }

    handleDragMove(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        this.dragState.currentX = clientX;
        const deltaX = this.dragState.currentX - this.dragState.startX;
        
        // Calculate transform values for the dragged card
        const rotation = Math.max(-15, Math.min(15, deltaX * 0.08));
        const scale = Math.max(0.95, 1 - Math.abs(deltaX) * 0.0003);
        const opacity = Math.max(0.85, 1 - Math.abs(deltaX) * 0.001);
        
        // Apply transforms to the dragged card
        if (typeof anime !== 'undefined') {
            anime.set(this.dragState.draggedCard, {
                translateX: deltaX,
                rotate: rotation,
                scale: scale,
                opacity: opacity
            });
        }
        
        // Determine the next card based on drag direction
        const direction = deltaX > 0 ? 1 : -1;
        let nextIndex;
        if (direction > 0) {
            nextIndex = (this.shuffleState.currentIndex - 1 + this.shuffleState.cards.length) % this.shuffleState.cards.length;
        } else {
            nextIndex = (this.shuffleState.currentIndex + 1) % this.shuffleState.cards.length;
        }
        const nextCard = this.shuffleState.cards[nextIndex];

        // Apply subtle transforms to the next card to make it appear
        if (nextCard && typeof anime !== 'undefined') {
            const revealAmount = Math.min(1, Math.abs(deltaX) / this.dragState.threshold);
            const nextCardTranslateX = direction * -20 + (direction * 20 * (1 - revealAmount));
            const nextCardScale = 0.98 + (0.02 * revealAmount);
            const nextCardOpacity = 0.5 + (0.5 * revealAmount);

            anime.set(nextCard, {
                translateX: nextCardTranslateX,
                scale: nextCardScale,
                opacity: nextCardOpacity,
                zIndex: this.shuffleState.cards.length - 1
            });
        }

        // Add directional visual feedback
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
        
        // Reset drag state
        this.dragState.isDragging = false;
        
        // Remove visual feedback
        this.dragState.draggedCard.classList.remove('dragging', 'swipe-left', 'swipe-right');
        this.dragState.draggedCard.style.cursor = 'grab';
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.remove('shuffle-dragging');
        
        // Reset body styles
        document.body.style.userSelect = '';
        
        if (shouldChangeCard) {
            // ✅ ANIMATION PROTECTION: Set animation lock
            this.dragState.isAnimating = true;
            
            // Determine direction and calculate target index
            const direction = deltaX > 0 ? 1 : -1;
            let targetIndex;
            
            if (direction > 0) {
                // Swipe right - go to next card
                targetIndex = (this.shuffleState.currentIndex + 1) % this.shuffleState.cards.length;
            } else {
                // Swipe left - go to previous card
                targetIndex = (this.shuffleState.currentIndex - 1 + this.shuffleState.cards.length) % this.shuffleState.cards.length;
            }
            
            // Animate card exit with anime.js if available
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this.dragState.draggedCard,
                    translateX: deltaX > 0 ? '150%' : '-150%', // Move further out
                    rotate: deltaX > 0 ? '25deg' : '-25deg', // More rotation
                    scale: 0.7, // Smaller as it moves away
                    opacity: 0,
                    duration: 400, // Slightly longer duration
                    easing: 'easeOutQuad',
                    complete: () => {
                        // ✅ CRITICAL: Animation complete - release lock
                        this.dragState.isAnimating = false;
                        
                        // ✅ CRÍTICO: Reordenamento correto
                        const draggedCardElement = this.dragState.draggedCard;
                        
                        // 1. Limpar referência ANTES do reordenamento
                        this.dragState.draggedCard = null;
                        
                        // Re-order the cards array: move dragged card to the end (back of deck)
                        // 2. Mover card para final do array
                        const originalIndex = this.shuffleState.cards.indexOf(draggedCardElement);
                        if (originalIndex > -1) {
                            this.shuffleState.cards.splice(originalIndex, 1);
                            this.shuffleState.cards.push(draggedCardElement);
                        }
                        
                        // 3. Resetar propriedades do card movido
                        anime.set(draggedCardElement, {
                            translateX: 0, translateY: 0, rotate: 0, 
                            scale: 1, opacity: 1, zIndex: 0
                        });
                        draggedCardElement.classList.remove('active');
                        
                        // 4. Novo card ativo é sempre o primeiro
                        this.shuffleState.currentIndex = 0;
                        this.shuffleState.cards[0].classList.add('active');
                        
                        // 5. Reaplicar posições da pilha
                        this.initShuffleEffect();
                        this.updateIndicators();

                        // Provide haptic feedback on mobile
                        if (navigator.vibrate) navigator.vibrate(50);
                    }
                });
            } else {
                // Fallback animation (simplified)
                this.dragState.draggedCard.style.transition = 'all 0.4s ease-out';
                this.dragState.draggedCard.style.transform = `translateX(${deltaX > 0 ? '150%' : '-150%'}) rotate(${deltaX > 0 ? '25deg' : '-25deg'}) scale(0.7)`;
                this.dragState.draggedCard.style.opacity = '0';
                
                setTimeout(() => {
                    // ✅ Release animation lock
                    this.dragState.isAnimating = false;
                    
                    // Store reference to dragged card before nullifying
                    const draggedCardElement = this.dragState.draggedCard;
                    this.dragState.draggedCard = null;
                    
                    const originalIndex = this.shuffleState.cards.indexOf(draggedCardElement);
                    if (originalIndex > -1) {
                        this.shuffleState.cards.splice(originalIndex, 1);
                        this.shuffleState.cards.push(draggedCardElement);
                    }
                    
                    draggedCardElement.style.transition = '';
                    draggedCardElement.style.transform = '';
                    draggedCardElement.style.opacity = '';
                    draggedCardElement.classList.remove('active');

                    this.shuffleState.currentIndex = 0;
                    const newActiveCard = this.shuffleState.cards[0];
                    newActiveCard.classList.add('active');
                    this.initShuffleEffect();
                    this.updateIndicators();
                    
                    if (navigator.vibrate) navigator.vibrate(50);
                }, 400);
            }
            
        } else {
            // ✅ ANIMATION PROTECTION: Set animation lock for return animation
            this.dragState.isAnimating = true;
            
            // Animate back to original position
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
                        // ✅ Release animation lock
                        this.dragState.isAnimating = false;
                        this.dragState.draggedCard = null;
                    }
                });
            } else {
                // Fallback animation
                this.dragState.draggedCard.style.transition = 'all 0.3s ease-out';
                this.dragState.draggedCard.style.transform = '';
                this.dragState.draggedCard.style.opacity = '';
                
                setTimeout(() => {
                    // ✅ Release animation lock
                    this.dragState.isAnimating = false;
                    if (this.dragState.draggedCard) {
                        this.dragState.draggedCard.style.transition = '';
                        this.dragState.draggedCard = null;
                    }
                }, 300);
            }
        }
        
        // Resume shuffle animation after a delay
        if (this.shuffleState.isPlaying) {
            setTimeout(() => this.resumeShuffleAnimation(), 1000);
        }
        
        // Remove global listeners
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.removeEventListener('touchmove', this.handleDragMove);
        document.removeEventListener('touchend', this.handleDragEnd);
    }

    // Enhanced stack reset with timeline coordination
    resetStackWithTimeline(callback) {
        console.log('🔄 Resetting stack with timeline coordination...');
        
        const resetTimeline = anime.timeline({
            easing: 'easeOutCubic',
            duration: 400,
            complete: () => {
                console.log('✅ Stack reset complete');
                if (callback) callback();
            }
        });

        // Reset all cards to perfect stack positions using staggered animation
        this.shuffleState.cards.forEach((card, index) => {
            const isActive = (index === this.shuffleState.currentIndex);
            
            if (isActive) {
                // Active card: perfect center position with slight emphasis
                resetTimeline.add({
                    targets: card,
                    translateX: 0,
                    translateY: 0,
                    rotate: 0,
                    rotateY: 0,
                    scale: 1,
                    opacity: 1,
                    zIndex: 100,
                    duration: 500,
                    easing: 'easeOutBack(1.2)'
                }, 0); // Start immediately
            } else {
                // Non-active cards: clean stack with stagger effect
                const stackPosition = index > this.shuffleState.currentIndex ? 
                    index - this.shuffleState.currentIndex : 
                    (this.shuffleState.cards.length - this.shuffleState.currentIndex) + index;
                
                const stackOffset = stackPosition * 8;
                const stackScale = Math.max(0.95, 1 - (stackPosition * 0.01));
                const stackOpacity = Math.max(0.7, 1 - (stackPosition * 0.05));
                const stackZIndex = 99 - stackPosition;
                const staggerDelay = stackPosition * 50; // Stagger for smooth effect
                
                resetTimeline.add({
                    targets: card,
                    translateX: stackOffset,
                    translateY: stackOffset,
                    rotate: stackPosition * 0.5,
                    rotateY: 0,
                    scale: stackScale,
                    opacity: stackOpacity,
                    zIndex: stackZIndex,
                    duration: 400,
                    easing: 'easeOutCubic'
                }, staggerDelay); // Staggered entry
            }
        });
        
        return resetTimeline;
    }

    // Enhanced transition with stagger effects
    animateCardTransitionWithStagger(currentCard, nextCard, callback) {
        console.log('🎭 Enhanced card transition with stagger effects...');
        
        const transitionTimeline = anime.timeline({
            easing: 'easeOutCubic',
            complete: () => {
                console.log('✨ Enhanced transition complete');
                if (callback) callback();
            }
        });

        // Exit animation for current card
        transitionTimeline.add({
            targets: currentCard,
            translateX: '-120%',
            rotate: '-20deg',
            rotateY: '-10deg',
            scale: 0.8,
            opacity: 0,
            duration: 600,
            easing: 'easeOutCubic'
        });

        // Entrance animation for next card with stagger
        transitionTimeline.add({
            targets: nextCard,
            translateX: [120, 0],
            rotate: ['20deg', 0],
            rotateY: ['10deg', 0],
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 700,
            easing: 'easeOutBack(1.3)'
        }, '-=300'); // Overlap animations

        // Stagger effect for background cards
        const backgroundCards = this.shuffleState.cards.filter(card => 
            card !== currentCard && card !== nextCard
        );
        
        if (backgroundCards.length > 0) {
            transitionTimeline.add({
                targets: backgroundCards,
                scale: [0.94, 0.96, 0.95],
                translateX: (el, i) => {
                    const offset = (i + 1) * 8;
                    return [offset + 5, offset - 2, offset];
                },
                translateY: (el, i) => {
                    const offset = (i + 1) * 8;
                    return [offset + 3, offset - 1, offset];
                },
                duration: 400,
                delay: anime.stagger(80, {start: 100}),
                easing: 'outSine'
            }, '-=400');
        }

        return transitionTimeline;
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
            connectionOpacity: 0.08,
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
                ctx.fillStyle = 'rgba(0, 188, 212, 0.4)';
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
    }// Initialize the Digital Dog Site
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
    
    // All the methods are already defined in the current file - they need to be moved here
    // For now, we'll add them manually by prepending this at the beginning of the file
}

// Initialize the application
const digitalDogSite = new DigitalDogSite();