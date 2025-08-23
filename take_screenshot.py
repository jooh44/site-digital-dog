import asyncio
from playwright.async_api import Playwright, async_playwright, expect

async def run():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the local file
        await page.goto("file:///C:/Users/Administrador/Documents/Projetos/Digital Dog/Site Digital Dog/index.html")

        # Wait for the page to load completely
        await page.wait_for_load_state('networkidle')

        # Take a screenshot
        await page.screenshot(path="C:\\Users\\Administrador\\Documents\\Projetos\\Digital Dog\\Site Digital Dog\\screenshot.png", full_page=True)
        print("Screenshot saved as screenshot.png")

        await browser.close()

asyncio.run(run())
