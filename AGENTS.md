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

## Existing RIUDICC UI patterns
- Public institution and observatory imagery uses `ImageNamePipe` with typed `ImageEntity[]` data. Pass the appropriate folder key, such as `uni`; do not build API image URLs inside page components.
- Static page text belongs in `src/app/shared/utils/app-text.ts` with Spanish, English, and French values. Read it through `LocalizationService.getText`; do not derive language from `document.documentElement.lang`.
- Keep admin list pages, tables, and record detail forms in separate components. Route pages should coordinate requests and navigation while child components own table rows and form controls.
- Use `FormErrorLabelComponent` below reactive form controls for field validation. Keep shared validation messages in `FormUtils` rather than adding repeated inline error text.
- Use `AlertMessageComponent` for request-level success or failure messages. Do not duplicate alert markup in feature templates.
- Optional string fields must accept blank input on both sides of the API contract: normalize blank or whitespace-only values to `null` in the form payload and transform them to `null` in DTOs before `@IsOptional()` validation. This lets edits clear previously saved values.
- For URLs, validate non-empty values in the form and DTO, while allowing `''`, `null`, or omitted values for optional links.

## Before finishing
- Summarize the files and behavior changed.
- Report checks that were actually run. Do not claim a build or tests passed unless they were run.
