import asyncio
from playwright.async_api import Playwright, async_playwright, expect

async def run():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()

        # Listen for console messages
        page.on("console", lambda msg: print(f"Console [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page error: {err}"))

        # Navigate to the local file
        await page.goto("file:///C:/Users/Administrador/Documents/Projetos/Digital Dog/Site Digital Dog/index.html")

        # Wait for the shuffle portfolio to be initialized
        await page.wait_for_selector(".portfolio-card.active")

        # Locate the active card
        active_card = await page.query_selector(".portfolio-card.active")
        if active_card:
            print("Active card found. Attempting to drag...")
            
            # Get bounding box of the card
            box = await active_card.bounding_box()
            if box:
                start_x = box["x"] + box["width"] / 2
                start_y = box["y"] + box["height"] / 2
                
                # Hover over the element to ensure Playwright targets it correctly
                await active_card.hover()

                # Simulate drag action
                await page.mouse.down()
                await page.mouse.move(start_x + 200, start_y, steps=10) # Drag 200px to the right
                await page.mouse.up()
                print("Drag action simulated.")
            else:
                print("Could not get bounding box of the active card.")
        else:
            print("No active card found.")

        # Wait for a few seconds to observe the effect and capture logs
        await asyncio.sleep(5)

        await browser.close()

asyncio.run(run())
