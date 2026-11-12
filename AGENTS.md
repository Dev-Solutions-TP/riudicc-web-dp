# RIUDICC frontend agent instructions

## Stack and conventions
- Use Angular 19, standalone components, TypeScript, and the existing Angular Router patterns.
- Use the existing signals, `rxResource`, and RxJS patterns when they match nearby code. Prefer reactive forms for forms.
- Use Tailwind CSS 4 and DaisyUI 5. The global theme and Montserrat font are already configured; do not add UI dependencies or redefine theme tokens for a one-screen change.
- Prefer shared components and existing utilities over duplicating pagination, tables, form helpers, or layout behavior.

## Component design
- Keep route pages focused on orchestration, data loading, and navigation.
- Keep reusable tables and visual details in focused child components. Follow the existing list page, table, and detail page separation.
- Inspect neighboring features before choosing a folder structure or API pattern.
- Preserve API contracts, authorization behavior, and role restrictions. The UI must not be treated as the source of authorization.

## UI/UX
- Build responsive layouts for narrow and wide screens. Tables should remain usable on mobile, using horizontal scrolling or an appropriate card layout.
- Use semantic HTML, associated form labels, visible keyboard focus, clear validation messages, and accessible names for icon-only controls.
- Provide clear loading, empty, success, and error states for asynchronous screens.
- Use DaisyUI semantic classes and the existing palette: primary `rgb(38, 34, 98)`, secondary `rgb(236, 106, 101)`, accent `rgb(245, 195, 81)`.
- Avoid arbitrary inline styles and avoid editing global CSS unless the requested change needs it.

## Before finishing
- Summarize the files and behavior changed.
- Report checks that were actually run. Do not claim a build or tests passed unless they were run.
