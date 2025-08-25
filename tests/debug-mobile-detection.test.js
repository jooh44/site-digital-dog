const { test, expect, devices } = require('@playwright/test');

// Debug test to verify mobile detection and drag disabling
test.describe('Debug Mobile Detection', () => {
    test('Mobile detection and drag behavior debugging', async ({ browser }) => {
        const context = await browser.newContext(devices['iPhone 12']);
        const page = await context.newPage();
        
        // Capture all console messages
        const consoleLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            consoleLogs.push({
                type: msg.type(),
                text: text
            });
            console.log(`[${msg.type()}] ${text}`);
        });
        
        // Capture any errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
            console.log('Page error:', error.message);
        });
        
        const testUrl = 'file://' + process.cwd() + '/index.html';
        console.log('Loading:', testUrl);
        
        await page.goto(testUrl);
        await page.waitForLoadState('networkidle');
        
        // Wait for site initialization
        await page.waitForTimeout(2000);
        
        // Check if the site initialized
        const siteInitialized = await page.evaluate(() => {
            return window.digitalDogSite ? true : false;
        });
        console.log('Site initialized:', siteInitialized);
        
        if (siteInitialized) {
            // Check mobile detection
            const shuffleState = await page.evaluate(() => {
                return window.digitalDogSite.shuffleState ? {
                    isMobile: window.digitalDogSite.shuffleState.isMobile,
                    cardCount: window.digitalDogSite.shuffleState.cards ? window.digitalDogSite.shuffleState.cards.length : 0
                } : null;
            });
            console.log('Shuffle state:', shuffleState);
            
            // Check if mobile navigation buttons are present
            const mobileButtons = await page.locator('.mobile-nav-buttons').count();
            console.log('Mobile navigation buttons found:', mobileButtons);
            
            if (mobileButtons > 0) {
                const prevButton = await page.locator('#prevCard').isVisible();
                const nextButton = await page.locator('#nextCard').isVisible();
                console.log('Previous button visible:', prevButton);
                console.log('Next button visible:', nextButton);
            }
            
            // Navigate to portfolio section
            await page.evaluate(() => {
                document.querySelector('#portfolio').scrollIntoView();
            });
            await page.waitForTimeout(1000);
            
            // Try to trigger a drag event
            const firstCard = page.locator('.portfolio-card').first();
            const cardCount = await firstCard.count();
            console.log('Portfolio cards found:', cardCount);
            
            if (cardCount > 0) {
                await expect(firstCard).toBeVisible();
                
                // Get card position
                const cardBox = await firstCard.boundingBox();
                console.log('Card position:', cardBox);
                
                // Try touchscreen tap
                await page.touchscreen.tap(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                await page.waitForTimeout(100);
                
                // Try mouse events
                await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
                await page.mouse.down();
                await page.waitForTimeout(100);
                await page.mouse.move(cardBox.x + 50, cardBox.y + cardBox.height / 2);
                await page.waitForTimeout(100);
                await page.mouse.up();
                
                await page.waitForTimeout(500);
            }
        }
        
        // Output all console logs
        console.log('\n=== All Console Logs ===');
        consoleLogs.forEach((log, index) => {
            console.log(`${index + 1}. [${log.type}] ${log.text}`);
        });
        
        // Check for the specific drag disabled message
        const dragDisabledLog = consoleLogs.some(log => 
            log.text.includes('📱 Drag disabled on mobile - scroll freely!')
        );
        console.log('\nDrag disabled log found:', dragDisabledLog);
        
        // Output any page errors
        if (pageErrors.length > 0) {
            console.log('\n=== Page Errors ===');
            pageErrors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        // Take a screenshot for visual verification
        await page.screenshot({ path: 'debug-mobile-detection.png', fullPage: true });
        
        await context.close();
        
        // Basic assertions
        expect(siteInitialized).toBe(true);
        expect(pageErrors).toHaveLength(0);
    });
});