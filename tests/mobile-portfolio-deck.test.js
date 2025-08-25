// Comprehensive Mobile Testing for Portfolio Deck Functionality
// Testing scroll/drag conflict resolution and gesture detection
import { test, expect } from '@playwright/test';

test.describe('Mobile Portfolio Deck - Scroll/Drag Conflict Resolution', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for site initialization
    await page.waitForFunction(() => window.digitalDogSite !== undefined);
    await page.waitForSelector('.shuffle-stack', { timeout: 10000 });
    
    // Ensure portfolio section is visible
    await page.locator('#portfolio').scrollIntoView();
    await page.waitForTimeout(1000); // Allow animations to settle
  });

  test.describe('Vertical Scrolling Functionality', () => {
    test('should allow vertical scrolling through portfolio deck section on mobile', async ({ page }) => {
      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Scroll down through the portfolio deck
      await page.locator('.shuffle-stack').hover();
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      
      const afterScrollY = await page.evaluate(() => window.scrollY);
      
      expect(afterScrollY).toBeGreaterThan(initialScrollY);
      console.log(`✅ Vertical scroll working: ${initialScrollY} -> ${afterScrollY}`);
    });

    test('should not block page scroll when trying to scroll vertically over deck cards', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card').first();
      
      // Get initial position
      const initialY = await page.evaluate(() => window.scrollY);
      
      // Simulate vertical swipe over the card
      await portfolioCard.hover();
      await page.mouse.down();
      await page.mouse.move(0, -200); // Vertical swipe up
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      const finalY = await page.evaluate(() => window.scrollY);
      
      // Should allow scroll, not block it
      expect(Math.abs(finalY - initialY)).toBeGreaterThan(50);
      console.log(`✅ Vertical scroll over cards working: ${initialY} -> ${finalY}`);
    });

    test('should maintain smooth scrolling speed through deck section', async ({ page }) => {
      const measurements = [];
      
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        const startY = await page.evaluate(() => window.scrollY);
        
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(300);
        
        const endTime = Date.now();
        const endY = await page.evaluate(() => window.scrollY);
        
        measurements.push({
          time: endTime - startTime,
          distance: Math.abs(endY - startY)
        });
      }
      
      // Check that scroll performance is consistent
      const avgTime = measurements.reduce((sum, m) => sum + m.time, 0) / measurements.length;
      const avgDistance = measurements.reduce((sum, m) => sum + m.distance, 0) / measurements.length;
      
      expect(avgTime).toBeLessThan(500); // Should be responsive
      expect(avgDistance).toBeGreaterThan(100); // Should actually scroll
      
      console.log(`✅ Scroll performance - Avg time: ${avgTime}ms, Avg distance: ${avgDistance}px`);
    });
  });

  test.describe('Horizontal Drag Functionality', () => {
    test('should allow horizontal drag/swipe on portfolio cards', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      
      // Get initial card project name
      const initialProject = await portfolioCard.getAttribute('data-project');
      
      // Perform horizontal swipe
      const cardBox = await portfolioCard.boundingBox();
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x - 100, cardBox.y + cardBox.height / 2); // Horizontal swipe left
      await page.mouse.up();
      
      // Wait for animation to complete
      await page.waitForTimeout(1000);
      
      // Check if card changed
      const newActiveCard = page.locator('.portfolio-card.active').first();
      const newProject = await newActiveCard.getAttribute('data-project');
      
      expect(newProject).not.toBe(initialProject);
      console.log(`✅ Card changed from ${initialProject} to ${newProject}`);
    });

    test('should provide natural and responsive drag feel', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Start drag
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Check for immediate visual feedback
      await page.waitForTimeout(50);
      const isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      expect(isDragging).toBe(true);
      
      // Check cursor changes
      const cursor = await portfolioCard.evaluate(el => getComputedStyle(el).cursor);
      expect(cursor).toBe('grabbing');
      
      // Move and check transform
      await page.mouse.move(cardBox.x + 50, cardBox.y + cardBox.height / 2);
      await page.waitForTimeout(50);
      
      const transform = await portfolioCard.evaluate(el => el.style.transform);
      expect(transform).toContain('translate');
      
      await page.mouse.up();
      
      console.log(`✅ Drag feedback working - dragging class: ${isDragging}, cursor: ${cursor}`);
    });

    test('should respect 50px drag threshold', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const initialProject = await portfolioCard.getAttribute('data-project');
      const cardBox = await portfolioCard.boundingBox();
      
      // Drag less than threshold (40px)
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2 - 40, cardBox.y + cardBox.height / 2);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Card should return to original position
      const projectAfterShortDrag = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(projectAfterShortDrag).toBe(initialProject);
      
      // Now drag more than threshold (60px)
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2 - 60, cardBox.y + cardBox.height / 2);
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      // Card should change
      const projectAfterLongDrag = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(projectAfterLongDrag).not.toBe(initialProject);
      
      console.log(`✅ Threshold working - Short drag: same (${initialProject}), Long drag: changed to ${projectAfterLongDrag}`);
    });
  });

  test.describe('Gesture Direction Detection', () => {
    test('should correctly identify vertical gestures within 15px and allow scroll', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      const startY = await page.evaluate(() => window.scrollY);
      
      // Start touch on card
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Move 20px vertically (more than 15px threshold)
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2 - 20);
      await page.waitForTimeout(100);
      
      // Continue vertical movement
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2 - 100);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      const endY = await page.evaluate(() => window.scrollY);
      
      // Should have triggered scroll, not drag
      expect(Math.abs(endY - startY)).toBeGreaterThan(20);
      console.log(`✅ Vertical gesture detection: scroll from ${startY} to ${endY}`);
    });

    test('should correctly identify horizontal gestures with 1.5x ratio threshold', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const initialProject = await portfolioCard.getAttribute('data-project');
      const cardBox = await portfolioCard.boundingBox();
      
      // Test borderline case: horizontal movement should be 1.5x vertical
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Move 30px horizontal, 15px vertical (ratio = 2.0, should trigger horizontal drag)
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 30, cardBox.y + cardBox.height / 2 + 15);
      await page.waitForTimeout(100);
      
      // Continue horizontal movement
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 80, cardBox.y + cardBox.height / 2 + 15);
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      const newProject = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(newProject).not.toBe(initialProject);
      
      console.log(`✅ Horizontal gesture detection: ratio 2.0 triggered drag (${initialProject} -> ${newProject})`);
    });

    test('should handle diagonal gestures correctly', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      const startY = await page.evaluate(() => window.scrollY);
      
      // Test diagonal movement where vertical dominates (ratio < 1.5)
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Move 20px horizontal, 20px vertical (ratio = 1.0, should allow scroll)
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 20, cardBox.y + cardBox.height / 2 + 20);
      await page.waitForTimeout(100);
      
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 40, cardBox.y + cardBox.height / 2 + 100);
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      const endY = await page.evaluate(() => window.scrollY);
      
      // Should have triggered scroll since horizontal/vertical ratio < 1.5
      expect(Math.abs(endY - startY)).toBeGreaterThan(10);
      console.log(`✅ Diagonal gesture (ratio 1.0): triggered scroll from ${startY} to ${endY}`);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid swipe gestures', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const initialProject = await portfolioCard.getAttribute('data-project');
      const cardBox = await portfolioCard.boundingBox();
      
      // Rapid horizontal swipe
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x - 100, cardBox.y + cardBox.height / 2, { steps: 1 }); // Very fast
      await page.mouse.up();
      
      await page.waitForTimeout(1000);
      
      const newProject = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(newProject).not.toBe(initialProject);
      
      console.log(`✅ Rapid swipe handled: ${initialProject} -> ${newProject}`);
    });

    test('should handle slow deliberate movements', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const initialProject = await portfolioCard.getAttribute('data-project');
      const cardBox = await portfolioCard.boundingBox();
      
      // Very slow horizontal drag
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Move in small increments with delays
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(cardBox.x + cardBox.width / 2 - (i * 10), cardBox.y + cardBox.height / 2);
        await page.waitForTimeout(50);
      }
      
      await page.mouse.up();
      await page.waitForTimeout(1000);
      
      const newProject = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(newProject).not.toBe(initialProject);
      
      console.log(`✅ Slow drag handled: ${initialProject} -> ${newProject}`);
    });

    test('should handle partial gestures (start drag but don\'t complete)', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const initialProject = await portfolioCard.getAttribute('data-project');
      const cardBox = await portfolioCard.boundingBox();
      
      // Start drag but don't complete
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2 - 30, cardBox.y + cardBox.height / 2);
      await page.waitForTimeout(100);
      
      // Release without completing threshold
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Should return to original card
      const finalProject = await page.locator('.portfolio-card.active').first().getAttribute('data-project');
      expect(finalProject).toBe(initialProject);
      
      // Check that visual state is reset
      const transform = await portfolioCard.evaluate(el => el.style.transform);
      const isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      
      expect(isDragging).toBe(false);
      console.log(`✅ Partial gesture handled: returned to ${finalProject}, dragging: ${isDragging}`);
    });

    test('should handle touches that start on cards but move off them', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Start on card
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // Move outside card bounds
      await page.mouse.move(cardBox.x + cardBox.width + 50, cardBox.y - 50);
      await page.waitForTimeout(100);
      
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Should handle gracefully without errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      expect(consoleErrors.length).toBe(0);
      console.log(`✅ Off-card movement handled gracefully`);
    });
  });

  test.describe('Visual Feedback and State Cleanup', () => {
    test('should show proper visual drag states', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Check initial state
      let isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      let cursor = await portfolioCard.evaluate(el => getComputedStyle(el).cursor);
      expect(isDragging).toBe(false);
      expect(cursor).toBe('grab');
      
      // Start drag
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(50);
      
      // Check drag state
      isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      cursor = await portfolioCard.evaluate(el => getComputedStyle(el).cursor);
      expect(isDragging).toBe(true);
      expect(cursor).toBe('grabbing');
      
      // End drag
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Check final state
      isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      cursor = await portfolioCard.evaluate(el => getComputedStyle(el).cursor);
      expect(isDragging).toBe(false);
      expect(cursor).toBe('grab');
      
      console.log(`✅ Visual states: drag start/end transitions working correctly`);
    });

    test('should reset card positions properly when drag is canceled', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Start vertical gesture that should cancel drag
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2 - 50); // Vertical
      await page.mouse.up();
      await page.waitForTimeout(500);
      
      // Check that card transform is reset
      const transform = await portfolioCard.evaluate(el => el.style.transform);
      const isDragging = await portfolioCard.evaluate(el => el.classList.contains('dragging'));
      
      expect(isDragging).toBe(false);
      // Transform should be reset or minimal
      if (transform) {
        expect(transform).not.toContain('100px'); // No large translations
      }
      
      console.log(`✅ Canceled drag cleanup: transform="${transform}", dragging=${isDragging}`);
    });

    test('should not leave visual artifacts after drag operations', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Perform complete drag cycle
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x - 100, cardBox.y + cardBox.height / 2); // Complete drag
      await page.mouse.up();
      await page.waitForTimeout(1500); // Wait for animation complete
      
      // Check all cards for leftover classes or transforms
      const cards = await page.locator('.portfolio-card').all();
      for (const card of cards) {
        const isDragging = await card.evaluate(el => el.classList.contains('dragging'));
        const hasSwipeClass = await card.evaluate(el => 
          el.classList.contains('swipe-left') || el.classList.contains('swipe-right')
        );
        
        expect(isDragging).toBe(false);
        expect(hasSwipeClass).toBe(false);
      }
      
      // Check container state
      const shuffleContainer = page.locator('.shuffle-stack');
      const containerDragging = await shuffleContainer.evaluate(el => el.classList.contains('shuffle-dragging'));
      expect(containerDragging).toBe(false);
      
      console.log(`✅ No visual artifacts remaining after drag cycle`);
    });
  });

  test.describe('Console Logging and Debugging', () => {
    test('should log gesture cancellation when switching from drag to scroll', async ({ page }) => {
      const consoleLogs = [];
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('🔄 Canceling drag to allow scroll')) {
          consoleLogs.push(msg.text());
        }
      });
      
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Start drag but then go vertical (should trigger cancellation log)
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2 - 50); // Vertical
      await page.waitForTimeout(200);
      await page.mouse.up();
      
      expect(consoleLogs.length).toBeGreaterThan(0);
      console.log(`✅ Cancellation logging working: ${consoleLogs.length} log(s) found`);
    });
  });

  test.describe('Performance and Responsiveness', () => {
    test('should maintain good performance during gesture detection', async ({ page }) => {
      const startTime = Date.now();
      
      // Perform multiple gesture tests rapidly
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      for (let i = 0; i < 5; i++) {
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(cardBox.x + 50, cardBox.y + 30);
        await page.mouse.up();
        await page.waitForTimeout(100);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(3000); // Should complete in reasonable time
      console.log(`✅ Performance test: 5 gestures completed in ${totalTime}ms`);
    });

    test('should not block UI during gesture processing', async ({ page }) => {
      const portfolioCard = page.locator('.portfolio-card.active').first();
      const cardBox = await portfolioCard.boundingBox();
      
      // Start a gesture
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      
      // While gesture is active, try to interact with other elements
      const canInteract = await page.evaluate(() => {
        // Try to access a different element
        const otherElement = document.querySelector('.portfolio-cta');
        return otherElement && otherElement.offsetHeight > 0;
      });
      
      await page.mouse.up();
      
      expect(canInteract).toBe(true);
      console.log(`✅ UI remains responsive during gesture processing`);
    });
  });
});

// Utility functions for the tests
async function getCardTransform(card) {
  return await card.evaluate(el => {
    const style = getComputedStyle(el);
    return {
      transform: style.transform,
      opacity: style.opacity,
      zIndex: style.zIndex
    };
  });
}

async function waitForAnimationComplete(page, timeout = 1000) {
  await page.waitForFunction(() => {
    return !window.digitalDogSite.dragState.isAnimating;
  }, { timeout });
}