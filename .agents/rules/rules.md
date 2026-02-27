---
trigger: always_on
---

# Rules for Expo and React Native

This document outlines the standardized rules and guidelines for developing mobile applications using Expo and React Native. These rules are designed to ensure consistency, maintainability, performance, accessibility, and error-free development across all projects. They apply to all Expo-based React Native apps and are crafted to minimize troubleshooting efforts and enforce best practices.

Whenever possible, use your skills to leave the code professional and with zero errors or bad practices.

## Code Style and Structure

- Write concise, technical TypeScript code with clear, accurate examples.
- Use functional and declarative programming patterns; avoid class-based components.
- Prioritize modularization and iteration to prevent code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`, `shouldRender`).
- Organize files in a consistent structure:
    - Exported main component
    - Subcomponents
    - Helper functions
    - Static content (e.g., constants, mock data)
    - TypeScript types/interfaces
- Follow Expo's official documentation for project setup and configuration: https://docs.expo.dev/
- Keep components small and focused, with a single responsibility per component.
- Use barrel files (`index.ts`) for exporting multiple modules from a directory.
- **Prevent Nested Projects**: Cursor must never create a new Expo or React Native project inside an existing project. Before scaffolding, check for the presence of `app.json`, `package.json`, or `node_modules`. If detected, modify the existing project instead of initializing a new one. If unsure, prompt the user to confirm the project root.

## Naming Conventions

- Use lowercase with dashes for directories (e.g., `components/auth-flow`, `utils/api`).
- Use PascalCase for component names (e.g., `AuthButton`, `ProfileCard`).
- Use camelCase for variables, functions, and hooks (e.g., `fetchUserData`, `useAuthState`).
- Favor named exports for components and utilities (e.g., `export function MyComponent`).
- Prefix custom hooks with `use` (e.g., `useDeviceOrientation`).
- Use clear, intention-revealing names for files (e.g., `AuthContext.ts`, `UserProfileScreen.tsx`).

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over type aliases for object shapes.
- Avoid enums; use constant maps or union types instead.
- Enable strict mode in `tsconfig.json` for enhanced type safety.
- Define interfaces for component props and state (e.g., `interface MyComponentProps`).
- Use explicit return types for functions and avoid `any` unless absolutely necessary.
- Leverage utility types (e.g., `Partial`, `Pick`, `Omit`) to reduce boilerplate.
- Ensure all props and state are typed, including optional properties with `?`.

## Syntax and Formatting

- Use the `function` keyword for pure functions to distinguish them from components.
- Avoid unnecessary curly braces in conditionals; prefer concise syntax for simple statements (e.g., `if (condition) return null`).
- Write declarative JSX with minimal logic; extract complex logic to hooks or helpers.
- Use Prettier for consistent code formatting with default settings:
    - Single quotes
    - Trailing commas
    - 2-space indentation
- Enforce ESLint with React Native and TypeScript-specific rules for code quality.
- Avoid inline styles; use a styling solution (see UI and Styling).

## UI and Styling

- Use Expo's built-in components (e.g., `View`, `Text`, `Image`) for standard UI patterns.
- Implement responsive design using Flexbox and Expo's `useWindowDimensions` for dynamic layouts.
- Choose a consistent styling approach:
    - Option 1: Styled-components for component-scoped styles.
    - Option 2: Tailwind CSS (via `nativewind`) for utility-first styling.
    - Option 3: `StyleSheet.create` for vanilla React Native styles.
- Support dark mode using Expo's `useColorScheme` hook.
- Ensure high accessibility (a11y) standards:
    - Use ARIA roles and native accessibility props (e.g., `accessibilityLabel`, `accessibilityRole`).
    - Test with screen readers (e.g., VoiceOver on iOS, TalkBack on Android).
    - Ensure sufficient color contrast and touch target sizes (minimum 44x44 pixels).
- Use consistent theming with a design system (e.g., define colors, typography, and spacing in a `theme.ts` file).

## Safe Area Management

- Handle notches, status bars, and other screen insets dynamically.
- Use `SafeAreaView` from Expo or React Native to wrap top-level components.
- For scrollable content, use a custom `SafeAreaScrollView` component to respect safe area boundaries.
- Avoid hardcoding padding or margins for safe areas; rely on safe area utilities or context.

## Performance Optimization

- Minimize `useState` and `useEffect`; prefer context or reducers for complex state management.
- Optimize app startup with Expo's `SplashScreen` for a smooth loading experience.
- Optimize images:
    - Use WebP format where supported.
    - Include size data (width/height) to prevent layout shifts.
    - Implement lazy loading for images below the fold.
- Use code splitting and lazy loading for non-critical components with `React.lazy` and `Suspense`.
- Profile performance using React Native's built-in tools (e.g., `PerformanceMonitor`) and Expo's debugging features.
- Prevent unnecessary re-renders:
    - Memoize components with `React.memo`.
    - Use `useMemo` and `useCallback` for expensive computations and callbacks.
- Limit re-renders in lists by using `key` props and optimizing `FlatList`/`SectionList` components.

## Navigation

- Implement navigation using a library or custom solution suitable for the project.
- Support deep linking for seamless navigation from external sources (e.g., push notifications, URLs).
- Ensure navigation state is preserved across app restarts using Expo's tools.
- Use type-safe navigation with TypeScript to prevent runtime errors.

## State Management

- Use React Context with `useReducer` for global state management.
- For data fetching, prefer a lightweight solution (e.g., custom hooks with `fetch` or `axios`).
- For complex state, consider libraries like Zustand or Redux Toolkit.
- Avoid over-fetching; cache API responses where appropriate.
- Handle URL parameters and query strings using Expo's linking utilities.

## Error Handling and Validation

- Implement robust error handling:
    - Handle errors at the start of functions with early returns.
    - Avoid nested `if` statements; use the `if-return` pattern.
    - Eliminate unnecessary `else` clauses.
- Use global error boundaries to catch and display unexpected errors gracefully.
- Log errors in production using a service like Sentry or Expo's error reporting tools.
- Validate user inputs at both UI and API levels:
    - Use runtime validation libraries for form inputs.
    - Sanitize inputs to prevent injection attacks.
- Provide clear, user-friendly error messages for all failure cases.

## Testing

- Write unit tests for components and utilities using Jest and React Native Testing Library.
- Implement integration tests for critical user flows using Detox or similar tools.
- Use Expo's testing utilities to run tests in iOS and Android environments.
- Consider snapshot testing for UI components to detect unintended changes.
- Aim for at least 80% test coverage for critical paths.
- Mock external dependencies (e.g., APIs, device features) to ensure reliable tests.

## Security

- Sanitize all user inputs to prevent XSS and injection attacks.
- Store sensitive data (e.g., tokens, credentials) securely using `react-native-encrypted-storage` or Expo's secure storage.
- Use HTTPS for all API communications and enforce proper authentication (e.g., OAuth, JWT).
- Follow Expo's security guidelines: https://docs.expo.dev/guides/security/
- Regularly audit dependencies for vulnerabilities using `expo doctor` or `npm audit`.

## Internationalization (i18n)

- Support multiple languages using `expo-localization` or a similar library.
- Implement RTL (right-to-left) layouts for languages like Arabic and Hebrew.
- Ensure text scaling and font adjustments for accessibility.
- Use translation keys (e.g., `t('welcome_message')`) instead of hardcoded strings.
- Test i18n features in different locales during QA.

## Web Platform Support

- Enable web support for all Expo and React Native projects by default.
- When initializing a project with `expo init`, include the `--template blank` option and ensure `web` is listed as a supported platform in `app.json`:
    ```json
    {
        "expo": {
            "platforms": ["ios", "android", "web"]
        }
    }
    ```
- Install necessary web dependencies:
    - `react-native-web`
    - `react-dom`
    - `@expo/webpack-config`
- Configure `metro.config.js` to support web extensions (e.g., `.web.tsx`, `.web.ts`):
    ```js
    module.exports = {
        resolver: {
            sourceExts: ['web.tsx', 'web.ts', 'tsx', 'ts', 'js'],
        },
    };
    ```
- Use `Platform.OS` checks to handle platform-specific logic for web:

    ```tsx
    import { Platform } from 'react-native';

    const styles = StyleSheet.create({
        container: {
            padding: Platform.OS === 'web' ? 20 : 10,
        },
    });
    ```

- Test web builds locally using `expo start --web` and ensure compatibility with modern browsers (Chrome, Firefox, Safari).
- Include web-specific configurations in the `Checklist for New Projects` (see below).

## Key Conventions

1. Use Expo's managed workflow for streamlined development and deployment.
2. Prioritize Mobile Web Vitals:
    - Optimize load time (aim for <3 seconds).
    - Minimize jank (maintain 60 FPS).
    - Ensure responsiveness (handle touch events in <100ms).
3. Manage environment variables with `expo-constants`.
4. Handle device permissions gracefully using `expo-permissions`.
5. Implement over-the-air (OTA) updates with `expo-updates`.
6. Follow Expo's best practices for app publishing: https://docs.expo.dev/distribution/introduction/
7. Test extensively on both iOS, Android, and web to ensure cross-platform compatibility.

## Troubleshooting and Error Prevention

- Maintain a consistent project structure to simplify debugging.
- Use TypeScript's strict mode to catch type-related errors early.
- Log errors and performance metrics in development and production.
- Document common issues and resolutions in a `TROUBLESHOOTING.md` file.
- Use Expo's CLI tools (`expo doctor`, `expo start`) to diagnose configuration issues.
- Avoid common pitfalls:
    - Do not use deprecated APIs or libraries.
    - Avoid inline styles for maintainability.
    - Do not ignore TypeScript or ESLint warnings.
    - **Do not create nested projects**: Always verify the project root before scaffolding.
- Regularly update dependencies to avoid compatibility issues.

## Documentation

- Maintain a `README.md` with setup instructions, project overview, and key scripts.
- Document custom components, hooks, and utilities with JSDoc or TypeScript comments.
- Reference Expo's official documentation for setup and best practices: https://docs.expo.dev/

## Recommended Tools

- **Editor**: VS Code with ESLint, Prettier, and TypeScript extensions.
- **Linting**: ESLint with React Native and TypeScript plugins.
- **Formatting**: Prettier with default settings.
- **CI/CD**: Use GitHub Actions or similar for automated testing and deployment.
