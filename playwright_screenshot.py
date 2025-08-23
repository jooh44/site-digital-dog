from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("file:///C:/Users/Administrador/Documents/Projetos/Digital Dog/Site Digital Dog/index.html")
    page.screenshot(path="C:\Users\Administrador\Documents\Projetos\Digital Dog\Site Digital Dog\transition_screenshot.png", full_page=True)
    browser.close()
