## 2026-01-29 - Accessibility gaps in static sites
**Learning:** Static landing pages often rely on `title` attributes for icon-only links, which are insufficient for modern screen reader accessibility compared to `aria-label`.
**Action:** Always verify icon-only links in static HTML templates and add explicit `aria-label` attributes.

## 2026-02-14 - Native Form Feedback Gap
**Learning:** Using native Formspree submission (`action="..."`) on static sites causes a visual dead zone between click and navigation, leading to rage-clicks.
**Action:** Always inject a lightweight `onsubmit` handler to disable the button and show "Sending..." state, even for non-AJAX forms.

## 2026-05-21 - Dynamic Content Announcement
**Learning:** Asynchronous UI updates (like the Alpha Neural Bridge result) are silent to screen readers unless explicitly marked, leaving users waiting without feedback.
**Action:** Use `aria-live="polite"` and `aria-atomic="true"` on containers that receive dynamic content updates to ensure announcements without interrupting navigation.

## 2026-06-25 - Drag-and-Drop Visual Feedback
**Learning:** Native drag-and-drop interactions in browsers provide zero visual feedback by default, leaving users guessing if a drop zone is active.
**Action:** Always implement `dragenter` and `dragleave` handlers to toggle a visual class (e.g., `.drag-active`) on drop zones.
