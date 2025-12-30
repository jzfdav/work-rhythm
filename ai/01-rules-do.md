# Rules: DO

## Philosophy
- **DO** prefer removal over addition. If a feature can be removed, remove it.
- **DO** maintain the "clock" mental model. The app is a mirror of time, nothing more.
- **DO** ensure statelessness. Every function should ideally be pure or rely only on the current `Date`.

## Coding Standards
- **DO** use TypeScript with strict mode.
- **DO** use React Functional Components.
- **DO** use Framer Motion for all state transitions (smoothness is key).
- **DO** use Biome for linting and formatting.
- **DO** keep components small and single-purpose.

## Workflow
- **DO** verify changes by checking the app at different "times" (mocking `Date` if necessary).
- **DO** ensure the app remains offline-capable after any change.
