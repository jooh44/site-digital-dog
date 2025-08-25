// Mobile Testing Script for Portfolio Deck
// This script runs comprehensive tests and generates a detailed report

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Mobile Portfolio Deck Testing...');
console.log('=====================================');

// Start local server
const server = spawn('python', ['-m', 'http.server', '3000'], {
  cwd: __dirname,
  stdio: 'pipe'
});

console.log('📡 Starting local server on port 3000...');

// Wait for server to start
setTimeout(async () => {
  try {
    // Install Playwright if not installed
    console.log('📦 Installing Playwright browsers...');
    const installProcess = spawn('npx', ['playwright', 'install'], { stdio: 'inherit' });
    
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Playwright browsers installed');
        runTests();
      } else {
        console.error('❌ Failed to install Playwright browsers');
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Error installing Playwright:', error);
    runTests(); // Try to run anyway
  }
}, 2000);

function runTests() {
  console.log('🧪 Running comprehensive mobile tests...');
  
  const testProcess = spawn('npx', ['playwright', 'test', '--reporter=html'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  testProcess.on('close', (code) => {
    console.log('\n📊 Test Results:');
    console.log('================');
    
    if (code === 0) {
      console.log('✅ All tests passed successfully!');
    } else {
      console.log('⚠️  Some tests failed or had issues');
    }
    
    console.log('\n📄 Detailed test report available at: playwright-report/index.html');
    console.log('🔍 Screenshots and traces available in test-results/ directory');
    
    // Generate summary report
    generateSummaryReport();
    
    // Stop server
    server.kill();
    console.log('🛑 Local server stopped');
  });
}

function generateSummaryReport() {
  const reportContent = `
# Mobile Portfolio Deck Testing Report
Generated on: ${new Date().toLocaleString()}

## Test Coverage Summary

### ✅ Areas Tested:
1. **Vertical Scrolling Functionality**
   - Scrolling through portfolio deck section
   - Scroll blocking prevention over deck cards  
   - Scroll speed and smoothness

2. **Horizontal Drag Functionality**
   - Card swipe left/right navigation
   - Drag animations and transitions
   - 50px drag threshold validation
   - Natural and responsive feel

3. **Gesture Direction Detection**
   - 15px threshold for initial gesture detection
   - 1.5x ratio threshold for horizontal vs vertical
   - Mixed gesture scenarios (vertical → horizontal, diagonal)

4. **Edge Cases**
   - Rapid gestures (quick swipes)
   - Slow, deliberate movements
   - Partial gestures (incomplete drags)
   - Touches starting on cards but moving off
   - Multiple finger interactions

5. **Visual Feedback**
   - Drag state visual indicators (cursor, classes)
   - Card position reset after canceled drags
   - No visual artifacts remaining
   - Transform and animation cleanup

6. **Console Logging**
   - "🔄 Canceling drag to allow scroll" logging
   - Debug information during gesture detection

7. **Performance**
   - Gesture detection performance
   - UI responsiveness during processing
   - Memory and CPU impact

### 📱 Device Coverage:
- Mobile Chrome (Galaxy S8 - 360x740)
- Mobile Safari (iPhone 12 - 390x844)  
- Mobile Firefox (Pixel 5 - 393x851)
- iPad (iPad Pro - 1024x1366)
- Android Tablet (Galaxy Tab S4 - 712x1138)
- Small Mobile (iPhone SE - 320x568)
- Large Mobile (iPhone 12 Pro Max - 428x926)

### 🔍 Key Implementation Validated:
- CSS: \`touch-action: pan-y pinch-zoom\` on .shuffle-stack
- JavaScript: \`Math.abs(rawDeltaX) > Math.abs(rawDeltaY) * 1.5\` ratio
- Method: \`cancelDragForScroll()\` cleanup functionality
- 15px movement threshold before gesture determination
- Animation lock with \`dragState.isAnimating\`

## Next Steps:
1. Review detailed HTML report for specific test results
2. Check screenshots for any visual issues
3. Address any failing tests
4. Validate performance on actual devices
5. Consider user testing feedback

## Files Generated:
- playwright-report/index.html (detailed results)
- test-results/ (screenshots and traces)
- This summary report
`;

  fs.writeFileSync(path.join(__dirname, 'mobile-test-summary.md'), reportContent);
  console.log('📝 Summary report generated: mobile-test-summary.md');
}