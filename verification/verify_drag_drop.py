import os
from playwright.sync_api import sync_playwright

def verify_drag_drop():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path
        cwd = os.getcwd()
        file_path = f"file://{cwd}/sites/ahigovernance.com/index.html"
        print(f"Loading: {file_path}")

        page.goto(file_path)

        # Locate drop zone
        drop_zone = page.locator("#dropZone")
        drop_zone.scroll_into_view_if_needed()

        # Initial screenshot
        page.screenshot(path="verification/drop_zone_initial.png")

        # Dispatch 'dragenter' event to simulate dragging
        drop_zone.dispatch_event("dragenter")

        # Wait a bit for styles to apply
        page.wait_for_timeout(500)

        # Screenshot active state
        page.screenshot(path="verification/drop_zone_active.png")

        # Check if class was added
        classes = drop_zone.get_attribute("class")
        print(f"Classes: {classes}")
        is_active = "drag-active" in classes
        print(f"Class 'drag-active' present: {is_active}")

        browser.close()

if __name__ == "__main__":
    verify_drag_drop()
