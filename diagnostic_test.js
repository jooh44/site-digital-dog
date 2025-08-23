// Card Drag Diagnostic Test Script
// This script can be run in the browser console to test the fixes

console.log('🔧 Card Drag Diagnostic Test Starting...');

// Function to test card dragging logic
function testCardDragFix() {
    console.log('\n=== CARD DRAG FIX DIAGNOSTIC ===');
    
    // Check if Digital Dog site exists
    if (typeof digitalDogSite === 'undefined') {
        console.error('❌ digitalDogSite not found');
        return;
    }
    
    // Check shuffle state
    if (!digitalDogSite.shuffleState) {
        console.error('❌ shuffleState not initialized');
        return;
    }
    
    const state = digitalDogSite.shuffleState;
    console.log('✅ Shuffle state found');
    console.log('📊 Current state:', {
        totalCards: state.cards.length,
        currentIndex: state.currentIndex,
        activeCard: state.cards[state.currentIndex]?.dataset.project
    });
    
    // Log current card order
    console.log('📋 Card order:', state.cards.map((card, idx) => ({
        index: idx,
        project: card.dataset.project,
        active: card.classList.contains('active'),
        zIndex: getComputedStyle(card).zIndex
    })));
    
    // Test drag functionality setup
    const container = document.querySelector('.shuffle-stack');
    if (!container) {
        console.error('❌ Shuffle container not found');
        return;
    }
    
    console.log('✅ Shuffle container found');
    console.log('🔧 Container has event delegation:', container._hasEventDelegation || false);
    
    // Check if all cards are draggable
    const allCardsDraggable = state.cards.every(card => 
        card.style.cursor === 'grab' && card.title === 'Drag to navigate cards'
    );
    console.log('🖱️ All cards draggable:', allCardsDraggable);
    
    // Test card positioning
    state.cards.forEach((card, idx) => {
        const styles = getComputedStyle(card);
        const transform = styles.transform;
        const zIndex = styles.zIndex;
        console.log(`Card ${idx} (${card.dataset.project}):`, {
            transform: transform !== 'none' ? transform : 'none',
            zIndex: zIndex,
            active: card.classList.contains('active')
        });
    });
    
    return {
        success: true,
        cardCount: state.cards.length,
        activeCard: state.cards[state.currentIndex]?.dataset.project,
        allDraggable: allCardsDraggable
    };
}

// Function to simulate a card drag
function simulateCardDrag(direction = 'right') {
    console.log(`\n🎯 Simulating ${direction} drag...`);
    
    if (typeof digitalDogSite === 'undefined' || !digitalDogSite.shuffleState) {
        console.error('❌ Cannot simulate - site not ready');
        return;
    }
    
    const state = digitalDogSite.shuffleState;
    const activeCard = state.cards[state.currentIndex];
    const originalOrder = state.cards.map(c => c.dataset.project);
    
    console.log('📝 Before drag:', {
        activeCard: activeCard.dataset.project,
        cardOrder: originalOrder
    });
    
    // Simulate drag end with threshold exceeded
    digitalDogSite.dragState = {
        isDragging: true,
        startX: 0,
        currentX: direction === 'right' ? 100 : -100,
        draggedCard: activeCard,
        threshold: 50
    };
    
    // Call handleDragEnd
    digitalDogSite.handleDragEnd();
    
    // Check results after a delay
    setTimeout(() => {
        const newOrder = state.cards.map(c => c.dataset.project);
        const newActiveCard = state.cards[state.currentIndex];
        
        console.log('📝 After drag:', {
            activeCard: newActiveCard.dataset.project,
            cardOrder: newOrder,
            draggedCardMovedToBack: newOrder[newOrder.length - 1] === originalOrder[0]
        });
        
        console.log('✅ Simulation complete');
    }, 1000);
}

// Export functions to window for console use
window.testCardDragFix = testCardDragFix;
window.simulateCardDrag = simulateCardDrag;

console.log('✅ Diagnostic functions ready!');
console.log('📖 Use testCardDragFix() to run diagnostics');
console.log('📖 Use simulateCardDrag("left") or simulateCardDrag("right") to test');