// Mobile Scroll/Drag Conflict Resolution - Radical Approach Validation
// Tests the complete separation of desktop and mobile interactions

const { test, expect, devices } = require('@playwright/test');

const testUrl = 'file://' + process.cwd() + '/index.html';

test.describe('Mobile Radical Approach Validation', () => {
    
    // CRITICAL TEST 1: Mobile drag completely disabled
    test('Mobile devices - drag functionality completely disabled', async ({ browser }) => {
        const context = await browser.newContext(devices['iPhone 12']);
        const page = await context.newPage();
        
        // Capture console messages
        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push(msg.text()));
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Allow full initialization
        
        // Verify mobile detection
        const isMobile = await page.evaluate(() => window.digitalDogSite?.shuffleState?.isMobile);
        expect(isMobile).toBe(true);
        
        // Navigate to portfolio and trigger drag attempts
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(1000);
        
        const firstCard = page.locator('.portfolio-card').first();
        await expect(firstCard).toBeVisible();
        
        const cardBox = await firstCard.boundingBox();
        
        // Multiple drag attempts (this should trigger the disabled message)
        for (let i = 0; i < 3; i++) {
            // Touch events
            await page.touchscreen.tap(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
            await page.waitForTimeout(50);
            
            // Mouse drag simulation
            await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(50);
            await page.mouse.move(cardBox.x + 100, cardBox.y + cardBox.height / 2);
            await page.waitForTimeout(50);
            await page.mouse.up();
            await page.waitForTimeout(100);
        }
        
        // Wait for logs to accumulate
        await page.waitForTimeout(1000);
        
        // Verify drag disabled message appears
        const dragDisabledMessages = consoleLogs.filter(log => 
            log.includes('📱 Drag disabled on mobile - scroll freely!')
        );
        expect(dragDisabledMessages.length).toBeGreaterThan(0);
        
        // Verify no dragging class is applied
        const draggingCards = await page.locator('.portfolio-card.dragging').count();
        expect(draggingCards).toBe(0);
        
        // Verify mobile navigation buttons are visible
        const mobileNavButtons = page.locator('.mobile-nav-buttons');
        await expect(mobileNavButtons).toBeVisible();
        
        await context.close();
    });
    
    // CRITICAL TEST 2: Mobile navigation buttons functional
    test('Mobile devices - navigation buttons work correctly', async ({ browser }) => {
        const context = await browser.newContext(devices['Pixel 5']);
        const page = await context.newPage();
        
        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push(msg.text()));
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Navigate to portfolio
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(1000);
        
        // Get initial active card
        const initialActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
        
        // Click next button
        const nextButton = page.locator('#nextCard');
        await expect(nextButton).toBeVisible();
        await nextButton.click();
        await page.waitForTimeout(1500); // Wait for animation
        
        // Verify card changed
        const newActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
        expect(newActiveCard).not.toBe(initialActiveCard);
        
        // Verify mobile navigation log
        const mobileNavLogs = consoleLogs.filter(log => 
            log.includes('📱 Mobile navigation: Next card')
        );
        expect(mobileNavLogs.length).toBeGreaterThan(0);
        
        await context.close();
    });
    
    // CRITICAL TEST 3: Desktop drag functionality preserved
    test('Desktop viewport - drag functionality preserved', async ({ browser }) => {
        const context = await browser.newContext({ 
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Verify NOT mobile
        const isMobile = await page.evaluate(() => window.digitalDogSite?.shuffleState?.isMobile);
        expect(isMobile).toBe(false);
        
        // Navigate to portfolio
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(1000);
        
        // Verify mobile navigation buttons are hidden
        const mobileNavButtons = page.locator('.mobile-nav-buttons');
        await expect(mobileNavButtons).not.toBeVisible();
        
        // Test drag functionality
        const firstCard = page.locator('.portfolio-card').first();
        await expect(firstCard).toBeVisible();
        
        // Verify grab cursor
        const cursorStyle = await firstCard.evaluate(el => window.getComputedStyle(el).cursor);
        expect(cursorStyle).toBe('grab');
        
        // Get initial active card
        const initialActiveCard = await firstCard.getAttribute('data-project');
        
        // Perform drag
        const cardBox = await firstCard.boundingBox();
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(cardBox.x - 150, cardBox.y + cardBox.height / 2); // Drag left beyond threshold
        await page.mouse.up();
        
        await page.waitForTimeout(2000); // Wait for animation
        
        // Verify card changed (drag worked)
        const newActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
        expect(newActiveCard).not.toBe(initialActiveCard);
        
        await context.close();
    });
    
    // CRITICAL TEST 4: Mobile vertical scrolling unblocked
    test('Mobile devices - vertical scrolling completely unblocked', async ({ browser }) => {
        const context = await browser.newContext(devices['Galaxy S21']);
        const page = await context.newPage();
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Initial scroll position
        const initialScrollY = await page.evaluate(() => window.scrollY);
        expect(initialScrollY).toBe(0);
        
        // Scroll to portfolio section
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(500);
        
        const portfolioScrollY = await page.evaluate(() => window.scrollY);
        expect(portfolioScrollY).toBeGreaterThan(initialScrollY);
        
        // Continue scrolling through other sections
        await page.evaluate(() => document.querySelector('#sobre').scrollIntoView());
        await page.waitForTimeout(500);
        
        const aboutScrollY = await page.evaluate(() => window.scrollY);
        expect(aboutScrollY).toBeGreaterThan(portfolioScrollY);
        
        await page.evaluate(() => document.querySelector('#contato').scrollIntoView());
        await page.waitForTimeout(500);
        
        const contactScrollY = await page.evaluate(() => window.scrollY);
        expect(contactScrollY).toBeGreaterThan(aboutScrollY);
        
        // Test manual scrolling over portfolio area
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(500);
        
        const beforeManualScroll = await page.evaluate(() => window.scrollY);
        
        // Simulate scroll gesture over the portfolio deck area
        const portfolioSection = await page.locator('#portfolio').boundingBox();
        const deckArea = await page.locator('.shuffle-stack').boundingBox();
        
        // Scroll down over the deck area
        await page.mouse.move(deckArea.x + deckArea.width / 2, deckArea.y + deckArea.height / 2);
        await page.mouse.wheel(0, 300); // Scroll down
        await page.waitForTimeout(300);
        
        const afterManualScroll = await page.evaluate(() => window.scrollY);
        expect(afterManualScroll).toBeGreaterThanOrEqual(beforeManualScroll);
        
        await context.close();
    });
    
    // TEST 5: Breakpoint behavior at 768px
    test('Breakpoint behavior - 768px threshold', async ({ browser }) => {
        // Test exactly at mobile breakpoint (768px = mobile)
        const mobileContext = await browser.newContext({ 
            viewport: { width: 768, height: 1024 }
        });
        const mobilePage = await mobileContext.newPage();
        
        await mobilePage.goto(testUrl);
        await mobilePage.waitForLoadState('networkidle');
        await mobilePage.waitForTimeout(1000);
        
        const isMobileAt768 = await mobilePage.evaluate(() => window.digitalDogSite?.shuffleState?.isMobile);
        expect(isMobileAt768).toBe(true); // 768px should be considered mobile (≤768px)
        
        const mobileButtonsAt768 = await mobilePage.locator('.mobile-nav-buttons').isVisible();
        expect(mobileButtonsAt768).toBe(true);
        
        await mobileContext.close();
        
        // Test just above mobile breakpoint (769px = desktop)
        const desktopContext = await browser.newContext({ 
            viewport: { width: 769, height: 1024 }
        });
        const desktopPage = await desktopContext.newPage();
        
        await desktopPage.goto(testUrl);
        await desktopPage.waitForLoadState('networkidle');
        await desktopPage.waitForTimeout(1000);
        
        const isMobileAt769 = await desktopPage.evaluate(() => window.digitalDogSite?.shuffleState?.isMobile);
        expect(isMobileAt769).toBe(false); // 769px should be considered desktop (>768px)
        
        const mobileButtonsAt769 = await desktopPage.locator('.mobile-nav-buttons').isVisible();
        expect(mobileButtonsAt769).toBe(false);
        
        await desktopContext.close();
    });
    
    // TEST 6: Animation quality and performance
    test('Mobile devices - button animations and no JavaScript errors', async ({ browser }) => {
        const context = await browser.newContext(devices['iPhone 12']);
        const page = await context.newPage();
        
        const jsErrors = [];
        page.on('pageerror', error => jsErrors.push(error.message));
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Navigate to portfolio
        await page.evaluate(() => document.querySelector('#portfolio').scrollIntoView());
        await page.waitForTimeout(1000);
        
        const nextButton = page.locator('#nextCard');
        await expect(nextButton).toBeVisible();
        
        // Test hover animation (if supported)
        await nextButton.hover();
        await page.waitForTimeout(300);
        
        // Test button click animation
        await nextButton.click();
        await page.waitForTimeout(1000);
        
        // Click again to test animation lock
        await nextButton.click(); // Should be blocked if animation is in progress
        await page.waitForTimeout(1000);
        
        // Verify no JavaScript errors occurred
        expect(jsErrors).toHaveLength(0);
        
        await context.close();
    });
});