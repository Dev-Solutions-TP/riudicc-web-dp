---
name: riudicc-ui-review
description: Review and improve an existing RIUDICC Angular screen for usability, responsive layout, accessibility, and consistency with its DaisyUI theme. Use when asked to audit, polish, or fix the UI/UX of an existing page or component.
---

# RIUDICC UI/UX review

Review the requested screen in the context of the current application and make focused improvements.

## Workflow
1. Read the root `AGENTS.md` and inspect the target template, component, route, neighboring screens, and shared layout.
2. Determine the screen's main user task, primary action, secondary actions, and key information hierarchy.
3. Check the screen at narrow and wide viewport assumptions:
   - Headings and actions remain aligned or stack cleanly.
   - Forms have readable labels, useful spacing, and visible validation.
   - Tables remain usable on mobile.
   - Navigation and actions do not overlap or become ambiguous.
4. Check accessibility:
   - Semantic heading order and landmarks.
   - Form labels and helpful error text.
   - Keyboard operation and visible focus.
   - Icon buttons have accessible names.
   - State is conveyed with text, not color alone.
5. Check design consistency against existing DaisyUI 5 components, Tailwind CSS 4 conventions, Montserrat, and the configured palette.
6. Make the smallest coherent set of changes that improves the task flow. Preserve API behavior, route structure, data, and backend role enforcement.
7. Summarize the UX issues addressed and any checks actually performed. Do not claim visual inspection or tests that were not done.

## Review priorities
- Make the primary action easy to find without competing with the page title.
- Group related fields and actions; keep destructive actions distinguishable and confirm them when appropriate.
- Provide loading, empty, success, and error feedback for asynchronous actions.
- Prefer clear Spanish labels consistent with the rest of the interface.
- Avoid decorative redesigns that reduce contrast, readability, or consistency.
