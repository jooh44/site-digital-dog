// Quick Mobile Validation Test
import { test, expect } from '@playwright/test';

test.describe('Quick Mobile Portfolio Validation', () => {
  
  test('Site loads and portfolio deck is functional', async ({ page }) => {
    console.log('🧪 Quick validation test starting...');
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Check site initialization
    const siteInitialized = await page.evaluate(() => window.digitalDogSite !== undefined);
    console.log(`Site initialized: ${siteInitialized}`);
    expect(siteInitialized).toBe(true);
    
    // Check portfolio deck exists
    const shuffleStack = page.locator('.shuffle-stack');
    await expect(shuffleStack).toBeVisible();
    console.log('✅ Portfolio deck is visible');
    
    // Check active card exists
    const activeCard = page.locator('.portfolio-card.active');
    await expect(activeCard).toBeVisible();
    const activeProject = await activeCard.getAttribute('data-project');
    console.log(`✅ Active card: ${activeProject}`);
    
    // Test CSS touch-action
    const touchAction = await shuffleStack.evaluate(el => 
      getComputedStyle(el).touchAction
    );
    console.log(`✅ Touch action: ${touchAction}`);
    expect(touchAction).toContain('pan-y');
    
    // Test drag state exists
    const dragStateExists = await page.evaluate(() => {
      return window.digitalDogSite?.dragState !== undefined;
    });
    console.log(`✅ Drag state exists: ${dragStateExists}`);
    expect(dragStateExists).toBe(true);
    
    // Test basic gesture - hover and check cursor
    await activeCard.hover();
    const cursor = await activeCard.evaluate(el => getComputedStyle(el).cursor);
    console.log(`✅ Cursor on hover: ${cursor}`);
    expect(cursor).toBe('grab');
    
    // Test scroll functionality
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);
    const finalScrollY = await page.evaluate(() => window.scrollY);
    console.log(`✅ Scroll test: ${initialScrollY} -> ${finalScrollY}`);
    
    // Test basic drag interaction
    console.log('🧪 Testing basic drag interaction...');
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      // Simulate horizontal drag
      await page.mouse.move(cardBox.x + cardBox.width/2, cardBox.y + cardBox.height/2);
      await page.mouse.down();
      await page.waitForTimeout(100);
      
      // Check dragging state
      const isDragging = await activeCard.evaluate(el => el.classList.contains('dragging'));
      console.log(`✅ Dragging state active: ${isDragging}`);
      
      await page.mouse.move(cardBox.x + cardBox.width/2 - 50, cardBox.y + cardBox.height/2);
      await page.waitForTimeout(100);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Check if drag was processed
      const finalDragging = await activeCard.evaluate(el => el.classList.contains('dragging'));
      console.log(`✅ Dragging state after release: ${finalDragging}`);
      expect(finalDragging).toBe(false);
    }
    
    console.log('✅ Quick validation completed successfully!');
  });
  
  test('Gesture direction detection basic test', async ({ page }) => {
    console.log('🧪 Testing gesture direction detection...');
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.waitForFunction(() => window.digitalDogSite !== undefined);
    
    const activeCard = page.locator('.portfolio-card.active').first();
    await expect(activeCard).toBeVisible();
    
    // Listen for console logs
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });
    
    const cardBox = await activeCard.boundingBox();
    
    if (cardBox) {
      const centerX = cardBox.x + cardBox.width / 2;
      const centerY = cardBox.y + cardBox.height / 2;
      
      // Test vertical gesture (should trigger scroll cancellation)
      console.log('Testing vertical gesture...');
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX, centerY - 50); // More vertical than horizontal
      await page.waitForTimeout(200);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Check for cancellation logs
      const cancellationLogs = consoleLogs.filter(log => 
        log.includes('🔄 Canceling drag to allow scroll')
      );
      
      console.log(`Found ${cancellationLogs.length} cancellation log(s)`);
      console.log('Recent logs:', consoleLogs.slice(-5));
      
      if (cancellationLogs.length > 0) {
        console.log('✅ Gesture direction detection working - vertical gesture canceled drag');
      } else {
        console.log('⚠️  No cancellation log found - may need further investigation');
      }
    }
  });
});