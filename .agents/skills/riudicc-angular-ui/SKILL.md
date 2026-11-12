---
name: riudicc-angular-ui
description: Build or refactor RIUDICC Angular 19 screens, forms, tables, and admin components using this repository's Tailwind CSS 4, DaisyUI 5, theme, and component conventions. Use for frontend UI implementation or component restructuring.
---

# RIUDICC Angular UI implementation

Implement Angular UI changes that fit the existing RIUDICC frontend rather than introducing a second design system.

## Workflow
1. Read the root `AGENTS.md` and inspect the target route, adjacent feature, shared components, and API service before editing.
2. Identify which component owns data loading and navigation, which child components are presentational, and which existing utilities can be reused.
3. Preserve current API shapes, authentication guards, and role rules. Treat frontend permission checks as presentation only; backend authorization remains authoritative.
4. Implement the requested behavior with standalone Angular components and existing Signals, `rxResource`, RxJS, and Reactive Forms patterns.
5. Use Tailwind CSS 4 utilities and DaisyUI 5 semantic component classes. Reuse the configured Montserrat font and theme tokens:
   - Primary: `rgb(38, 34, 98)`
   - Secondary: `rgb(236, 106, 101)`
   - Accent: `rgb(245, 195, 81)`
6. Make the result responsive and accessible. Use semantic headings, labels connected to inputs, keyboard-operable controls, visible focus, sufficient contrast, and text alternatives for meaningful icons.
7. Include relevant loading, empty, validation, success, and error states. Keep long tables usable on small screens.
8. Review the final diff for duplicated components, unused imports, inconsistent labels, accidental global style changes, and permission regressions. Report only validation commands actually executed.

## Component guidance
- Let route pages orchestrate data, pagination, and navigation.
- Extract tables and form/detail views when they have distinct responsibilities or are reused.
- Reuse shared pagination, alert, and localization components where appropriate.
- Keep API calls in the established service layer.
- Avoid broad rewrites when the task only needs a local visual or behavior change.
- Do not add packages or alter the global theme unless the requested feature requires it.
