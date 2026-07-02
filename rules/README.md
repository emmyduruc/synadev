# SYNA Code Standards

These rules are enforced by ESLint, pre-commit hooks, and Cursor AI.

Run before committing:

```bash
yarn check
```

## Naming

| Target | Convention | Example |
|--------|------------|---------|
| Variables | camelCase | `userName`, `isLoading` |
| Functions | camelCase arrow functions | `const fetchUser = async () => {}` |
| Translation keys | snake_case | `welcome_message`, `sign_in_button` |
| Files (components) | PascalCase | `UserCard.tsx` |
| Files (utils/hooks) | camelCase | `useAuth.ts`, `formatDate.ts` |

## Functions

- Use arrow functions only: `const fn = () => {}`
- No `function` declarations
- No classes (except NestJS backend boilerplate: controllers, services, modules, DTOs)

## Exports

- Use named exports: `export const Component = () => {}`
- No default exports (exception: Expo Router `app/**` route files require `export default`)

## Architecture

- **Components** (`client/components`, `client/app`): UI only — no API calls, no business logic
- **Hooks** (`client/hooks`): reusable stateful logic
- **Lib** (`client/lib`, `packages/*`): API clients, utilities, schemas
- Components must not import from `@/lib/api`, `@/lib/http`, or `axios` directly — use hooks instead
- HTTP uses Axios with Zod-validated `apiRequest()` — request/response schemas from `@syna/shared-types`

## Translation files

Locale files (`*.en.json`, `*.de.json`, `locales/**`, `i18n/**`) must use snake_case keys.

## Commits

Commits are blocked when `yarn check` fails (lint errors, lint warnings, type errors, i18n violations).

## UI colors (client components & screens)

No hardcoded hex/rgb color strings in `client/components/**` or `client/app/**`.

| Use case | Source |
|----------|--------|
| Tailwind `className` | Token classes from `tailwind.config.ts` (`text-primary-600`, etc.) |
| Runtime color props (`tintColor`, `placeholderTextColor`, `ActivityIndicator`, `StyleSheet`) | `semanticColors` from `@/lib/ui` |
| Design token values | `@/utils/colors` (re-exports `@syna/design-tokens`) |

Add new semantic runtime colors to `client/lib/ui/semanticColors.ts`.

## String comparisons (client components & screens)

Do not use string literals in `===` / `!==`, ternary expressions, or `.includes()` checks.

Define named constants in `@/lib/ui` (e.g. `BUTTON_VARIANT`, `PLATFORM_OS`, `VALIDATION_CHARS`) and compare against those.

Enforced by ESLint (`packages/eslint-config/rules/component-standards.mjs`).
