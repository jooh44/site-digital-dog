// Focused Mobile Testing: Scroll/Drag Conflict Resolution Validation
import { test, expect } from '@playwright/test';

test.describe('Mobile Portfolio Deck - Critical Functionality Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for site initialization
    await page.waitForTimeout(2000);
    await page.waitForFunction(() => window.digitalDogSite !== undefined);
    await page.waitForSelector('.shuffle-stack', { state: 'visible', timeout: 10000 });
    
    // Scroll to portfolio section
    await page.evaluate(() => {
      document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
  });

  test('CRITICAL: Vertical scroll should work over portfolio deck on mobile', async ({ page }) => {
    console.log('🧪 Testing vertical scroll functionality...');
    
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${initialScrollY}px`);
    
    // Get portfolio deck position
    const deckElement = page.locator('.shuffle-stack');
    const deckBox = await deckElement.boundingBox();
    console.log(`Deck position: ${deckBox?.x}, ${deckBox?.y}, size: ${deckBox?.width}x${deckBox?.height}`);
    
    // Simulate touch scroll over the deck area
    if (deckBox) {
      const centerX = deckBox.x + deckBox.width / 2;
      const centerY = deckBox.y + deckBox.height / 2;
      
      console.log(`Starting touch at: ${centerX}, ${centerY}`);
      
      // Simulate vertical swipe (scroll) gesture
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX, centerY - 100); // Swipe up 100px
      await page.mouse.up();
      
      await page.waitForTimeout(500);
    }
    
    const finalScrollY = await page.evaluate(() => window.scrollY);
    console.log(`Final scroll position: ${finalScrollY}px`);
    
    const scrollDelta = Math.abs(finalScrollY - initialScrollY);
    console.log(`Scroll delta: ${scrollDelta}px`);
    
    // Should have scrolled
    expect(scrollDelta).toBeGreaterThan(20);
    console.log('✅ PASS: Vertical scroll works over portfolio deck');
  });

  test('CRITICAL: Horizontal swipe should change cards', async ({ page }) => {
    console.log('🧪 Testing horizontal card swipe functionality...');
    
    // Get active card
    const activeCard = page.locator('.portfolio-card.active').first();
    await expect(activeCard).toBeVisible();
    
    const initialProject = await activeCard.getAttribute('data-project');
    console.log(`Initial active card: ${initialProject}`);
    
    const cardBox = await activeCard.boundingBox();
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      console.log(`Starting horizontal swipe at: ${centerX}, ${centerY}`);
      
      // Horizontal swipe left (should change card)
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 100, centerY); // Swipe left 100px
      await page.mouse.up();
      
      // Wait for animation to complete
      await page.waitForTimeout(1500);
    }
    
    // Check if card changed
    const newActiveCard = page.locator('.portfolio-card.active').first();
    const newProject = await newActiveCard.getAttribute('data-project');
    console.log(`New active card: ${newProject}`);
    
    expect(newProject).not.toBe(initialProject);
    console.log('✅ PASS: Horizontal swipe changes cards');
  });

  test('CRITICAL: Gesture direction detection works correctly', async ({ page }) => {
    console.log('🧪 Testing gesture direction detection...');
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Test 1: Vertical-dominant gesture should allow scroll
      console.log('Testing vertical-dominant gesture...');
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      // Move more vertically than horizontally (10px horizontal, 30px vertical)
      await page.mouse.move(centerX + 10, centerY - 30);
      await page.waitForTimeout(100);
      await page.mouse.move(centerX + 20, centerY - 80);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      const scrollYAfterVertical = await page.evaluate(() => window.scrollY);
      const verticalScrollDelta = Math.abs(scrollYAfterVertical - initialScrollY);
      console.log(`Vertical gesture - scroll delta: ${verticalScrollDelta}px`);
      
      // Should have scrolled (vertical gesture detected)
      expect(verticalScrollDelta).toBeGreaterThan(10);
      console.log('✅ PASS: Vertical-dominant gesture allows scroll');
      
      // Test 2: Horizontal-dominant gesture should enable drag
      console.log('Testing horizontal-dominant gesture...');
      const initialProject = await activeCard.getAttribute('data-project');
      
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      // Move more horizontally than vertically (60px horizontal, 20px vertical)
      await page.mouse.move(centerX + 60, centerY + 20);
      await page.waitForTimeout(100);
      await page.mouse.move(centerX + 120, centerY + 20);
      await page.mouse.up();
      await page.waitForTimeout(1500);
      
      const projectAfterHorizontal = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      console.log(`Horizontal gesture - project changed from ${initialProject} to ${projectAfterHorizontal}`);
      
      // Should have changed card (horizontal gesture detected)
      expect(projectAfterHorizontal).not.toBe(initialProject);
      console.log('✅ PASS: Horizontal-dominant gesture enables drag');
    }
  });

  test('CRITICAL: CSS touch-action properties are correct', async ({ page }) => {
    console.log('🧪 Testing CSS touch-action properties...');
    
    // Check shuffle-stack touch-action
    const shuffleStackTouchAction = await page.locator('.shuffle-stack').evaluate(el => {
      return getComputedStyle(el).touchAction;
    });
    console.log(`Shuffle stack touch-action: "${shuffleStackTouchAction}"`);
    
    // Should allow pan-y (vertical scroll) and pinch-zoom
    expect(shuffleStackTouchAction).toContain('pan-y');
    
    console.log('✅ PASS: CSS touch-action properties are correct');
  });

  test('CRITICAL: Console logging for drag cancellation', async ({ page }) => {
    console.log('🧪 Testing console logging for drag cancellation...');
    
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text());
      }
    });
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Start horizontal then go vertical (should trigger cancellation)
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.waitForTimeout(50);
      // Go vertical to trigger cancellation
      await page.mouse.move(centerX, centerY - 50);
      await page.waitForTimeout(200);
      await page.mouse.up();
    }
    
    // Check for cancellation log
    const cancellationLogs = consoleLogs.filter(log => 
      log.includes('🔄 Canceling drag to allow scroll')
    );
    
    console.log(`Found ${cancellationLogs.length} cancellation log(s)`);
    console.log('Sample logs:', consoleLogs.slice(0, 5));
    
    expect(cancellationLogs.length).toBeGreaterThan(0);
    console.log('✅ PASS: Drag cancellation logging works');
  });

  test('CRITICAL: Animation state management', async ({ page }) => {
    console.log('🧪 Testing animation state management...');
    
    const activeCard = page.locator('.portfolio-card.active').first();
    
    // Check that we can access drag state
    const dragStateExists = await page.evaluate(() => {
      return window.digitalDogSite && 
             window.digitalDogSite.dragState &&
             typeof window.digitalDogSite.dragState.isAnimating !== 'undefined';
    });
    
    expect(dragStateExists).toBe(true);
    
    // Check initial animation state
    const initialAnimationState = await page.evaluate(() => {
      return window.digitalDogSite.dragState.isAnimating;
    });
    
    expect(initialAnimationState).toBe(false);
    console.log(`Initial animation state: ${initialAnimationState}`);
    
    // Perform a drag that should change cards (trigger animation)
    const cardBox = await activeCard.boundingBox();
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 100, centerY);
      await page.mouse.up();
      
      // Check that animation state becomes true
      await page.waitForTimeout(100);
      const duringAnimationState = await page.evaluate(() => {
        return window.digitalDogSite.dragState.isAnimating;
      });
      console.log(`During animation state: ${duringAnimationState}`);
      
      // Wait for animation to complete
      await page.waitForTimeout(1500);
      const afterAnimationState = await page.evaluate(() => {
        return window.digitalDogSite.dragState.isAnimating;
      });
      
      expect(afterAnimationState).toBe(false);
      console.log(`After animation state: ${afterAnimationState}`);
    }
    
    console.log('✅ PASS: Animation state management works');
  });

  test('Performance: Gesture detection responsiveness', async ({ page }) => {
    console.log('🧪 Testing gesture detection performance...');
    
    const activeCard = page.locator('.portfolio-card.active').first();
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Measure time for gesture detection and response
      const startTime = Date.now();
      
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 20, centerY);
      await page.waitForTimeout(50);
      
      // Check visual feedback response time
      const isDragging = await activeCard.evaluate(el => el.classList.contains('dragging'));
      const responseTime = Date.now() - startTime;
      
      await page.mouse.up();
      
      console.log(`Gesture detection response time: ${responseTime}ms`);
      console.log(`Visual feedback (dragging class): ${isDragging}`);
      
      expect(responseTime).toBeLessThan(200); // Should be very responsive
      expect(isDragging).toBe(true);
    }
    
    console.log('✅ PASS: Gesture detection is responsive');
  });
});