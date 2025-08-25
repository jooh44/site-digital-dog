// Deep Gesture Detection Testing
import { test, expect } from '@playwright/test';

test.describe('Gesture Detection Deep Analysis', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.waitForFunction(() => window.digitalDogSite !== undefined);
    await page.waitForSelector('.shuffle-stack', { state: 'visible' });
    
    // Navigate to portfolio section
    await page.evaluate(() => {
      document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
  });

  test('DETAILED: Gesture detection thresholds and ratios', async ({ page }) => {
    console.log('🔬 Deep analysis of gesture detection...');
    
    // Enable verbose console logging
    await page.evaluate(() => {
      // Temporarily override the handleDragMove function to add more logging
      const originalHandleDragMove = window.digitalDogSite.handleDragMove;
      window.digitalDogSite.handleDragMove = function(e) {
        if (this.dragState.isDragging && this.dragState.draggedCard) {
          const clientX = e.clientX || (e.touches && e.touches[0].clientX);
          const clientY = e.clientY || (e.touches && e.touches[0].clientY);
          const rawDeltaX = clientX - this.dragState.startX;
          const rawDeltaY = clientY - this.dragState.startY;
          
          console.log(`🔍 GESTURE ANALYSIS: deltaX=${rawDeltaX.toFixed(1)}, deltaY=${rawDeltaY.toFixed(1)}, absX=${Math.abs(rawDeltaX).toFixed(1)}, absY=${Math.abs(rawDeltaY).toFixed(1)}, ratio=${(Math.abs(rawDeltaX) / Math.abs(rawDeltaY)).toFixed(2)}`);
          
          if (this.dragState.allowDrag && (Math.abs(rawDeltaX) > 15 || Math.abs(rawDeltaY) > 15)) {
            const isHorizontalGesture = Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.5;
            console.log(`🎯 GESTURE DECISION: movement > 15px, isHorizontal=${isHorizontalGesture}, threshold=1.5x`);
            
            if (!isHorizontalGesture) {
              console.log('🔄 CANCELING DRAG: Vertical gesture detected');
            } else {
              console.log('➡️ CONTINUING DRAG: Horizontal gesture confirmed');
            }
          }
        }
        return originalHandleDragMove.call(this, e);
      };
    });
    
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
      if (msg.text().includes('GESTURE') || msg.text().includes('🔄') || msg.text().includes('➡️')) {
        console.log(`📝 ${msg.text()}`);
      }
    });
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      console.log('\n🧪 TEST 1: Pure vertical gesture (should cancel drag)');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForTimeout(50);
      
      // Move 5px horizontal, 30px vertical (ratio = 0.17, should cancel)
      await page.mouse.move(centerX + 5, centerY - 30);
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      console.log('\n🧪 TEST 2: Pure horizontal gesture (should continue drag)');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForTimeout(50);
      
      // Move 60px horizontal, 10px vertical (ratio = 6.0, should continue)
      await page.mouse.move(centerX + 60, centerY + 10);
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      console.log('\n🧪 TEST 3: Borderline case - exactly 1.5x ratio');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForTimeout(50);
      
      // Move 30px horizontal, 20px vertical (ratio = 1.5, borderline)
      await page.mouse.move(centerX + 30, centerY + 20);
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      console.log('\n🧪 TEST 4: Diagonal gesture favoring vertical');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForTimeout(50);
      
      // Move 20px horizontal, 40px vertical (ratio = 0.5, should cancel)
      await page.mouse.move(centerX + 20, centerY + 40);
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
    }
    
    // Analyze the logs
    const gestureAnalysisLogs = consoleLogs.filter(log => log.includes('GESTURE ANALYSIS'));
    const decisionLogs = consoleLogs.filter(log => log.includes('GESTURE DECISION'));
    const cancelLogs = consoleLogs.filter(log => log.includes('CANCELING DRAG'));
    const continueLogs = consoleLogs.filter(log => log.includes('CONTINUING DRAG'));
    
    console.log(`\n📊 ANALYSIS SUMMARY:`);
    console.log(`   Analysis logs: ${gestureAnalysisLogs.length}`);
    console.log(`   Decision logs: ${decisionLogs.length}`);
    console.log(`   Cancel actions: ${cancelLogs.length}`);
    console.log(`   Continue actions: ${continueLogs.length}`);
    
    // Expect that gesture detection is working (should have some analysis logs)
    expect(gestureAnalysisLogs.length).toBeGreaterThan(0);
    
    console.log('✅ Gesture detection analysis completed');
  });

  test('Edge cases: Small movements and threshold testing', async ({ page }) => {
    console.log('🧪 Testing small movements and thresholds...');
    
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      console.log('🧪 TEST 1: Movement under 15px threshold');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      
      // Move only 10px (under threshold)
      await page.mouse.move(centerX + 10, centerY - 5);
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(300);
      
      console.log('🧪 TEST 2: Movement exactly at 15px threshold');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      
      // Move exactly 15px
      await page.mouse.move(centerX + 15, centerY);
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(300);
      
      console.log('🧪 TEST 3: Movement just over 15px threshold');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      
      // Move 16px (just over threshold)
      await page.mouse.move(centerX + 16, centerY);
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }
    
    const thresholdLogs = consoleLogs.filter(log => 
      log.includes('movement > 15px') || log.includes('GESTURE DECISION')
    );
    
    console.log(`📊 Threshold detection logs: ${thresholdLogs.length}`);
    console.log('✅ Threshold testing completed');
  });

  test('Multi-device viewport behavior', async ({ page }) => {
    console.log('🧪 Testing behavior across different viewport sizes...');
    
    // Test different mobile viewport sizes
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 360, height: 740, name: 'Galaxy S8' },
      { width: 390, height: 844, name: 'iPhone 12' },
      { width: 428, height: 926, name: 'iPhone 12 Pro Max' }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing on ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Check if portfolio deck is still functional
      const activeCard = page.locator('.portfolio-card.active').first();
      await expect(activeCard).toBeVisible();
      
      const cardBox = await activeCard.boundingBox();
      
      if (cardBox) {
        // Test basic drag functionality
        await page.mouse.move(cardBox.x + cardBox.width/2, cardBox.y + cardBox.height/2);
        await page.mouse.down();
        await page.waitForTimeout(50);
        
        const isDragging = await activeCard.evaluate(el => el.classList.contains('dragging'));
        
        await page.mouse.up();
        
        console.log(`   ✅ Drag functionality: ${isDragging ? 'Working' : 'Not working'}`);
        expect(isDragging).toBe(true);
      }
    }
    
    console.log('✅ Multi-viewport testing completed');
  });

  test('Performance during rapid gestures', async ({ page }) => {
    console.log('🧪 Testing performance during rapid gesture interactions...');
    
    const performanceMarks = [];
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Perform rapid gestures
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        
        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + (i % 2 === 0 ? 30 : -30), centerY + 10);
        await page.waitForTimeout(50);
        await page.mouse.up();
        await page.waitForTimeout(100);
        
        const endTime = performance.now();
        performanceMarks.push(endTime - startTime);
      }
    }
    
    const avgTime = performanceMarks.reduce((sum, time) => sum + time, 0) / performanceMarks.length;
    const maxTime = Math.max(...performanceMarks);
    const minTime = Math.min(...performanceMarks);
    
    console.log(`📊 Performance metrics:`);
    console.log(`   Average gesture time: ${avgTime.toFixed(2)}ms`);
    console.log(`   Max gesture time: ${maxTime.toFixed(2)}ms`);
    console.log(`   Min gesture time: ${minTime.toFixed(2)}ms`);
    
    expect(avgTime).toBeLessThan(500); // Should be reasonably fast
    expect(maxTime).toBeLessThan(1000); // No gesture should take too long
    
    console.log('✅ Performance testing completed');
  });

  test('State cleanup verification', async ({ page }) => {
    console.log('🧪 Testing state cleanup after various gesture scenarios...');
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Scenario 1: Start drag, then cancel with vertical movement
      console.log('🧪 Scenario 1: Canceled drag cleanup');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 10, centerY); // Start horizontal
      await page.waitForTimeout(50);
      await page.mouse.move(centerX + 15, centerY - 50); // Go vertical
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Check state after canceled drag
      const afterCancel = await page.evaluate(() => ({
        isDragging: window.digitalDogSite.dragState.isDragging,
        isAnimating: window.digitalDogSite.dragState.isAnimating,
        draggedCard: window.digitalDogSite.dragState.draggedCard,
        allowDrag: window.digitalDogSite.dragState.allowDrag
      }));
      
      console.log(`   State after cancel: ${JSON.stringify(afterCancel)}`);
      expect(afterCancel.isDragging).toBe(false);
      expect(afterCancel.draggedCard).toBe(null);
      
      // Scenario 2: Complete drag
      console.log('🧪 Scenario 2: Complete drag cleanup');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 100, centerY); // Complete horizontal drag
      await page.mouse.up();
      await page.waitForTimeout(2000); // Wait for animation
      
      // Check state after complete drag
      const afterComplete = await page.evaluate(() => ({
        isDragging: window.digitalDogSite.dragState.isDragging,
        isAnimating: window.digitalDogSite.dragState.isAnimating,
        draggedCard: window.digitalDogSite.dragState.draggedCard
      }));
      
      console.log(`   State after complete: ${JSON.stringify(afterComplete)}`);
      expect(afterComplete.isDragging).toBe(false);
      expect(afterComplete.isAnimating).toBe(false);
      expect(afterComplete.draggedCard).toBe(null);
      
      // Check visual state
      const visualState = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.portfolio-card'));
        return cards.map(card => ({
          project: card.dataset.project,
          isDragging: card.classList.contains('dragging'),
          hasSwipeClass: card.classList.contains('swipe-left') || card.classList.contains('swipe-right'),
          transform: card.style.transform
        }));
      });
      
      console.log('   Visual states:', visualState);
      
      // No card should have dragging or swipe classes
      const badStates = visualState.filter(state => state.isDragging || state.hasSwipeClass);
      expect(badStates.length).toBe(0);
    }
    
    console.log('✅ State cleanup verification completed');
  });
});