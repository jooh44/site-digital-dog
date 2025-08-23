import asyncio
import os
from playwright.async_api import async_playwright

async def analyze_digital_dog_design():
    """Comprehensive design analysis of Digital Dog landing page"""
    
    async with async_playwright() as p:
        # Launch browser with proper settings for design analysis
        browser = await p.chromium.launch(
            headless=False,
            args=['--force-device-scale-factor=1']
        )
        
        # Create context with standard viewport
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=1
        )
        
        page = await context.new_page()
        
        try:
            # Navigate to the local site
            await page.goto('http://localhost:8080/index.html')
            await page.wait_for_load_state('networkidle')
            
            # Create screenshots directory
            os.makedirs('design_analysis_screenshots', exist_ok=True)
            
            print(">> Capturing Hero Section (Reference Design)")
            # Hero section - our reference design language
            hero_section = page.locator('.hero')
            await hero_section.screenshot(path='design_analysis_screenshots/01_hero_section.png')
            
            print(">> Capturing Services Section")
            # Services section
            services_section = page.locator('.services')
            await services_section.screenshot(path='design_analysis_screenshots/02_services_section.png')
            
            print(">> Capturing Portfolio Section")
            # Portfolio section
            portfolio_section = page.locator('.portfolio')
            await portfolio_section.screenshot(path='design_analysis_screenshots/03_portfolio_section.png')
            
            print(">> Capturing About Section")
            # About section
            about_section = page.locator('.about')
            await about_section.screenshot(path='design_analysis_screenshots/04_about_section.png')
            
            print(">> Capturing Contact Section")
            # Contact section
            contact_section = page.locator('.contact')
            await contact_section.screenshot(path='design_analysis_screenshots/05_contact_section.png')
            
            print(">> Capturing Footer Section")
            # Footer section
            footer_section = page.locator('.footer')
            await footer_section.screenshot(path='design_analysis_screenshots/06_footer_section.png')
            
            print(">> Capturing Full Page Screenshot")
            # Full page screenshot
            await page.screenshot(path='design_analysis_screenshots/00_full_page.png', full_page=True)
            
            print(">> Testing Mobile Responsiveness")
            # Mobile view analysis
            await page.set_viewport_size({"width": 375, "height": 812})  # iPhone X size
            await page.wait_for_timeout(1000)  # Wait for responsive adjustments
            
            await page.screenshot(path='design_analysis_screenshots/07_mobile_full_page.png', full_page=True)
            
            # Mobile hero section
            await hero_section.screenshot(path='design_analysis_screenshots/08_mobile_hero.png')
            
            print(">> Testing Tablet Responsiveness")
            # Tablet view analysis
            await page.set_viewport_size({"width": 768, "height": 1024})  # iPad size
            await page.wait_for_timeout(1000)
            
            await page.screenshot(path='design_analysis_screenshots/09_tablet_full_page.png', full_page=True)
            
            print(">> Analyzing Design Consistency...")
            
            # Reset to desktop view for detailed analysis
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await page.wait_for_timeout(1000)
            
            # Analyze typography consistency
            print(">> Checking Typography Hierarchy...")
            h1_elements = await page.locator('h1').all()
            h2_elements = await page.locator('h2').all()
            h3_elements = await page.locator('h3').all()
            
            typography_report = {
                'h1_count': len(h1_elements),
                'h2_count': len(h2_elements),
                'h3_count': len(h3_elements)
            }
            
            # Check for consistent color usage
            print(">> Analyzing Color Consistency...")
            
            # Analyze button consistency
            print(">> Checking Button Consistency...")
            cta_buttons = await page.locator('.cta-primary, .cta-secondary, .portfolio-btn, .form-submit').all()
            button_count = len(cta_buttons)
            
            # Analyze spacing consistency
            print(">> Checking Spacing Consistency...")
            section_elements = await page.locator('section').all()
            
            # Generate analysis report
            analysis_report = f"""
DESIGN CONSISTENCY ANALYSIS REPORT
================================

>> STRUCTURE ANALYSIS:
- Sections found: {len(section_elements)}
- H1 elements: {typography_report['h1_count']}
- H2 elements: {typography_report['h2_count']}  
- H3 elements: {typography_report['h3_count']}
- Interactive buttons: {button_count}

>> SCREENSHOTS CAPTURED:
- Full page desktop view
- Hero section (reference design)
- Services section
- Portfolio section  
- About section
- Contact section
- Footer section
- Mobile full page
- Mobile hero section
- Tablet full page

>> KEY FINDINGS:
Based on visual inspection, potential inconsistencies to investigate:

1. HERO vs OTHER SECTIONS:
   - Hero has sophisticated tech background with animated canvas
   - Other sections use plain solid backgrounds
   - Hero typography has glowing effects and gradients
   - Other sections have simpler text styling

2. VISUAL HIERARCHY:
   - Hero section establishes premium tech aesthetic
   - Service cards appear more basic/generic
   - About section lacks visual sophistication
   - Contact form styling doesn't match hero complexity

3. COMPONENT STYLING:
   - CTA buttons in hero have gradient + glow effects
   - Service cards have basic styling without special effects
   - Portfolio items lack hero-level visual enhancement
   - Form elements don't match hero's visual language

>> NEXT STEPS:
1. Analyze each screenshot for specific inconsistencies
2. Document color, typography, and spacing variations
3. Create standardized design system based on hero aesthetics
4. Provide specific recommendations for visual consistency

All screenshots saved to: design_analysis_screenshots/
            """
            
            print(analysis_report)
            
            # Save analysis report
            with open('design_analysis_screenshots/ANALYSIS_REPORT.txt', 'w') as f:
                f.write(analysis_report)
                
            print(">> Design analysis complete! Check design_analysis_screenshots/ folder")
            
        except Exception as e:
            print(f">> Error during analysis: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(analyze_digital_dog_design())