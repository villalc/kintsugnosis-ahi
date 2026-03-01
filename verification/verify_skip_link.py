import os
import time
from playwright.sync_api import sync_playwright

def verify_skip_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to the file
        cwd = os.getcwd()
        file_path = f"file://{cwd}/sites/ahigovernance.com/index.html"

        print(f"Loading: {file_path}")
        page.goto(file_path)

        # Press Tab to focus the first element
        page.keyboard.press("Tab")

        print("Waiting for transition...")
        time.sleep(1)

        # Get the focused element
        focused = page.evaluate("document.activeElement.className")
        text = page.evaluate("document.activeElement.innerText")
        print(f"Focused element class: {focused}")
        print(f"Focused element text: {text}")

        # Check if it is the skip link
        if "skip-link" in focused:
            print("SUCCESS: Skip link is focused.")
        else:
            print("FAILURE: Skip link is NOT focused.")

        # Take a screenshot to verify visibility
        page.screenshot(path="verification/skip_link_focused_delayed.png")

        browser.close()

if __name__ == "__main__":
    verify_skip_link()
