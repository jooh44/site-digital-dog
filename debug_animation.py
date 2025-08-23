import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()

        # Listen for all console messages and print them
        page.on("console", lambda msg: print(f"CONSOLE ({msg.type}): {msg.text}"))

        # Navigate to the local file
        await page.goto("file:///C:/Users/Administrador/Documents/Projetos/Digital Dog/Site Digital Dog/index.html")

        # Wait for a bit to ensure all scripts have loaded and tried to run
        await asyncio.sleep(5)

        await browser.close()

asyncio.run(run())