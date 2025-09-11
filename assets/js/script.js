// Initialize the Digital Dog Site
class DigitalDogSite {
    constructor() {
        console.log('🚀 Digital Dog Site initializing...');
        
        // Initialize performance optimization
        this.initPerformanceOptimization();
        
        // Bind methods to this context
        this.init();
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
        // Initialize backgrounds
        this.initTechBackground();
        this.initPortfolioBackground();
        this.initPricingBackground();
        
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
        this.shuffleState.cards.forEach((card, index) => {
            card.classList.remove('active', 'shuffle-out', 'shuffle-in');
            
            const isActive = (index === this.shuffleState.currentIndex);
            
            // Posicionamento baseado na posição atual
            const stackIndex = isActive ? 0 : index;
            // Reduced complexity for better mobile performance
            const baseOffset = this.shuffleState.isMobile ? 6 : 8;
            const translateX = isActive ? 0 : stackIndex * baseOffset;
            const translateY = isActive ? 0 : stackIndex * baseOffset;
            const rotate = isActive ? 0 : stackIndex * (this.shuffleState.isMobile ? 0.5 : 0.8);
            const scale = isActive ? 1 : Math.max(0.98, 1 - (stackIndex * (this.shuffleState.isMobile ? 0.005 : 0.008)));
            
            // Z-index dinâmico
            const zIndex = isActive ? 
                this.shuffleState.cards.length + 10 : 
                (this.shuffleState.cards.length - stackIndex);
            
            // Optimized animation settings for performance
            const animationSettings = {
                translateX, translateY, rotate, scale, zIndex,
                // Force GPU acceleration and reduce paint operations
                transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`
            };
            
            // Use the helper function to set properties
            console.log(`Setting card ${index} (${card.dataset.project}) - active: ${isActive}, transform: ${animationSettings.transform}, zIndex: ${zIndex}`);
            this.setElementProps(card, {
                ...animationSettings,
                zIndex: zIndex
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
        if (!shuffleContainer) return;

        // Drag state variables - Enhanced with touch/swipe support
        this.dragState = {
            isDragging: false,
            isAnimating: false, // ✅ Animation lock to prevent rapid dragging
            startX: 0,
            startY: 0, // ✅ Track Y position for scroll detection
            currentX: 0,
            currentY: 0,
            draggedCard: null,
            threshold: this.shuffleState.isMobile ? 30 : 50, // Lower threshold for mobile swipe
            isTouchInteraction: false, // ✅ Track if current interaction is touch-based
            swipeDirection: null, // ✅ Track swipe direction (horizontal/vertical)
            minSwipeDistance: 5, // ✅ Balanced detection - fast but not too aggressive
            listenerUpgraded: false, // ✅ Track if we've upgraded to non-passive listener
            updateScheduled: false // ✅ Track RAF scheduling for mobile performance
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
        
        // ✅ Allow natural scroll when touching OUTSIDE cards on mobile
        document.addEventListener('touchstart', (e) => {
            if (this.shuffleState.isMobile) {
                const card = e.target.closest('.portfolio-card');
                const isInContainer = e.target.closest('.shuffle-stack');
                // If touching outside cards but inside container area, allow free scroll
                if (isInContainer && !card) {
                    console.log('🔍 Touch outside cards - allowing free scroll');
                    // Don't capture this event, let natural scroll work
                }
            }
        }, { passive: true });

        container.addEventListener('touchstart', (e) => {
            console.log('🔍 TouchStart event captured on container', e.target);
            const card = e.target.closest('.portfolio-card');
            console.log('🔍 Found card:', card, 'included in cards:', card && this.shuffleState.cards.includes(card));
            if (card && this.shuffleState.cards.includes(card)) {
                console.log('🔍 Calling handleDragStart for touch');
                // ✅ Don't prevent default immediately - let direction detection handle it
                this.handleDragStart(e, card);
            }
        }, { passive: true }); // ✅ Back to passive for initial touch

        // Set cursor and visual indicators for all cards
        this.shuffleState.cards.forEach(card => {
            card.style.cursor = 'grab';
            card.title = 'Drag to navigate cards';
        });
        
        console.log('Event delegation setup complete for', this.shuffleState.cards.length, 'cards');
        
        // Mobile navigation removed - using swipe only
    }
    
    
    goToNextCard() {
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
        // ✅ ANIMATION PROTECTION: Block drag if animation is in progress
        if (this.dragState.isAnimating) {
            console.log('🚫 Drag blocked: Animation in progress');
            return;
        }

        // ✅ INTERACTION TYPE DETECTION: Distinguish between touch and mouse
        const isTouchEvent = e.type.startsWith('touch');
        const isMouseEvent = e.type.startsWith('mouse');
        
        // For mobile devices, only respond to touch events
        if (this.shuffleState.isMobile && isMouseEvent) {
            console.log('📱 Mouse event on mobile ignored - touch swipe only');
            return;
        }
        
        // For desktop devices, only respond to mouse events  
        if (!this.shuffleState.isMobile && isTouchEvent) {
            console.log('🖥️ Touch event on desktop ignored - mouse drag only');
            return;
        }

        console.log('🔍 Interaction start:', e.type, isTouchEvent ? 'SWIPE' : 'DRAG', 
                   'isMobile:', this.shuffleState.isMobile, 
                   'windowWidth:', window.innerWidth,
                   'hasTouch:', 'ontouchstart' in window,
                   'maxTouchPoints:', navigator.maxTouchPoints);
        
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        // ✅ Don't prevent default immediately for touch events - let direction detection decide
        
        this.dragState.isDragging = true;
        this.dragState.draggedCard = targetCard || e.currentTarget;
        this.dragState.isTouchInteraction = isTouchEvent;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        this.dragState.startX = clientX;
        this.dragState.startY = clientY;
        this.dragState.currentX = clientX;
        this.dragState.currentY = clientY;
        this.dragState.swipeDirection = null; // Reset direction
        this.dragState.listenerUpgraded = false; // Reset listener state

        // Always start from clean position for consistent behavior
        this.dragState.initialCardX = 0;

        // Visual feedback based on interaction type
        this.dragState.draggedCard.classList.add(isTouchEvent ? 'swiping' : 'dragging');
        if (!isTouchEvent) {
            this.dragState.draggedCard.style.cursor = 'grabbing';
        }
        this.setElementProps(this.dragState.draggedCard, { zIndex: 100 });
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.add(isTouchEvent ? 'shuffle-swiping' : 'shuffle-dragging');
        
        // Add global listeners based on interaction type
        if (isTouchEvent) {
            // ✅ Start with passive listener, will be upgraded if needed
            document.addEventListener('touchmove', this.handleDragMove, { passive: true });
            document.addEventListener('touchend', this.handleDragEnd);
            // ✅ Safety net for edge cases
            document.addEventListener('touchcancel', this.handleDragEnd);
            console.log('👆 Swipe interaction started on mobile (passive mode)');
        } else {
            document.addEventListener('mousemove', this.handleDragMove);
            document.addEventListener('mouseup', this.handleDragEnd);
            console.log('🖱️ Drag interaction started on desktop');
        }
        
        document.body.style.userSelect = 'none';
    }
    
    // ✅ Helper function to clean up drag state
    cleanupDragState() {
        if (this.dragState.draggedCard) {
            this.dragState.draggedCard.classList.remove('dragging', 'swiping', 'swipe-left', 'swipe-right');
            if (!this.dragState.isTouchInteraction) {
                this.dragState.draggedCard.style.cursor = 'grab';
            }
            this.dragState.draggedCard.style.transform = '';
            this.dragState.draggedCard.style.opacity = '';
        }
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        if (shuffleContainer) {
            shuffleContainer.classList.remove('shuffle-dragging', 'shuffle-swiping');
        }
        
        document.body.style.userSelect = '';
        
        // ✅ CRITICAL: Restore scroll when drag ends
        document.body.style.overflow = '';
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
    
    // ✅ Upgrade touch listener to non-passive when horizontal swipe is detected
    upgradeToNonPassiveListener() {
        if (this.dragState.isTouchInteraction && !this.dragState.listenerUpgraded) {
            console.log('🔧 Upgrading to non-passive touch listener');
            // Remove passive listener
            document.removeEventListener('touchmove', this.handleDragMove);
            // Add non-passive listener
            document.addEventListener('touchmove', this.handleDragMove, { passive: false });
            this.dragState.listenerUpgraded = true;
        }
    }


    handleDragMove(e) {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        // Performance optimization: use requestAnimationFrame for smooth mobile updates
        if (this.shuffleState.isMobile && !this.dragState.updateScheduled) {
            this.dragState.updateScheduled = true;
            requestAnimationFrame(() => {
                this.dragState.updateScheduled = false;
            });
        } else if (this.shuffleState.isMobile && this.dragState.updateScheduled) {
            // Skip this update if one is already scheduled
            return;
        }
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        this.dragState.currentX = clientX;
        this.dragState.currentY = clientY;
        
        const rawDeltaX = this.dragState.currentX - this.dragState.startX;
        const rawDeltaY = this.dragState.currentY - this.dragState.startY;
        
        // ✅ DIRECTION DETECTION: Determine swipe direction for mobile
        if (this.shuffleState.isMobile && !this.dragState.swipeDirection) {
            const absX = Math.abs(rawDeltaX);
            const absY = Math.abs(rawDeltaY);
            
            // Fast detection - 5px threshold for balance
            if (absX > 5 || absY > 5) {
                if (absX > absY * 1.5) {
                    // Horizontal swipe detected
                    this.dragState.swipeDirection = 'horizontal';
                    console.log('🔍 Horizontal swipe detected - enabling drag');
                    e.preventDefault();
                    this.upgradeToNonPassiveListener();
                    // ✅ Lock scroll for horizontal drag
                    document.body.style.overflow = 'hidden';
                    document.body.style.touchAction = 'none';
                    console.log('🔒 Scroll locked - horizontal drag active');
                } else if (absY > absX * 2.0 && absX < 15) {
                    // Clearly vertical scroll
                    this.dragState.swipeDirection = 'vertical';
                    console.log('🔍 Vertical scroll detected - allowing scroll');
                    this.dragState.isDragging = false;
                    this.cleanupDragState();
                    return;
                }
                // If neither condition met, wait for more movement
            }
        }
        
        // If vertical swipe was detected, don't interfere with scroll
        if (this.dragState.swipeDirection === 'vertical') {
            return;
        }
        
        // ✅ CRITICAL: Once horizontal swipe is active, block ALL scrolling
        if (this.dragState.swipeDirection === 'horizontal') {
            e.preventDefault();
            // Also prevent any future scroll attempts during this drag session
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            console.log('🔒 Scroll locked - horizontal drag active');
        }
        const totalTranslateX = this.dragState.initialCardX + rawDeltaX;
        
        // Ultra-optimized transform calculations for mobile performance
        const isMobile = this.shuffleState.isMobile;
        
        if (isMobile) {
            // Simplified mobile calculations for maximum performance
            const rotation = rawDeltaX * 0.025; // No Math.max/min for speed
            const scale = 1 - Math.abs(rawDeltaX) * 0.00008; // Minimal scaling
            
            // Single optimized transform string
            this.dragState.draggedCard.style.transform = 
                `translate3d(${totalTranslateX}px, 0, 0) rotate(${rotation}deg) scale(${scale})`;
            
            // Skip opacity changes on mobile for performance
            // this.dragState.draggedCard.style.opacity = opacity;
        } else {
            // Full desktop experience with all effects
            const rotation = Math.max(-10, Math.min(10, rawDeltaX * 0.06));
            const scale = Math.max(0.98, 1 - Math.abs(rawDeltaX) * 0.0003);
            const opacity = Math.max(0.9, 1 - Math.abs(rawDeltaX) * 0.001);
            
            this.setElementProps(this.dragState.draggedCard, {
                translateX: totalTranslateX,
                rotate: rotation,
                scale: scale,
                opacity: opacity
            });
        }

        // Simplified visual feedback
        const absX = Math.abs(rawDeltaX);
        if (absX > 30) {
            this.dragState.draggedCard.classList.toggle('swipe-right', rawDeltaX > 0);
            this.dragState.draggedCard.classList.toggle('swipe-left', rawDeltaX < 0);
        } else {
            this.dragState.draggedCard.classList.remove('swipe-left', 'swipe-right');
        }
    }

    handleDragEnd() {
        if (!this.dragState.isDragging || !this.dragState.draggedCard) return;
        
        const deltaX = this.dragState.currentX - this.dragState.startX;
        const shouldChangeCard = Math.abs(deltaX) > this.dragState.threshold;
        const isTouchInteraction = this.dragState.isTouchInteraction;
        
        console.log('🔍 Interaction End:', isTouchInteraction ? 'SWIPE' : 'DRAG', 
                   '- deltaX:', deltaX, 'threshold:', this.dragState.threshold, 
                   'shouldChangeCard:', shouldChangeCard, 'absX:', Math.abs(deltaX));
        
        this.dragState.isDragging = false;
        
        // Remove visual feedback based on interaction type
        this.dragState.draggedCard.classList.remove(
            'dragging', 'swiping', 'swipe-left', 'swipe-right'
        );
        if (!isTouchInteraction) {
            this.dragState.draggedCard.style.cursor = 'grab';
        }
        
        const shuffleContainer = document.querySelector('.shuffle-stack');
        shuffleContainer.classList.remove('shuffle-dragging', 'shuffle-swiping');
        
        document.body.style.userSelect = '';
        
        // ✅ CRITICAL: Always restore scroll when interaction ends
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        console.log('🔓 Scroll restored - interaction ended');
        
        if (shouldChangeCard) {
            // ✅ ANIMATION PROTECTION: Set animation lock
            this.dragState.isAnimating = true;
            
            // Use helper function for animation
            this.animateElement(this.dragState.draggedCard, {
                translateX: deltaX > 0 ? '150%' : '-150%',
                rotate: deltaX > 0 ? (this.shuffleState.isMobile ? '20deg' : '25deg') : (this.shuffleState.isMobile ? '-20deg' : '-25deg'),
                scale: this.shuffleState.isMobile ? 0.75 : 0.7,
                opacity: 0
            }, {
                duration: this.shuffleState.isMobile ? 500 : 400,
                easing: 'easeOutQuad'
            }).then(() => {
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
                
                // ✅ CRITICAL: Complete reset to ensure clean state for next drag
                this.setElementProps(draggedCardElement, {
                    translateX: 0, translateY: 0, rotate: 0, 
                    scale: 1, opacity: 1, zIndex: 0,
                    transform: 'none'  // Force clean transform state
                });
                
                // Additional cleanup to prevent transform accumulation
                draggedCardElement.style.transform = '';
                draggedCardElement.classList.remove('active');
                
                // New active card is always first
                this.shuffleState.currentIndex = 0;
                this.shuffleState.cards[0].classList.add('active');
                
                this.initShuffleEffect();
                // this.updateIndicators(); // removed indicators

                if (navigator.vibrate) navigator.vibrate(50);
            });
        } else {
            // ✅ ANIMATION PROTECTION: Set animation lock for return animation
            this.dragState.isAnimating = true;
            
            // Use helper function for return animation
            this.animateElement(this.dragState.draggedCard, {
                translateX: 0,
                rotate: 0,
                scale: 1,
                opacity: 1
            }, {
                duration: this.shuffleState.isMobile ? 400 : 300,
                easing: this.shuffleState.isMobile ? 'easeOutBack(1.2)' : 'easeOutElastic(1, 0.8)'
            }).then(() => {
                this.dragState.isAnimating = false;
                this.dragState.draggedCard = null;
            });
        }
        
        // Remove global listeners based on interaction type
        if (isTouchInteraction) {
            document.removeEventListener('touchmove', this.handleDragMove);
            document.removeEventListener('touchend', this.handleDragEnd);
            document.removeEventListener('touchcancel', this.handleDragEnd);
        } else {
            document.removeEventListener('mousemove', this.handleDragMove);
            document.removeEventListener('mouseup', this.handleDragEnd);
        }
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

    // Pricing Background Animation
    initPricingBackground() {
        const canvas = document.getElementById('pricing-background');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const particleSettings = {
            count: 60,
            minSpeed: 0.03,
            maxSpeed: 0.2,
            minRadius: 0.5,
            maxRadius: 1.5,
            connectionDistance: 120,
            connectionOpacity: 0.02,
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
                ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
                ctx.fill();
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < particleSettings.connectionDistance) {
                        const opacity = (1 - distance / particleSettings.connectionDistance) * particleSettings.connectionOpacity;
                        ctx.strokeStyle = `rgba(255, 107, 53, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize);
        animate();
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