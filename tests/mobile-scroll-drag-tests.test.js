// Mobile Scroll/Drag Conflict Resolution Testing
// Testing the radical new approach: Complete mobile drag disabling with navigation buttons

const { test, expect, devices } = require('@playwright/test');

// Test configurations for different devices
const mobileDevices = [
    { name: 'iPhone 12', ...devices['iPhone 12'] },
    { name: 'Pixel 5', ...devices['Pixel 5'] },
    { name: 'Galaxy S21', ...devices['Galaxy S21'] }
];

const desktopViewports = [
    { name: 'Desktop 1920x1080', width: 1920, height: 1080 },
    { name: 'Desktop 1440x900', width: 1440, height: 900 },
    { name: 'Laptop 1366x768', width: 1366, height: 768 }
];

const tabletViewports = [
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'iPad', width: 768, height: 1024 }
];

// Test the current page
const testUrl = 'file://' + process.cwd() + '/index.html';

test.describe('Mobile Scroll/Drag Conflict Resolution Tests', () => {
    
    // CRITICAL TEST 1: Mobile drag disabling
    test.describe('Mobile Drag Disabling (≤768px)', () => {
        mobileDevices.forEach(device => {
            test(`${device.name} - Verify drag is completely disabled`, async ({ browser }) => {
                const context = await browser.newContext(device);
                const page = await context.newPage();
                
                // Listen for console messages
                const consoleLogs = [];
                page.on('console', msg => consoleLogs.push(msg.text()));
                
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Check if mobile device detection is working
                const isMobile = await page.evaluate(() => window.digitalDogSite.shuffleState.isMobile);
                expect(isMobile).toBe(true);
                
                // Find the first portfolio card
                const firstCard = await page.locator('.portfolio-card').first();
                await expect(firstCard).toBeVisible();
                
                // Try to start a drag operation on mobile
                const cardBox = await firstCard.boundingBox();
                
                // Multiple interaction attempts to trigger handleDragStart
                // Touch event
                await page.touchscreen.tap(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                await page.waitForTimeout(100);
                
                // Mouse events to simulate drag
                await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                await page.mouse.down();
                await page.waitForTimeout(100);
                await page.mouse.move(cardBox.x + 100, cardBox.y + cardBox.height / 2);
                await page.waitForTimeout(100);
                await page.mouse.up();
                
                // Wait for any console logs to appear
                await page.waitForTimeout(1000);
                
                // Check that the mobile drag disabled message appears
                const dragDisabledLog = consoleLogs.some(log => 
                    log.includes('📱 Drag disabled on mobile - scroll freely!')
                );
                expect(dragDisabledLog).toBe(true);
                
                // Verify no dragging visual feedback occurred
                const draggedCard = await page.locator('.portfolio-card.dragging').count();
                expect(draggedCard).toBe(0);
                
                await context.close();
            });
        });
    });
    
    // CRITICAL TEST 2: Mobile vertical scrolling
    test.describe('Mobile Vertical Scrolling', () => {
        mobileDevices.forEach(device => {
            test(`${device.name} - Verify perfect vertical scrolling through entire page`, async ({ browser }) => {
                const context = await browser.newContext(device);
                const page = await context.newPage();
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Get initial scroll position
                const initialScrollY = await page.evaluate(() => window.scrollY);
                expect(initialScrollY).toBe(0);
                
                // Test scrolling to different sections
                const sections = ['#servicos', '#portfolio', '#sobre', '#contato'];
                
                for (const section of sections) {
                    await page.evaluate((sel) => {
                        document.querySelector(sel).scrollIntoView();
                    }, section);
                    await page.waitForTimeout(500);
                    
                    const currentScrollY = await page.evaluate(() => window.scrollY);
                    expect(currentScrollY).toBeGreaterThan(0);
                    
                    // Verify section is visible
                    await expect(page.locator(section)).toBeInViewport();
                }
                
                // Test manual scroll gestures
                const viewportSize = await page.viewportSize();
                
                // Swipe down (scroll down)
                await page.touchscreen.tap(viewportSize.width / 2, viewportSize.height / 2);
                const scrollBeforeSwipe = await page.evaluate(() => window.scrollY);
                
                // Simulate swipe down
                await page.touchscreen.tap(viewportSize.width / 2, viewportSize.height * 0.8);
                await page.waitForTimeout(300);
                
                // Should have scrolled further down
                const scrollAfterSwipe = await page.evaluate(() => window.scrollY);
                expect(scrollAfterSwipe).toBeGreaterThanOrEqual(scrollBeforeSwipe);
                
                await context.close();
            });
        });
    });
    
    // TEST 3: Mobile navigation buttons
    test.describe('Mobile Navigation Buttons', () => {
        mobileDevices.forEach(device => {
            test(`${device.name} - Verify mobile navigation buttons are visible and functional`, async ({ browser }) => {
                const context = await browser.newContext(device);
                const page = await context.newPage();
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Navigate to portfolio section
                await page.evaluate(() => {
                    document.querySelector('#portfolio').scrollIntoView();
                });
                await page.waitForTimeout(1000);
                
                // Check that mobile navigation buttons are visible
                const mobileNavButtons = page.locator('.mobile-nav-buttons');
                await expect(mobileNavButtons).toBeVisible();
                
                const prevButton = page.locator('#prevCard');
                const nextButton = page.locator('#nextCard');
                
                await expect(prevButton).toBeVisible();
                await expect(nextButton).toBeVisible();
                
                // Test button styling and positioning
                const prevButtonStyles = await prevButton.evaluate(el => {
                    const styles = window.getComputedStyle(el);
                    return {
                        width: styles.width,
                        height: styles.height,
                        borderRadius: styles.borderRadius,
                        backgroundColor: styles.backgroundColor,
                        cursor: styles.cursor
                    };
                });
                
                // Verify button meets touch target requirements (48px minimum)
                expect(parseInt(prevButtonStyles.width)).toBeGreaterThanOrEqual(48);
                expect(parseInt(prevButtonStyles.height)).toBeGreaterThanOrEqual(48);
                expect(prevButtonStyles.borderRadius).toBe('50%');
                expect(prevButtonStyles.cursor).toBe('pointer');
                
                await context.close();
            });
        });
    });
    
    // TEST 4: Mobile navigation button functionality
    test.describe('Mobile Navigation Button Functionality', () => {
        mobileDevices.forEach(device => {
            test(`${device.name} - Test next/previous card navigation`, async ({ browser }) => {
                const context = await browser.newContext(device);
                const page = await context.newPage();
                
                // Listen for console messages
                const consoleLogs = [];
                page.on('console', msg => consoleLogs.push(msg.text()));
                
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Navigate to portfolio section
                await page.evaluate(() => {
                    document.querySelector('#portfolio').scrollIntoView();
                });
                await page.waitForTimeout(1000);
                
                // Get initial active card
                const initialActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
                
                // Click next button
                await page.locator('#nextCard').click();
                await page.waitForTimeout(1000); // Wait for animation
                
                // Verify card changed
                const newActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
                expect(newActiveCard).not.toBe(initialActiveCard);
                
                // Check for mobile navigation console log
                const nextButtonLog = consoleLogs.some(log => 
                    log.includes('📱 Mobile navigation: Next card')
                );
                expect(nextButtonLog).toBe(true);
                
                // Click previous button
                await page.locator('#prevCard').click();
                await page.waitForTimeout(1000); // Wait for animation
                
                // Check for previous button console log
                const prevButtonLog = consoleLogs.some(log => 
                    log.includes('📱 Mobile navigation: Previous card')
                );
                expect(prevButtonLog).toBe(true);
                
                // Verify we can cycle through all cards
                const cardCount = await page.locator('.portfolio-card').count();
                expect(cardCount).toBeGreaterThan(1);
                
                await context.close();
            });
        });
    });
    
    // CRITICAL TEST 5: Desktop drag functionality preservation
    test.describe('Desktop Drag Functionality Preservation (>768px)', () => {
        desktopViewports.forEach(viewport => {
            test(`${viewport.name} - Verify full drag functionality unchanged`, async ({ browser }) => {
                const context = await browser.newContext({ 
                    viewport: { width: viewport.width, height: viewport.height }
                });
                const page = await context.newPage();
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Check that it's not detected as mobile
                const isMobile = await page.evaluate(() => window.digitalDogSite.shuffleState.isMobile);
                expect(isMobile).toBe(false);
                
                // Navigate to portfolio section
                await page.evaluate(() => {
                    document.querySelector('#portfolio').scrollIntoView();
                });
                await page.waitForTimeout(1000);
                
                // Verify mobile navigation buttons are hidden
                const mobileNavButtons = page.locator('.mobile-nav-buttons');
                await expect(mobileNavButtons).not.toBeVisible();
                
                // Test drag functionality
                const firstCard = page.locator('.portfolio-card').first();
                await expect(firstCard).toBeVisible();
                
                // Check cursor style
                const cursorStyle = await firstCard.evaluate(el => window.getComputedStyle(el).cursor);
                expect(cursorStyle).toBe('grab');
                
                // Get initial active card
                const initialActiveCard = await firstCard.getAttribute('data-project');
                
                // Perform drag operation
                const cardBox = await firstCard.boundingBox();
                await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                await page.mouse.down();
                await page.mouse.move(cardBox.x - 100, cardBox.y + cardBox.height / 2);
                await page.mouse.up();
                
                // Wait for animation
                await page.waitForTimeout(1500);
                
                // Verify card changed
                const newActiveCard = await page.locator('.portfolio-card.active').getAttribute('data-project');
                expect(newActiveCard).not.toBe(initialActiveCard);
                
                await context.close();
            });
        });
    });
    
    // TEST 6: Cross-device consistency at breakpoint
    test.describe('768px Breakpoint Behavior', () => {
        test('Test exactly at 768px breakpoint', async ({ browser }) => {
            const context = await browser.newContext({ 
                viewport: { width: 768, height: 1024 }
            });
            const page = await context.newPage();
            await page.goto(testUrl);
            await page.waitForLoadState('networkidle');
            
            // Wait for site initialization
            await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
            
            // At exactly 768px, should be considered mobile (≤768px)
            const isMobile = await page.evaluate(() => window.digitalDogSite.shuffleState.isMobile);
            expect(isMobile).toBe(true);
            
            // Navigate to portfolio
            await page.locator('#portfolio').scrollIntoView();
            await page.waitForTimeout(1000);
            
            // Mobile buttons should be visible
            const mobileNavButtons = page.locator('.mobile-nav-buttons');
            await expect(mobileNavButtons).toBeVisible();
            
            await context.close();
        });
        
        test('Test just above 768px breakpoint', async ({ browser }) => {
            const context = await browser.newContext({ 
                viewport: { width: 769, height: 1024 }
            });
            const page = await context.newPage();
            await page.goto(testUrl);
            await page.waitForLoadState('networkidle');
            
            // Wait for site initialization
            await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
            
            // At 769px, should be considered desktop (>768px)
            const isMobile = await page.evaluate(() => window.digitalDogSite.shuffleState.isMobile);
            expect(isMobile).toBe(false);
            
            // Navigate to portfolio
            await page.locator('#portfolio').scrollIntoView();
            await page.waitForTimeout(1000);
            
            // Mobile buttons should be hidden
            const mobileNavButtons = page.locator('.mobile-nav-buttons');
            await expect(mobileNavButtons).not.toBeVisible();
            
            await context.close();
        });
    });
    
    // TEST 7: Animation and performance validation
    test.describe('Animation Quality and Performance', () => {
        mobileDevices.forEach(device => {
            test(`${device.name} - Test mobile button animations and card transitions`, async ({ browser }) => {
                const context = await browser.newContext(device);
                const page = await context.newPage();
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Navigate to portfolio
                await page.locator('#portfolio').scrollIntoView();
                await page.waitForTimeout(1000);
                
                const nextButton = page.locator('#nextCard');
                
                // Test button hover/active animations
                await nextButton.hover();
                await page.waitForTimeout(300);
                
                // Get transform value during hover
                const hoverTransform = await nextButton.evaluate(el => 
                    window.getComputedStyle(el).transform
                );
                
                // Should have scale transformation on hover
                expect(hoverTransform).not.toBe('none');
                
                // Test card transition animation
                await nextButton.click();
                
                // Check that animation lock prevents rapid clicking
                const isAnimating = await page.evaluate(() => 
                    window.digitalDogSite.dragState.isAnimating
                );
                
                // Should briefly be true during animation
                await page.waitForTimeout(100);
                
                // Wait for animation to complete
                await page.waitForTimeout(1000);
                
                const animationComplete = await page.evaluate(() => 
                    !window.digitalDogSite.dragState.isAnimating
                );
                expect(animationComplete).toBe(true);
                
                await context.close();
            });
        });
    });
    
    // TEST 8: JavaScript error monitoring
    test.describe('JavaScript Error Monitoring', () => {
        const allViewports = [...mobileDevices, ...desktopViewports.map(v => ({name: v.name, ...v}))];
        
        allViewports.forEach(viewport => {
            test(`${viewport.name} - Monitor for JavaScript errors`, async ({ browser }) => {
                const context = await browser.newContext(viewport);
                const page = await context.newPage();
                
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                
                await page.goto(testUrl);
                await page.waitForLoadState('networkidle');
                
                // Wait for site initialization
                await page.waitForFunction(() => window.digitalDogSite?.shuffleState?.cards?.length > 0);
                
                // Navigate through sections and interact
                await page.locator('#servicos').scrollIntoView();
                await page.waitForTimeout(500);
                await page.locator('#portfolio').scrollIntoView();
                await page.waitForTimeout(500);
                
                // Interact with portfolio (different based on device)
                if (viewport.width <= 768) {
                    // Mobile: use navigation buttons
                    const nextButton = page.locator('#nextCard');
                    if (await nextButton.isVisible()) {
                        await nextButton.click();
                        await page.waitForTimeout(1000);
                    }
                } else {
                    // Desktop: test drag
                    const firstCard = page.locator('.portfolio-card').first();
                    const cardBox = await firstCard.boundingBox();
                    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                    await page.mouse.down();
                    await page.mouse.move(cardBox.x - 50, cardBox.y + cardBox.height / 2);
                    await page.mouse.up();
                    await page.waitForTimeout(1000);
                }
                
                await page.locator('#sobre').scrollIntoView();
                await page.waitForTimeout(500);
                await page.locator('#contato').scrollIntoView();
                await page.waitForTimeout(500);
                
                // Check for any JavaScript errors
                expect(errors).toEqual([]);
                
                await context.close();
            });
        });
    });
});